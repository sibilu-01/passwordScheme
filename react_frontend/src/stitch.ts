import {
  Stitch,
  RemoteMongoClient,
  StitchAppClient,
  AnonymousCredential,
  RemoteMongoDatabase,
  StitchUser
} from 'mongodb-stitch-browser-sdk';
import { ObjectId } from 'bson';


export enum LogItemType {
  CREATE_START,
  CREATE_RESET,
  CONFIRM_TRY,
  CONFIRM_RESET,
  CONFIRM_COMPLETE,
  TEST_ENTRY_FAIL,
  TEST_ENTRY_PASS,
  TEST_FAIL,
  TEST_SUCCESS,
  FINISH
}

export class LogItem {
  _id: string = "";

  constructor(
    private timestamp: Date,
    private type: LogItemType,
    private passwordType: string,
    private progressId: string,
    private userId: string
  ) { }

  toJSON() {
    return {
      timestamp: this.timestamp.getTime(),
      type: this.type.toString(),
      passwordType: this.passwordType,
      progressId: this.progressId,
      userId: this.userId
    }
  }
}

export class ProgressItem {
  _id: string = "";

  constructor(
    private userId: string,
    private emailPassword: string,
    private bankingPassword: string,
    private shoppingPassword: string,
    private testedEmail: boolean,
    private testedBanking: boolean,
    private testedShopping: boolean
  ) { }

  toJSON() {
    return {
      userId: this.userId,
      emailPassword: this.emailPassword,
      bankingPassword: this.bankingPassword,
      shoppingPassword: this.shoppingPassword,
      testedEmail: this.testedEmail,
      testedBanking: this.testedBanking,
      testedShopping: this.testedShopping
    }
  }

  static fromJSON(json: any): ProgressItem {
    const progress = new ProgressItem(
      json.userId,
      json.emailPassword,
      json.bankingPassword,
      json.shoppingPassword,
      json.testedEmail,
      json.testedBanking,
      json.testShopping
    );
    progress._id = json._id;
    return progress;
  }
}

export class StitchService {
  private static client: StitchAppClient;
  private static db: RemoteMongoDatabase;
  private static readonly PROGRESS_COL = "progress";
  private static readonly LOGS_COL = "logs";

  constructor() {
    if (!StitchService.client) {
      const client = StitchService.client =
        Stitch.initializeDefaultAppClient("comp-3008-project-jjpdf");
      const mongodb = client.getServiceClient(
        RemoteMongoClient.factory,
        "mongodb-atlas"
      );
      StitchService.db = mongodb.db("database");
    }
  }

  isLoggedIn() {
    return StitchService.client.auth.isLoggedIn;
  }

  login(): Promise<StitchUser> {
    if (!StitchService.client.auth.isLoggedIn) {
      return Stitch.defaultAppClient.auth
        .loginWithCredential(new AnonymousCredential());
    } else return Promise.resolve(this.getStitchUser());
  }

  logout() {
    StitchService.client.auth.logout();
  }

  getStitchUser(): StitchUser {
    const user = StitchService.client.auth.user;
    if (user === undefined) throw new Error("user is not logged in");
    return user;
  }

  startProgress(stitchUser: StitchUser): Promise<ProgressItem> {
    return new Promise((resolve, reject) => {
      const progress = new ProgressItem(
        stitchUser.id,
        "", "", "", false, false, false
      );
      StitchService.db.collection(StitchService.PROGRESS_COL)
        .insertOne(progress.toJSON())
        .then(result => {
          progress._id = "" + result.insertedId;
          resolve(progress);
        })
        .catch(reject);
    })
  }

  getProgress(progressId: string): Promise<ProgressItem | null> {
    return new Promise((resolve, reject) => {
      StitchService.db.collection(StitchService.PROGRESS_COL)
        .findOne({ _id: new ObjectId(progressId) })
        .then(res => resolve(res ? ProgressItem.fromJSON(res) : null))
        .catch(reject);
    });
  }

  updateProgress(progress: ProgressItem): Promise<void> {
    return new Promise((resolve, reject) => {
      StitchService.db.collection(StitchService.PROGRESS_COL)
        .updateOne({ _id: new ObjectId(progress._id) }, progress.toJSON())
        .then(() => resolve())
        .catch(reject);
    });
  }

  postLog(log: LogItem): Promise<LogItem> {
    return new Promise((resolve, reject) => {
      StitchService.db.collection(StitchService.LOGS_COL)
        .insertOne(log.toJSON())
        .then(result => {
          log._id = "" + result.insertedId;
          resolve(log);
        })
        .catch(reject);
    });
  }
}

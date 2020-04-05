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
  CREATE_PASSWORD,
  CREATE_RESET,
  CREATE_READY,
  CONFIRM_SHOW,
  CONFIRM_INCORRECT,
  CONFIRM_CORRECT,
  CONFIRM_COMPLETE,
  TEST_SHOW,
  TEST_INCORRECT,
  TEST_CORRECT,
  TEST_FAIL,
  TEST_PASS,
  FINISH
}

export class LogItem {
  _id: ObjectId | undefined;
  readonly scheme: string = "colourCircles";
  readonly mode: string = "9:0-7";

  constructor(
    private time: Date,
    private userId: ObjectId,
    private site: string, // type
    private eventAndDetails: LogItemType, // event_details
    private data: string,
    private progressId: ObjectId
  ) { }

  toJSON() {
    return {
      time: this.time.getTime(),
      userId: this.userId,
      site: this.site,
      scheme: this.scheme,
      mode: this.mode,
      eventAndDetails: LogItemType[this.eventAndDetails],
      data: this.data,
      progressId: this.progressId
    }
  }

  static fromJSON(json: any): LogItem {
    const eventAndDetails: LogItemType = (LogItemType as any)[json.eventAndDetails];
    const item = new LogItem(
      new Date(json.time),
      json.userId,
      json.site,
      eventAndDetails,
      json.data,
      json.progressId
    );
    item._id = json._id;
    return item;
  }
}

export class ProgressItem {
  _id: ObjectId | undefined;

  constructor(
    private userId: ObjectId,
    private userName: string,
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
      userName: this.userName,
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
      json.userName,
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
        new ObjectId(stitchUser.id),
        `Participant ${prompt("Please enter your participant number")}`,
        "", "", "", false, false, false
      );
      StitchService.db.collection(StitchService.PROGRESS_COL)
        .insertOne(progress.toJSON())
        .then(result => {
          progress._id = result.insertedId;
          resolve(progress);
        })
        .catch(reject);
    })
  }

  getProgress(progressId: string): Promise<ProgressItem | null> {
    return new Promise((resolve, reject) => {
      console.log(progressId);
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
          log._id = result.insertedId;
          resolve(log);
        })
        .catch(reject);
    });
  }
}

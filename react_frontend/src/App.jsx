import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as queryString from "query-string";

import { StitchService, LogItem, LogItemType } from "./stitch";

import "./styles.css";
import "./app.css";
import { ObjectId } from "bson";

const stitch = new StitchService();

export default class app extends Component {
  constructor(props) {
    super();
    this.state = {
      list: true,
      card: true,
      paragraphs: [],
      paragraph: {},
    };
  }

  componentDidMount() {
    // fetch(`${BACKEND_ADDRESS}/paragraphs/list`)
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     console.log(responseJson.data);
    //     this.setState({ paragraphs: responseJson });
    //   });
  }

  render() {
    return (
      <Router>
        <div>
          <div className="header">
            <h1>
              <span style={{ color: "red" }}>C</span>
              <span style={{ color: "green" }}>o</span>
              <span style={{ color: "blue" }}>l</span>
              <span style={{ color: "black" }}>o</span>
              <span style={{ color: "pink" }}>u</span>
              <span style={{ color: "brown" }}>r </span>
              Password
            </h1>
          </div>
          <Switch>
            <Route path="/learn" component={Learn} />
            <Route path="/password" component={Password} />
            <Route path="/" component={Homepage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container main">
        <h2>What would you like to do?</h2>
        <div className="buttons">
          <button className="bg-accent">
            <Link to="/learn" className="color-inverse">
              Create passwords
            </Link>
          </button>
          {/* <button className="bg-accent">
            <Link to="/test" className="color-inverse">
              Test passwords
            </Link>
          </button> */}
        </div>
      </div>
    );
  }
}

class Learn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startPasswordScheme(type) {
    const failHandler = (err) => {
      console.error(err);
      alert("Something went wrong :(");
    };
    stitch
      .login()
      .then((stitchUser) => {
        stitch
          .startProgress(stitchUser)
          .then((progress) => {
            stitch
              .postLog(
                new LogItem(
                  new Date(),
                  new ObjectId(stitchUser.id),
                  "-",
                  LogItemType.CREATE_START,
                  navigator.userAgent,
                  progress._id
                )
              )
              .then(
                () =>
                  (window.location.href = `/password?action=create&type=${type}&progressId=${progress._id}`)
              )
              .catch(failHandler);
          })
          .catch(failHandler);
      })
      .catch(failHandler);
  }

  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button
          onClick={() => this.startPasswordScheme("email")}
          className="border-accent"
        >
          Create for Email
        </button>
        {/* <button className="border-accent">
          <Link to="/password?action=create&type=banking">
            Create for Banking
          </Link>
        </button>
        <button className="border-accent">
          <Link to="/password?action=create&type=shopping">
            Create for Shopping
          </Link>
        </button> */}
      </div>
    );
  }
}

class Password extends React.Component {
  blankColour = { name: "", id: 9 };
  availableColours = [
    { name: "#263238", id: 0 }, // black
    { name: "#2196f3", id: 1 }, // blue
    { name: "#795548", id: 2 }, // brown
    { name: "#4caf50", id: 3 }, // green
    { name: "#f48fb1", id: 4 }, // pink
    { name: "#9c27b0", id: 5 }, // purple
    { name: "#d32f2f", id: 6 }, // red
    { name: "#ffeb3b", id: 7 }, // yellow
  ];

  constructor(props) {
    super(props);

    const query = queryString.parse(props.location.search);

    this.state = {
      userName: "",
      progressId: query.progressId,
      action: query.action,
      type: query.type,
      progress: null,
      circles: [],
      password: [],
      editingCircle: null,
      confirmedPassword: null,
      numTries: 0,
    };

    this.initCircles = this.initCircles.bind(this);
    this.renderCircle = this.renderCircle.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.imReady = this.imReady.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.submitPassword = this.submitPassword.bind(this);

    stitch
      .getProgress(this.state.progressId)
      .then((progress) => {
        if (!progress) return alert("progress not found!");
        this.setState({ progress: progress }, () => {
          if (this.state.action !== "create") {
            stitch
              .postLog(
                new LogItem(
                  new Date(),
                  this.state.progress.userId,
                  this.state.type,
                  this.state.action === "confirm"
                    ? LogItemType.CONFIRM_SHOW
                    : LogItemType.TEST_SHOW,
                  "-",
                  this.state.progress._id
                )
              )
              .catch((err) => {
                console.error(err);
                alert("Something went wrong when updating logs");
              });
          }
          this.initCircles();
        });
      })
      .catch((err) => {
        console.error(err);
        alert("something went wrong");
      });
  }

  buildCircles(blank) {
    const circles = [];
    for (let i = 0; i < 7; ++i) {
      circles.push({
        pos: i + 1,
        colour: blank
          ? this.blankColour
          : this.availableColours[
              Math.floor(Math.random() * this.availableColours.length)
            ],
      });
    }
    return circles;
  }

  /**
   * @returns {string}
   */
  serializeCircles(circles) {
    return circles.reduce((acc, cur) => (acc += cur.colour.id), "");
  }

  deserializeCircles(text) {
    const circles = [];
    for (let i = 0; i < 7; ++i) {
      const colourId = parseInt(text.charAt(i));
      circles.push({
        pos: i + 1,
        colour:
          this.availableColours.find((c) => c.id === colourId) ||
          this.blankColour,
      });
    }
    return circles;
  }

  initCircles() {
    const failHandler = (err) => {
      console.error(err);
      alert("Something went wrong");
    };

    const progress = this.state.progress;
    const passwordName = this.state.type + "Password";
    const password = progress[passwordName];

    if (password) {
      this.setState({
        circles: this.deserializeCircles(password),
        password: this.buildCircles(true),
      });
    } else {
      progress[passwordName] = this.serializeCircles(this.buildCircles());
      stitch
        .updateProgress(progress)
        .then(() => {
          stitch
            .postLog(
              new LogItem(
                new Date(),
                progress.userId,
                this.state.type,
                LogItemType.CREATE_PASSWORD,
                progress[passwordName],
                progress._id
              )
            )
            .then(() =>
              this.setState({
                progress: progress,
                circles: this.deserializeCircles(progress[passwordName]),
                password: this.buildCircles(true),
              })
            )
            .catch(failHandler);
        })
        .catch(failHandler);
    }
  }

  refreshPage() {
    const progress = this.state.progress;
    const circles = this.buildCircles();
    const newPassword = this.serializeCircles(circles);
    progress[this.state.type + "Password"] = newPassword;

    const failHandler = (err) => {
      console.error(err);
      alert("something went wrong");
    };

    stitch
      .updateProgress(progress)
      .then(() =>
        stitch
          .postLog(
            new LogItem(
              new Date(),
              progress.userId,
              this.state.type,
              LogItemType.CREATE_RESET,
              newPassword,
              progress._id
            )
          )
          .then(() =>
            this.setState({
              circles,
              editingCircle: null,
            })
          )
          .catch(failHandler)
      )
      .catch(failHandler);
  }

  imReady() {
    stitch
      .postLog(
        new LogItem(
          new Date(),
          this.state.progress.userId,
          this.state.type,
          LogItemType.CREATE_READY,
          "-",
          this.state.progress._id
        )
      )
      .then(
        () =>
          (window.location.href = `/password?action=confirm&type=${this.state.type}&progressId=${this.state.progressId}`)
      )
      .catch((err) => {
        console.error(err);
        alert("Something went wrong");
      });
  }

  editCircle(circle) {
    circle.refreshing = true;
    this.setState({ editingCircle: circle }, () =>
      setTimeout(() => {
        circle.refreshing = false;
        this.setState({ editingCircle: circle });
      }, 75)
    );
  }

  confirmPassword() {
    const enteredPassword = this.serializeCircles(this.state.password);
    const actualPassword = this.serializeCircles(this.state.circles);

    const failHandler = (err) => {
      console.error(err);
      alert("something went wrong");
    };

    if (enteredPassword !== actualPassword) {
      stitch
        .postLog(
          new LogItem(
            new Date(),
            this.state.progress.userId,
            this.state.type,
            LogItemType.CONFIRM_INCORRECT,
            enteredPassword,
            this.state.progress._id
          )
        )
        .then(() => alert("Sorry, the password you entered is incorrect"))
        .catch(failHandler);
    }

    stitch
      .postLog(
        new LogItem(
          new Date(),
          this.state.progress.userId,
          this.state.type,
          LogItemType.CONFIRM_CORRECT,
          enteredPassword,
          this.state.progress._id
        )
      )
      .then(() => {
        alert("You correctly entered the password!");

        let type;
        if (this.state.type === "email") {
          type = "banking";
        } else if (this.state.type === "banking") {
          type = "shopping";
        } else {
          type = ["email", "banking", "shopping"][
            Math.floor(Math.random() * 3)
          ];
          return stitch
            .postLog(
              new LogItem(
                new Date(),
                this.state.progress.userId,
                "-",
                LogItemType.CONFIRM_COMPLETE,
                "-",
                this.state.progress._id
              )
            )
            .then(
              () =>
                (window.location.href = `/password?action=test&type=${type}&progressId=${this.state.progressId}`)
            )
            .catch(failHandler);
        }
        window.location.href = `/password?action=create&type=${type}&progressId=${this.state.progressId}`;
      })
      .catch(failHandler);
  }

  submitPassword() {
    const that = this;
    const enteredPassword = this.serializeCircles(this.state.password);
    const actualPassword = this.serializeCircles(this.state.circles);

    const failHandler = (err) => {
      console.error(err);
      alert("something went wrong");
    };

    if (enteredPassword !== actualPassword) {
      if (this.state.numTries < 2) {
        return stitch
          .postLog(
            new LogItem(
              new Date(),
              this.state.progress.userId,
              this.state.type,
              LogItemType.TEST_FAIL,
              enteredPassword,
              this.state.progress._id
            )
          )
          .then(() => {
            alert(
              `Sorry, the password you entered is incorrect\nYou have ${
                2 - this.state.numTries
              } tries left`
            );
            this.setState({ numTries: this.state.numTries + 1 });
          })
          .catch(failHandler);
      } else {
        return stitch
          .postLog(
            new LogItem(
              new Date(),
              this.state.progress.userId,
              this.state.type,
              LogItemType.TEST_FAIL,
              enteredPassword,
              this.state.progress._id
            )
          )
          .then(() =>
            alert(
              "sorry, the password you entered is incorrect\nYou've used up all your tries, taking you to the next password now."
            )
          )
          .then(continueToNext)
          .catch(failHandler);
      }
    } else {
      stitch
        .postLog(
          new LogItem(
            new Date(),
            this.state.progress.userId,
            this.state.type,
            LogItemType.TEST_PASS,
            enteredPassword,
            this.state.progress._id
          )
        )
        .then(() => alert("You correctly entered the password!"))
        .then(continueToNext)
        .catch(failHandler);
    }

    function continueToNext() {
      const buildParamName = (type) =>
        "tested" + type.charAt(0).toUpperCase() + type.substr(1);

      const progress = that.state.progress;
      progress[buildParamName(that.state.type)] = true;

      stitch
        .updateProgress(progress)
        .then(() => {
          const types = ["shopping", "email", "banking"].filter(
            (t) => !that.state.progress[buildParamName(t)]
          );

          if (types.length > 0) {
            window.location.href = `/password?action=test&type=${
              types[Math.floor(Math.random() * types.length)]
            }&progressId=${that.state.progressId}`;
          } else {
            stitch
              .postLog(
                new LogItem(
                  new Date(),
                  that.state.progress.userId,
                  "-",
                  LogItemType.FINISH,
                  "-",
                  that.state.progress._id
                )
              )
              .then(() => {
                alert("Congrats, you've completed the process!");
                window.location.href = "/";
              })
              .catch(failHandler);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("something went wrong");
        });
    }
  }

  /**
   * @param {{id: number, name: string, pos: number}} circle
   */
  renderCircle(circle) {
    return (
      <div
        key={circle.pos}
        className="circle-box bg-secondary"
        // title="Click me to change my colour"
        onClick={() => this.editCircle(circle)}
      >
        {circle.pos}
        <div
          className="circle"
          style={{ backgroundColor: circle.colour.name }}
        ></div>
      </div>
    );
  }

  renderPallette() {
    if (!this.state.editingCircle) return;
    return (
      <div
        className={`pallette ${
          this.state.editingCircle.refreshing
            ? "bg-secondary"
            : "bg-secondary-strong"
        }`}
      >
        <p>
          <b>Pallette : </b>Editing circle {this.state.editingCircle.pos}
        </p>
        <div className="colours">
          {this.availableColours.map((colour) => (
            <div
              key={colour.id}
              className="colour"
              style={{
                backgroundColor: colour.name,
                border:
                  this.state.editingCircle.colour.id === colour.id
                    ? "solid 3px white"
                    : null,
              }}
              onClick={() => {
                const editing = this.state.editingCircle;
                editing.colour = colour;
                this.setState({ editingCircle: editing });
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  renderForCreate() {
    return (
      <div id="password" className="container main">
        <p>
          This is your password for <b>{this.state.type}</b>, take some time to
          remember it.
          <br />
          When you think you've got it, click on "I'm ready" to confirm the
          password.
          <br />
          If you'd like a new password, click on "Refresh".
        </p>
        <div className="circles">
          {this.state.circles.map(this.renderCircle)}
        </div>
        <div>
          <button onClick={this.imReady} className="submitButton color-accent">
            I'm ready
          </button>
          <button onClick={this.refreshPage} className="refreshButton">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  renderForConfirm() {
    return (
      <div id="password" className="container main confirm">
        <p className="confirmText">
          {" "}
          Re-enter your <b>{this.state.type}</b> password then press the
          "Confirm Password" button
        </p>
        <div className="circles">
          {this.state.password.map(this.renderCircle)}
        </div>
        {this.renderPallette()}
        <div className="submit">
          <button onClick={this.confirmPassword} className="confirmButton">
            Confirm Password
          </button>
          <a
            href={`/password?action=create&type=${this.state.type}&progressId=${this.state.progressId}`}
          >
            <button onClick={this.refreshPage} className="refreshButton">
              Back to Learn
            </button>
          </a>
        </div>
      </div>
    );
  }

  renderForTest() {
    return (
      <div id="password" className="container main confirm">
        <p className="confirmText">
          {" "}
          Now that you've confirmed you know all your passwords, please enter
          your <b>{this.state.type}</b> password and press submit.
        </p>
        <div className="circles">
          {this.state.password.map(this.renderCircle)}
        </div>
        {this.renderPallette()}
        <div className="submit">
          <button onClick={this.submitPassword} className="confirmButton">
            Submit
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.action === "create" ? this.renderForCreate() : null}
        {this.state.action === "confirm" ? this.renderForConfirm() : null}
        {this.state.action === "test" ? this.renderForTest() : null}
      </div>
    );
  }
}

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button
          onClick={() => this.startPasswordScheme("email")}
          className="border-accent"
        >
          Create for Email
        </button>
      </div>
    );
  }
}

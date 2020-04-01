import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./styles.css";
import "./app.css";

import * as queryString from "query-string";

// const BACKEND_ADDRESS = "http://localhost:3001";

export default class app extends Component {
  constructor(props) {
    super();
    this.state = {
      list: true,
      card: true,
      paragraphs: [],
      paragraph: {}
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
            <Route path="/test" component={Test} />
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
          <button className="bg-accent">
            <Link to="/test" className="color-inverse">
              Test passwords
            </Link>
          </button>
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

  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button className="border-accent">
          <Link to="/password?action=create&type=email">Create for Email</Link>
        </button>
        <button className="border-accent">
          <Link to="/password?action=create&type=banking">
            Create for Banking
          </Link>
        </button>
        <button className="border-accent">
          <Link to="/password?action=create&type=shopping">
            Create for Shopping
          </Link>
        </button>
      </div>
    );
  }
}

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="container main">test works!</div>;
  }
}

class Password extends React.Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(props.location.search);
    this.state = {
      action: query.action,
      type: query.type,
      circles: this.initCircles(),
      editingCircle: null
    };
    this.renderCircle = this.renderCircle.bind(this);
  }

  availableColours = [
    { name: "#263238", id: 0 }, // black
    { name: "#2196f3", id: 1 }, // blue
    { name: "#795548", id: 2 }, // brown
    { name: "#4caf50", id: 3 }, // green
    { name: "#f48fb1", id: 4 }, // pink
    { name: "#9c27b0", id: 5 }, // purple
    { name: "#d32f2f", id: 6 }, // red
    { name: "#ffeb3b", id: 7 } // yellow
  ];

  initCircles() {
    const circles = [];
    for (let i = 0; i < 7; ++i) {
      circles[i] = {
        pos: i + 1,
        colour: this.availableColours[
          Math.floor(Math.random() * this.availableColours.length)
        ]
      };
    }
    return circles;
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

  /**
   * @param {{id: number, name: string, pos: number}} circle
   */
  renderCircle(circle) {
    return (
      <div
        key={circle.pos}
        className="circle-box bg-secondary"
        title="Click me to change my colour"
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
          {this.availableColours.map(colour => (
            <div
              key={colour.id}
              className="colour"
              style={{
                backgroundColor: colour.name,
                border:
                  this.state.editingCircle.colour.id == colour.id
                    ? "solid 3px white"
                    : null
              }}
              onClick={() => {
                this.state.editingCircle.colour = colour;
                this.setState({ editingCircle: this.state.editingCircle });
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    console.log(this.state.circles);
    return (
      <div id="password" className="container main">
        <div className="circles">
          {this.state.circles.map(this.renderCircle)}
        </div>
        {this.renderPallette()}
      </div>
    );
  }
}

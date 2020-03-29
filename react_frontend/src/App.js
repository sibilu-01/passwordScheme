import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./styles.css";
import "./app.css";

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
          <Switch>
            <Route path="/learn" component={Learn} />
            <Route path="/test" component={Test} />
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
        <h1>
          <span style={{ color: "red" }}>C</span>
          <span style={{ color: "green" }}>o</span>
          <span style={{ color: "blue" }}>l</span>
          <span style={{ color: "black" }}>o</span>
          <span style={{ color: "pink" }}>u</span>
          <span style={{ color: "brown" }}>r </span>
          Password
        </h1>
        <h2>What would you like to do?</h2>
        <div className="buttons">
          <button className="bg-accent">
            <Link to="/learn" className="color-inverse">
              Learn some passwords
            </Link>
          </button>
          <button className="bg-accent">
            <Link to="/test" className="color-inverse">
              Test my knowledge
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
    return <div className="container main">learn works!</div>;
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

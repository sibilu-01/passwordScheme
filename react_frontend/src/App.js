import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./styles.css";
import "./app.css";

import * as queryString from "query-string";
var password = null;  // stores the password submitted
var confirmedPassword = null; //boolean that indicates whether user correctly confirmed password or not


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
            <Route path="/confirmPassword" component={PasswordConfirm} />
            <Route path="/confirmationPage" component={Confirmation} />
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
        <button disabled={true} className="border-accent">
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

class Password extends React.Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(props.location.search);
    this.state = {
      userName: '',
      action: query.action,
      type: query.type,
      circles: this.initCircles(),
      editingCircle: null,
      confirmedPassword: null
    };
    this.renderCircle = this.renderCircle.bind(this);
  }
  submitInfo = event => {
    password = {pwd: this.state.circles}
    console.log(password);
  }

  refreshPage() {
    window.location.reload(false);
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

  initCircles2() {
    const circles = [];
    for (let i = 0; i < 7; ++i) {
      circles[i] = {
        pos: i + 1,
        colour: "white"
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
                  this.state.editingCircle.colour.id === colour.id
                    ? "solid 3px white"
                    : null
              }}
              onClick={() => {
                //this.setState({editingCircle.colour : });
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
    //console.log(this.state.circles);
    return (
      <div id="password" className="container main">
        <div className="circles">
          {this.state.circles.map(this.renderCircle)}
        </div>
        <div>
          <button onClick = {this.submitInfo} className = "submitButton">
            <Link to="/confirmPassword">
              Submit
            </Link>
          </button>
          <button onClick = {this.refreshPage} className = "refreshButton">
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

class PasswordConfirm extends React.Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(props.location.search);
    this.state = {
      userName: '',
      action: query.action,
      type: query.type,
      circles: this.initCircles2(),
      editingCircle: null
      //password: this.props.password
    };
    this.renderCircle = this.renderCircle.bind(this);
  }

  submitInfo = event => {
    confirmedPassword = {pwd: this.state.circles}
    console.log(confirmedPassword);
  }

  submitInfo = event => {
    for(var i = 0; i < this.state.circles.length; i++) {
      if(password == null) {
        return false;
      }
      else if (password.pwd[i].colour.id !== this.state.circles[i].colour.id) {
        return false;
      }
    }
    return true;
  }

confirmationResult = () => {
  confirmedPassword = this.submitInfo();
  console.log(confirmedPassword);
}
  
  availableColours = [
    { name: "#263238", id: 0 }, // black
    { name: "#2196f3", id: 1 }, // blue
    { name: "#795548", id: 2 }, // brown
    { name: "#4caf50", id: 3 }, // green
    { name: "#f48fb1", id: 4 }, // pink
    { name: "#9c27b0", id: 5 }, // purple
    { name: "#d32f2f", id: 6 }, // red
    { name: "#ffeb3b", id: 7 }  // yellow
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

  initCircles2() {
    const circles = [];
    for (let i = 0; i < 7; ++i) {
      circles[i] = {
        pos: i + 1,
        colour: this.availableColours[0]
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
                  this.state.editingCircle.colour.id === colour.id
                    ? "solid 3px white"
                    : null
              }}
              onClick={() => {
                //this.setState({editingCircle.colour : });
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
    return (
      <div id="password" className="container main">
        <p className = "confirmText"> Re-enter your password then press the "Confirm Password" button</p>
        <div className="circles">
          {this.state.circles.map(this.renderCircle)}
        </div>
        {this.renderPallette()}

        <div className = "submit">
          <button onClick = {this.confirmationResult} className = "confirmButton">
              <Link to="/confirmationPage"> Confirm Password </Link>
          </button>
        </div>
      </div>
    );
  }
}


class Confirmation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmation: false
    }
    
  }

  render() {
    if(confirmedPassword){
      return (
        <div className = "container main">
          <h1>password confirmed</h1>
          <button>
            <Link to = "/learn">
              Create your next password
            </Link>
          </button>
        </div>
      )
    }
    else{
      return (
        <div className = "container main">
          <h1>The password you entered does not match</h1>
          <button className = "submitButton">
            <Link to = "/confirmPassword">
              Re-enter your password
            </Link>
          </button>
          <button className = "refreshButton">
            <Link to = "/password">
                Forgot password? create password again  
            </Link>
          </button>

        </div>
      )
    }
  }
}

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button className="border-accent">
          <Link to="/password?action=test&type=email">Test for Email</Link>
        </button>
        <button className="border-accent">
          <Link to="/password?action=test&type=banking">
            Test for Banking
          </Link>
        </button>
        <button className="border-accent">
          <Link to="/password?action=test&type=shopping">
            Test for Shopping
          </Link>
        </button>
      </div>
    );
  }
}
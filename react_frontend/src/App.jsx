import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./styles.css";
import "./app.css";

import * as queryString from "query-string";
var password = {
  email : null,
  banking : null,
  shopping : null
};  // stores the password submitted

var passwordFor = {
  email : null,
  banking: null,
  shopping: null
}

var confirmedPassword = null; //boolean that indicates whether user correctly confirmed password or not
var testResult = null; //boolean that indicates whether testing passed or failed

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
            <Route path="/confirmpassword" component={PasswordConfirm} />
            <Route path="/confirmationpage" component={Confirmation} />
            <Route path="/testResultPage" component= {TestResult} />
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
    this.state = {
      buttonPressed : null
    };

  }

  // changeState = (pressedIs) => {
  //   this.setState({buttonPressed : pressedIs})
  //   password = this.state.buttonPressed
  //   console.log(password)
  // }

  buttonPressed = (buttonIs) => {
    return function () {
      if (buttonIs === "Email"){
        passwordFor.email = buttonIs
        passwordFor.banking = null
        passwordFor.shopping = null
      } else if (buttonIs ==="Banking"){
        passwordFor.email = null
        passwordFor.banking = buttonIs
        passwordFor.shopping = null
      } else if (buttonIs ==="Shopping"){
        passwordFor.email = null
        passwordFor.banking = null
        passwordFor.shopping = buttonIs
      }
      console.log(passwordFor)
    }
  }
  //buttonPressed.bind(this)
  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button onClick = {this.buttonPressed("Email")} className="border-accent">
          <Link to="/password?action=create&type=email">Create for Email</Link>
        </button>
        <button onClick = {this.buttonPressed("Banking")} className="border-accent">
          <Link to="/password?action=create&type=email">
            Create for Banking
          </Link>
        </button>
        <button onClick = {this.buttonPressed("Shopping")} className="border-accent">
          <Link to="/password?action=create&type=email">
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
      resultFromTest: false,
      passwordRetry: 0
    };
    //this.handlechange = this.handlechange.bind(this);
    this.renderCircle = this.renderCircle.bind(this);
  }
  testPassword = event => {
    //this.increment()
    for(var i = 0; i < this.state.circles.length; i++) {
      console.log(this.state.action)
      if(passwordFor.email != null){
        if(password.email == null) {
          return false;
        }
        else if (password.email.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      } else if (passwordFor.banking != null ) 
      {
        if(password.banking == null) {
          return false;
        }
        else if (password.banking.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      } else if (passwordFor.shopping != null ) 
      {
        if(password.shopping == null) {
          return false;
        }
        else if (password.shopping.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      }
    }
    return true;
  }

  changeResult = () => {
    testResult = this.testPassword();
    this.setState(
      {resultFromTest: testResult}
    )
  }

  testResult = () => {
    this.changeResult();
    if (!testResult) {
      alert('The passwords you entered is incorrect');
    }
    else {
      alert('Yay! the password you entered is correct');
    }  
    //  console.log(this.state.type);
    //  console.log(testResult);
    //  console.log(this.state.passwordRetry);
     console.log(passwordFor);
  }

  increment = () => {
    this.setState(
      {passwordRetry: this.state.passwordRetry + 1}
    )
  }


  submitInfo = event => {
    //console.log(this.state.action)
    if (passwordFor.email != null) 
      password.email = {pwd: this.state.circles}
    else if (passwordFor.banking != null)
      password.banking = {pwd: this.state.circles}
    else if (passwordFor.shopping != null)
      password.shopping = {pwd: this.state.circles}
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
    if (this.state.action === "create") {
      return (
        <div id="password" className="container main">
          <div className="circles">
            {this.state.circles.map(this.renderCircle)}
          </div>
          <div>
            <button onClick = {this.submitInfo} className = "submitButton">
              <Link to="/confirmpassword">
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
    else if (this.state.action = "test") {
      if (this.state.resultFromTest === true) {
        return (
          <div id="password" className="container main">
            <p className = "confirmText"> Enter your {this.state.type} password then press the "submit" button</p>
            <p className = "triesLeft">{3 - this.state.passwordRetry} try left </p>
            <div className="circles">
              {this.state.circles.map(this.renderCircle)}
            </div>
            {this.renderPallette()}
            <div className = "submit">
              <button onClick = {() => {this.increment();this.testResult();}} className = "confirmButton">
                <Link to = "/testResultPage">submit</Link>  
              </button>
            </div>
          </div>
        );
      } else{
          if(this.state.passwordRetry < 2){
            return (
              <div id="password" className="container main">
                <p className = "confirmText"> Enter your {this.state.type} password then press the "submit" button</p>
                <p className = "triesLeft">{3 - this.state.passwordRetry} tries left </p>
                <div className="circles">
                  {this.state.circles.map(this.renderCircle)}
                </div>
                {this.renderPallette()}
                <div className = "submit">
                  <button onClick = {() => {this.increment();this.testResult();}} className = "confirmButton">
                    submit  
                  </button>
                </div>
              </div>
            );
          } else {
          return (
            <div id="password" className="container main">
              <p className = "confirmText"> Enter your {this.state.type} password then press the "submit" button</p>
              <p className = "triesLeft">{3 - this.state.passwordRetry} try left </p>
              <div className="circles">
                {this.state.circles.map(this.renderCircle)}
              </div>
              {this.renderPallette()}
              <div className = "submit">
                <button onClick = {() => {this.increment();this.testResult();}} className = "confirmButton">
                  <Link to = "/testResultPage">submit</Link>  
                </button>
              </div>
            </div>
          );
        }
      }
      }

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
    for(var i = 0; i < this.state.circles.length; i++) {
      console.log(this.state.action)
      if(passwordFor.email != null ){
        if(password.email == null) {
          return false;
        }
        else if (password.email.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      } else if (passwordFor.banking != null) 
      {
        if(password.banking == null) {
          return false;
        }
        else if (password.banking.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      } else if (passwordFor.shopping != null) 
      {
        if(password.shopping == null) {
          return false;
        }
        else if (password.shopping.pwd[i].colour.id !== this.state.circles[i].colour.id) {
          return false;
        }
      } else if (passwordFor.banking === null && passwordFor.shopping === null && passwordFor.email === null) {
        return false
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
              <Link to="/confirmationpage"> Confirm Password </Link>
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
    }
    
  }

  render() {
    if(confirmedPassword){
      if (password.email != null && password.shopping != null && password.banking != null) {
        return (
          <div className = "container main">
            <h1 className = "confirmText">password confirmed </h1>
            <h2 className = "confirmText">All three passwords created </h2>
            <button>
              <Link to = "/test">
                Go to testing
              </Link>
            </button>
          </div>
        )
      }
      else {
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
    }
    else{
      return (
        <div className = "container main">
          <h1>The password you entered does not match</h1>
          <button className = "submitButton">
            <Link to = "/confirmpassword">
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

class TestResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    
  }

  render() {
    if(testResult){
        return (
          <div className = "container main">
            <h1 className = "confirmText">Test passed </h1>
            <button>
              <Link to = "/test">
                Test the next password
              </Link>
            </button>
          </div>
        )
    }
    else{
      return (
        <div className = "container main">
          <h1>The password you entered is wrong</h1>
          <button className = "submitButton">
            <Link to = "/test">
              test other passwords
            </Link>
          </button>
          <button className = "refreshButton">
            <Link to = "/learn">
                create password again  
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

  buttonPressed = (buttonIs) => {
    return function () {
      if (buttonIs === "Email"){
        passwordFor.email = buttonIs
        passwordFor.banking = null
        passwordFor.shopping = null
      } else if (buttonIs ==="Banking"){
        passwordFor.email = null
        passwordFor.banking = buttonIs
        passwordFor.shopping = null
      } else if (buttonIs ==="Shopping"){
        passwordFor.email = null
        passwordFor.banking = null
        passwordFor.shopping = buttonIs
      }
      console.log(passwordFor)
    }
  }

  render() {
    return (
      <div id="learn" className="container main">
        <p>Pick a type of password</p>
        <button onClick = {this.buttonPressed("Email")} className="border-accent">
          <Link to="/password?action=test&type=email">Test for Email</Link>
        </button>
        <button onClick = {this.buttonPressed("Banking")} className="border-accent">
          <Link to="/password?action=test&type=banking">
            Test for Banking
          </Link>
        </button>
        <button onClick = {this.buttonPressed("Shopping")} className="border-accent">
          <Link to="/password?action=test&type=shopping">
            Test for Shopping
          </Link>
        </button>
      </div>
    );
  }
}
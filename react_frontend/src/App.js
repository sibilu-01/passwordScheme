import React, { Component } from "react";
import "./app.css";

const BACKEND_ADDRESS = "http://localhost:3001";

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
    fetch(`${BACKEND_ADDRESS}/paragraphs/list`)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.data);
        this.setState({ paragraphs: responseJson });
      });
  }

  showCard = id => {
    fetch(`${BACKEND_ADDRESS}paragraphs/${id}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ paragraph: responseJson });
      });
    this.setState({
      list: false,
      card: true
    });
  };
  showCardInfo = id => {
    fetch(`${BACKEND_ADDRESS}/paragraphs/${id}`)
      .then(response => response.json())
      .then(responseJson => {
          console.log(responseJson.data);
        this.setState({ paragraph: responseJson.data });
      });
    this.setState({
      list: false,
      card: true
    });
  };
  showList = () => {
    this.setState({
      card: false,
      list: true
    });
  };

  render() {
    return (
      <div className="container">
        {this.state.list ? (
          <div className="list-group">
            {this.state.paragraphs.map(paragraph => (
              <li
                onClick={() => this.showCard(paragraph._id)}
                className="list-group-item list-group-item-action"
              >
                {paragraph.runs}
              </li>
            ))}
          </div>
        ) : null}

        {this.state.card ? (
          <div class="card" style={{ width: "45rem", height: "10rem" }}>
            <div class="card-body">
              <p class="card-text">{this.state.paragraph.paragraph}</p>
              <div onClick={() => this.showList()} class="btn btn-primary">
                Back
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

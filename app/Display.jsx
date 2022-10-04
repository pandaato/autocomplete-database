const React = require("react");

class Display extends React.Component {
  constructor() {
    super();
    this.handleLoad = this.handleLoad.bind(this);
  }

  // Provides callback for after component loads
  componentDidMount() {
    window.addEventListener("load", this.handleLoad);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.handleLoad);
  }

  handleLoad() {
    // Get data from server
    let url = "/display" + window.location.search;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // Next, add an event listener for when the HTTP response is loaded
    xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        let responseStr = xhr.responseText; // get the JSON string
        let data = JSON.parse(responseStr); // turn it into an object

        console.log("Successfully received student json data");
        console.log(data);

        document.getElementById("studentImg").src = data["image"];
        document.getElementById("name").textContent = data["first"] + " " + data["last"];
        document.getElementById("myMajor").textContent = data["major"];
        document.getElementById("myMinor").textContent = data["minor"];
        document.getElementById("college").textContent = data["college"];
        document.getElementById("gender").textContent = data["gender"];
        document.getElementById("messageText").textContent = data["content"];
      } else {
        console.log("Error fetching data");
        console.log(xhr.responseText);
      }
    });
    // Actually send request to server
    xhr.send();
  }

  render() {
    return (
      <div>
        <h1>ECS 162 Database</h1>

        <div id="stuData">
          <img id="studentImg"></img>
          <div id="name"></div>
          <div id="myMajor"></div>
          <div id="myMinor"></div>
          <div id="college"></div>
          <div id="gender"></div>
          <div id="messageText"></div>
        </div>
      </div>
    );
  }
}

module.exports = Display;

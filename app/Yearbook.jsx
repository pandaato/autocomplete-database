const React = require("react");
const Search = require("./Search");

class Yearbook extends React.Component {
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
    let url = "/yearbook" + window.location.search;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // Next, add an event listener for when the HTTP response is loaded
    xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        let responseStr = xhr.responseText; // get the JSON string
        let data = JSON.parse(responseStr); // turn it into an object

        console.log("Successfully received student json data");
        console.log(data);
        createCards(data);
      } else {
        console.log("Error fetching data");
        console.log(xhr.responseText);
      }
    });
    // Actually send request to server
    xhr.send();
    
    // Create cards based returned list of students
    function createCards(info) {
      let gallery = document.getElementById("gallery");
      for (var i = 0; i < info["length"]; i++) {
        let card = document.createElement("a");
        card.classList.add("card");
        card.href = "https://summer-three-desert.glitch.me/display.html?id=" + info[i]["id"];
        gallery.appendChild(card);
        
        let img = document.createElement("img");
        img.src = info[i]["image"];
        card.appendChild(img);
        
        let name = document.createElement("div");
        name.textContent = info[i]["first"] + " " + info[i]["last"];
        card.appendChild(name);
      }
    }
  }
  
  render() {
    return (
      <div>
        <h1>ECS 162 Database</h1>

        <div id="gallery"></div>
      </div>
    );
  };
};

module.exports = Yearbook;

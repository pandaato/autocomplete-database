const React = require("react");

class Search extends React.Component {
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
    let searchButton = document.getElementById("searchButton");
    
    searchButton.addEventListener("click", function(e) {
      let data = {
        "first": document.getElementById("firstName").value,
        "last": document.getElementById("lastName").value,
        "major": document.getElementById("myMajor").value,
        "minor": document.getElementById("myMinor").value,
        "college": document.getElementById("college").value,
        "gender": document.getElementById("gender").value,
      };
      
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/searchQuery");
      xhr.setRequestHeader("Content-Type", "application/json");
      console.log("Sending query to server:", data);

      xhr.onload = function() {
        let newUrl = "https://summer-three-desert.glitch.me/yearbook.html?query=" + xhr.responseText;
        window.location.href = newUrl;
      };

      xhr.send(JSON.stringify(data));
    });
  };
  
  render() {
    return (
      <div id="searchButton" className="button">Search</div>
    );
  };
};

module.exports = Search;

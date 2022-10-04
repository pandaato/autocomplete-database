const React = require("react");
const ReactDOM = require("react-dom");

/* Import Components */
const HelloWorld = require("./HelloWorld");
const Display = require("./Display");
const Yearbook = require("./Yearbook");

if (window.location.href == "https://summer-three-desert.glitch.me/") {
  ReactDOM.render(<HelloWorld />, document.getElementById("main"));
  // Test to see if given string is within URL
} else if (window.location.href.indexOf("https://summer-three-desert.glitch.me/display") > -1) {
  ReactDOM.render(<Display />, document.getElementById("display"));
} else if (window.location.href.indexOf("https://summer-three-desert.glitch.me/yearbook") > -1) {
  ReactDOM.render(<Yearbook />, document.getElementById("yearbook"));
}

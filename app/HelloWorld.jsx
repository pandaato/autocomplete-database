const React = require("react");
const MajorSearch = require("./MajorSearch");
const ImgUpload = require("./ImgUpload");
const StudentData = require("./StudentData");
const UploadToServer = require("./UploadToServer");
const Search = require("./Search");

const HelloWorld = function() {
  return (
    <div>
      <h1>ECS 162 Database</h1>

      <p>
        This is a starter app that showcases the capabilities of the
        autocomplete and database in the final project
      </p>

      <p>
        Look in <code>public/README.txt</code> for a comprehensive description
        of what each component does (There's actually nothing)
      </p>
       
      <p>
        As of this writing, the final project has been completed and turned in,
        so nothing else will be updated.<br /> Currently, each view.html does not
        have any css styling.
      </p>

      <h2>Major Search</h2>
      <MajorSearch></MajorSearch>
      
      <h2>Database</h2>
      <div id="database">
        <ImgUpload></ImgUpload>
        <StudentData></StudentData>
      </div>
      
      <UploadToServer></UploadToServer>
      <Search></Search>
    </div>
  );
};

module.exports = HelloWorld;

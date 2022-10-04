const React = require("react");

const StudentData = function() {
  return (
    <div id="stuData">
      <div id="stuName" className="info">
        <div>
          <h3>First Name</h3>
          <input id="firstName" type="text" placeholder="Enter first name"></input>
        </div>

        <div>
          <h3>Last Name</h3>
          <input id="lastName" type="text" placeholder="Enter last name"></input>
        </div>
      </div>
      
      <div id="dropdown" className="info">
        <div>
          <h3>College</h3>
          <form>
            <select name="college" id="college">
              <option value="">Select one</option>
              <option value="Agricultural and Environmental Sciences">Agricultural and Environmental Sciences</option>
              <option value="Biological Sciences">Biological Sciences</option>
              <option value="Engineering">Engineering</option>
              <option value="Letters and Science">Letters and Science</option>
            </select>
          </form>
        </div>
        
        <div>
          <h3>Gender</h3>
          <form>
            <select name="gender" id="gender">
              <option value="">Select one</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </form>
        </div>
      </div>

      <div className="info">
        <div>
          <h3>Tell us something! (Optional)</h3>
          <textarea id="messageText" maxLength="500" placeholder="Write something about yourself!(500 characters max)"></textarea>
        </div>
      </div>
    </div>
  );
}

module.exports = StudentData;

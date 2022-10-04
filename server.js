// server.js

// init project
var express = require("express");
var app = express();
// Manage json files
var bodyParser = require("body-parser");
// Manage database
var sql = require("sqlite3").verbose();
// Upload images to /images and server
var FormData = require("form-data");
var fs = require("fs");
var multer = require('multer');

// Make a "storage" object that explains to multer where to store the images...in /images
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  // Keep the file's original name
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// Use that storage object we just made to make a multer object that knows how to 
// parse FormData objects and store the files they contain
let uploadMulter = multer({storage: storage});

// ========== BUILDING DATABASE ==========
// Create interface to file if exists; else create new file
const stuDB = new sql.Database("students.db");

// Gets "students.db"
// If "students.db" does not exist or is empty, creates new database
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='StudentTable' ";
stuDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("Creating new database");
        createStudentDB();
    } else {
        console.log("Database file found");
    }
});

// Test: dump out contents of database
stuDB.all("SELECT * FROM StudentTable ", function (err, arrayData) {
  if (err) { 
    console.log("error: " ,err.message); 
  } else { 
    console.log("array: ",arrayData);
  }
});

function createStudentDB() {
  const cmd =
    "CREATE TABLE StudentTable ( id TEXT PRIMARY KEY UNIQUE, image TEXT, first TEXT, last TEXT, major TEXT, minor TEXT, college TEXT, gender TEXT, content TEXT)";
  stuDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// ========== HANDLING REQUESTS ==========
app.use(express.static("public"));
app.use(bodyParser.json()); 

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// ========== Post Requests ==========
// Inserts new student data in database
app.post("/newItem", function(request, response) {
  console.log("Server recieved",request.body);
  let id = request.body.id;
  let image = request.body.image;
  let first = request.body.first;
  let last = request.body.last;
  let major = request.body.major;
  let minor = request.body.minor;
  let college = request.body.college;
  let gender = request.body.gender;
  let content = request.body.content;
  
  // Put new item into database
  cmd = "INSERT INTO StudentTable( id, image, first, last, major, minor, college, gender, content) VALUES (?,?,?,?,?,?,?,?,?)";
  stuDB.run(cmd, id, image, first, last, major, minor, college, gender, content, function(err) {
    if (err) {
      console.log("DB insert error", err.message);
      //next();
    } else {
      response.send(id);
    }
  }); // Callback, shopDB.run
}); // Callback, app.post

// First, server any static file requests
app.use(express.static('public'));

// Next, serve any images out of the /images directory
app.use("/images",express.static('images'));

// Upload to local via multer
app.post('/upload', uploadMulter.single('newImage'), function (request, response) {
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  // The file object "request.file" is truthy if the file exists
  if(request.file) {
    // Upload image via Flikr API
    sendMediaStore("/images/" + request.file.originalname, request, response);
  }
  else throw 'error';
})  

// Upload to server via API
function sendMediaStore(image, request, response) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    response.status(400);
    response.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();
    
    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + image));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind of stream handling that the body-parser 
        // module handles for us in Express.  
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            response.status(400); // bad request
            response.send(" Media server says: " + body);
          } else {
            response.status(200);
            response.send(body);
          }
        });
      } else { // didn't get APIres at all
        response.status(500); // internal server error
        response.send("Media server seems to be down.");
      }
    });
  }
}

// Sends user to filtered yearbook based on search query
app.post("/searchQuery", function(request, response) {
  let url = request.originalUrl;
  console.log("Query received:", request.body);
  
  let first = request.body.first;
  let last = request.body.last;
  let major = request.body.major;
  let minor = request.body.minor;
  let college = request.body.college;
  let gender = request.body.gender;
  
  // Change all spaces into "+"
  let infoList = [first, last, major, minor, college, gender];
  
  for (var i = 0; i < infoList.length - 1; i++) {
    if (infoList[i].includes(" ")) {
      let change = infoList[i].split(" ");
      infoList[i] = "";
      for (var j = 0; j < change.length - 1; j++) {
        infoList[i] = infoList[i].concat(change[j], "+"); 
      }
      infoList[i] = infoList[i].concat(change[change.length - 1]);
    }
  }

  first = infoList[0];
  last = infoList[1];
  major = infoList[2];
  minor = infoList[3];
  college = infoList[4];
  gender = infoList[5];
  
  // Concat all query options into one string
  let query = "";
  if (first)
    query = query.concat("first=", first, "zrgsaru");
  if (last)
    query = query.concat("last=", last, "zrgsaru");
  if (major)
    query = query.concat("major=", major, "zrgsaru")
  if(minor)
    query = query.concat("minor=", minor, "zrgsaru")
  if(college)
    query = query.concat("college=", college, "zrgsaru")
  if(gender)
    query = query.concat("gender=", gender, "zrgsaru")
  
  response.send(query)
}); 

// ========== Get Requests ==========
// Retrieves student data based on url id
app.get("/display?*", function(request, response) {
  // Url processing
  let url = request.originalUrl;
  console.log(url);
  if(url.charAt(url.length-1) == '=') url = url.substring(0, url.length-1);
  // Initial url is display?id=*, get the substring starting from the character after '?'
  let infoList = url.substring(url.indexOf("=")+1); 
  cmd = "SELECT * FROM StudentTable WHERE id=?";
  stuDB.get(cmd, infoList, function(err, val) {
    if (err) {
      console.log("DB search error", err.message);
    } else {
      response.json(val);
      console.log("Sending:", val);
    }
  }) 
}); 

app.get("/yearbook?*", function(request, response) {
  // Url processing
  let url = request.originalUrl;
  if(url.charAt(url.length-1) == '=') url = url.substring(0, url.length-1);
  // Initial url is display?query=*, get the substring starting from the character after '?'
  let infoList = url.substring(url.indexOf("=")+1); 
  
  // Empty search = full yearbook
  if (infoList == "/yearbook?query") {
    stuDB.all("SELECT id, first, last, image FROM StudentTable ORDER BY first, last", function (err, rows) {
      if (err) {
        console.log("DB search error", err.message);
      } else {
        response.json(rows);
        console.log("sending everything");
      }
    })
  } else {
    // Split infoList into individual filters
    infoList = infoList.split("zrgsaru");

    // Split infoList into id's and values
    let infoParts = [];
    for (var i = 0; i < infoList.length - 1; i++) {
      infoParts[i] = infoList[i].split("=");
    }

    // Change all "+" back into spaces
    for (var i = 0; i < infoParts.length; i++) {
      if (infoParts[i][1].includes("+")) {
        let value = infoParts[i][1].split("+");
        infoParts[i][1] = "";
        for (var j = 0; j < value.length - 1; j++) {
          infoParts[i][1] = infoParts[i][1].concat(value[j], " ");
        }
        infoParts[i][1] = infoParts[i][1].concat(value[value.length - 1]);
      }
    }

    cmd = "SELECT id, first, last, image FROM StudentTable WHERE ";

    var notFirst = false;
    for (var i = 0; i < infoList.length - 1; i++) {
      if (notFirst) {
        cmd = cmd.concat("AND ");
      }
      
      if (infoParts[i][0] == "first" || infoParts[i][0] == "last") {
        cmd = cmd.concat(infoParts[i][0], " LIKE '", infoParts[i][1], "%' ")
        notFirst = true;
      } else {
        cmd = cmd.concat(infoParts[i][0], "=? ");
      }
    }
    cmd = cmd.concat("ORDER BY first, last");

    let valueList = [];
    for (var i = 0; i < infoParts.length; i++) {
      if (infoParts[i][0] != "first" && infoParts[i][0] != "last") {
        valueList = valueList.concat(infoParts[i][1]);
      }
    }
    
    console.log(cmd);
    console.log(valueList);

    stuDB.all(cmd, valueList, function(err, rows) {
      if (err) {
        console.log("DB search error", err.message);
      } else {
        response.json(rows);
        console.log("Sending:", rows);
      }
    }) 
  }
}); 

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

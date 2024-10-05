const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');

app.use(express.json());

router.get('/home', (req,res) => {
  const filePath = path.join(__dirname, 'home.html');
  fs.writeFile(filePath, '<h1>Welcome to ExpressJs Tutorial</h1>', function(err) {
    if (err) {
      console.log(err);
      res.status(500).send('<h1>Sorry, we could not display the homepage.</h1>')
    } else {
      res.sendFile(filePath);
    }
  });
});

router.get('/profile', (req,res) => {
  const filePath = path.join(__dirname, 'user.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('<h1>Sorry, we could not display your profile.</h1>')
    }
    else {
      res.json(JSON.parse(data));
    }
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req,res) => {
  const filePath = path.join(__dirname, 'user.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({status: false, message: "Sorry, we could not verify your username and password."})
    }
    else {
      const userData = JSON.parse(data);
      if (req.body.username === userData.username && req.body.password === userData.password) {
        res.json({status: true, message: "User Is valid"});
      }
      else if (req.body.username !== userData.username) {
        res.json({status: false, message: "User Name is invalid"});
      }
      else if (req.body.password !== userData.password) {
        res.json({status: false, message: "Password is invalid"});
      }
    }
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.</b>
*/
router.get('/logout/:username', (req,res) => {
  res.send(`<b>${req.params.username} successfully logout.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  res.status(500).send('<h1>Server Error</h1>');
  console.log(err);
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));


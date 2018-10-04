// Require the express module
const express = require('express');
const bodyParser = require('body-parser');
// Create a new web server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Tell the web server to serve files
// from the www folder
const fs = require('fs');
const ingredients = require("./livsmedelsdata.json");
const recipePath = "./recipes.json";
const recipesJson = require(recipePath);
const users = require("./users.json")

// app.get('/login/:username', (req,res)=>{
//   let username = req.params.username;
//   debugger
//   let testuser = users.filter(
//     user=>user.username==username)
//     .map(user => user.password);
//     res.json(testuser);
// });

app.get(
    '/autocomplete-ingredient-name/:startOfName',
    (req, res) => {
      // req.params will include properties with the names
      // of params I have defined with :paramName in my route/url
      let start = req.params.startOfName.toLowerCase();
      // require at least two characters
      if(start.length < 1){
        res.json({error: 'Please provide at least two characters...'});
        return;
      }
      // filter ingredients so that only those with a Namn
      // matching start are left, then map from obj to obj.Namn
      let result = ingredients.filter(
        ingredient => ingredient.Namn.toLowerCase().indexOf(start) == 0
      ).map(
        ingredient => ingredient.Namn
      );
      res.json(result);
    }
  );
  app.get(
    '/ingredient-name/:name',
    (req, res) => {
      console.log('i backend');
      name1 = req.name;
      //console.log(name1);
      //console.log(req)
      // req.params will include properties with the names
      // of params I have defined with :paramName in my route/url
      let fullName = req.params.name.toLowerCase();
      
      console.log(fullName)
      // filter ingredients so that only those with a Namn
      // matching start are left, then map from obj to obj.Namn
      let result;
      result = ingredients.filter(
        ingredient => ingredient.Namn.toLowerCase()==fullName
      ).map(
        ingredient => ingredient
      );
      console.log(result +"jippi");
      res.json(result);
    }
  );


app.post('/add-recipe', (req, res) => {
  const recipe = req.body;
  console.log("rad 65",recipe);
  recipesJson.push(recipe);
  fs.writeFile(recipePath, JSON.stringify(recipesJson), function(err){
    if(err){console.log(err)}
  });
  res.json('sparat lina');
});

// app.post('/login', (req,res)=> {
//   console.log("backend")
//   const userLogging = req.body;
//   console.log(userLogging)
//   let logginginUser = users.filter(user => user.username==userLogging.username && user.password==userLogging.password)
//   .map(user => user.username)
//   if(logginginUser){
//     debugger
//     res.json(success)
//   }else{res.json(error)}
// });
// app.get('/login', (req,res)=> {
//   const userLogging = req.body;
//   console.log(userLogging)
// console.log(userLogging.username)
//   let logginginUser = users.filter(user => user.username==userLogging.username && user.password==userLogging.password)
//   .map(user => user.username);
//   debugger
//   res.json("hello");
// })

app.post('/login', (req,res)=>{
  const userName=req.body.username;
  const passWord=req.body.password;
  let logginginUser = users.filter(user => user.username==userName && user.password==passWord).map(user => user.username);
  console.log(req.body.username)
  console.log(logginginUser)
  if(logginginUser.length>0){
    res.json(true)
  }else{res.json(false)}
  // res.json("lina är bäst");
})

app.get('/recipes.json', (req,res) => {
 res.json(recipesJson);
});

app.use(express.static('www'));

// app.post('/recipe/add', function(req, res){
//     console.log(req.body)
// })

// Start the web server on port 3000
app.listen(3000,() => console.log('Listening on port 3000'));
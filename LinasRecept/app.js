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

app.get(
    '/autocomplete-ingredient-name/:startOfName',
    (req, res) => {
      let start = req.params.startOfName.toLowerCase();
      if(start.length < 1){
        res.json({error: 'Please provide at least two characters...'});
        return;
      }
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
      name1 = req.name;
      let fullName = req.params.name.toLowerCase();
      let result;
      result = ingredients.filter(
        ingredient => ingredient.Namn.toLowerCase()==fullName
      ).map(
        ingredient => ingredient
      );
      res.json(result);
    }
  );


app.post('/add-recipe', (req, res) => {
  const recipe = req.body;
  recipesJson.push(recipe);
  fs.writeFile(recipePath, JSON.stringify(recipesJson), function(err){
    if(err){console.log(err)}
  });
  res.json('sparat');
});

app.post('/login', (req,res)=>{
  const userName=req.body.username;
  const passWord=req.body.password;
  let logginginUser = users.filter(user => user.username==userName && user.password==passWord).map(user => user.username);
  console.log(req.body.username)
  console.log(logginginUser)
  if(logginginUser.length>0){
    res.json(true)
  }else{res.json(false)}
})

app.get('/recipes.json', (req,res) => {
 res.json(recipesJson);
});

app.use(express.static('www'));

// Start the web server on port 3000
app.listen(3000,() => console.log('Listening on port 3000'));
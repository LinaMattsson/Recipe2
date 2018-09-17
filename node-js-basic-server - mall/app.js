// Require the express module
const express = require('express');
// Create a new web server
const app = express();
// Tell the web server to serve files
// from the www folder
const ingredients = require("./livsmedelsdata.json");

app.get(
    '/autocomplete-ingredient-name/:startOfName',
    (req, res) => {
      // req.params will include properties with the names
      // of params I have defined with :paramName in my route/url
      let start = req.params.startOfName.toLowerCase();
      // require at least two characters
      if(start.length < 2){
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

app.use(express.static('www'));

app.post('/recipe/add', function(req, res){
    console.log(req.body)
})

// Start the web server on port 3000
app.listen(3000,() => console.log('Listening on port 3000'));
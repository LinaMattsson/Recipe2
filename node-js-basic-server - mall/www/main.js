$.getJSON('/recipe.json', function(recipes){
    console.log(recipes);

})

let recipes = [];

async function start() {
    recipes = await $.getJSON('/recipe.json').catch(console.err);
    console.log(recipes);
    // let recipes2 = await $.getJSON('/recipe2.json');

}


start();
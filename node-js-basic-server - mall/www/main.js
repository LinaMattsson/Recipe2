// $.getJSON('/autocomplete-ingredient-name/bac', function(recipes){
    // console.log(recipes);
// })

// let recipes = [];

async function start() {
    recipes = await $.getJSON('/recipe.json').catch(console.err);
    console.log(recipes);
    // let recipes2 = await $.getJSON('/recipe2.json');
}
$('#search-recipe').on('click', async function(){
    let searchinput = $('#input-search-recipe').val().toLowerCase();
    recipes = await $.getJSON('/recipe.json').catch(console.err);
    let match = false;
    let result;
    for(let r of recipes){
        if(searchinput == r.name.toLowerCase()){
            console.log(r.name)
            match = true;
            result = r;
        }    
    }

    if(!match){
     console.log("Inget recept med det namnet hittades")
    }
    if(result){
    $('.result').text(result.name);
    let ingredientlist;
    // for(let i of result.ingredienser){
    //     ingredientlist += in;
    // }
    
    $('.result').append(result.name);


    }
    
})


start();
// $.getJSON('/autocomplete-ingredient-name/bac', function(recipes){
    // console.log(recipes);
// })

// This funktion sorts out the ingredients that starts with the letters provided in the ingredients-search input
$('#ingredient').keyup(function(){
    let value = $(this).val();
    if(value.length>1){
        $.getJSON('/autocomplete-ingredient-name/'+$('#ingredient').val(), function(sIngredients){
            //Instead of a list maybe a drop down would be nice
            if(sIngredients){
            $('#choose-ingredient').empty();
            for(let ing of sIngredients){
            $('#choose-ingredient').append('<li><a href="#">'+ing+'</a></li>');
        }}})
}else
{ console.log('För kort att söka på')
$('#choose-ingredient').empty();
}});

//This function makes it possible to choose witch ingredient from the list provided in the ingredient search
$('#choose-ingredient').on('click','a', function(){
    let ing = this.text;
 console.log(ing);
 $('#choose-ingredient').empty();
 $('#choose-ingredient').append(ing);
 $('#choose-ingredient').append('</br>Mängd: <input> Enhet: <input> <input type="button" value = "skicka">');

})

//Är bara här just nu, ska inte finnas sen
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
    if(match){
        $('.result').text(result.name);
        $('.result').append('<br>');
    
        let ingredientlist;
        for(let i of result.ingredienser){
            $('.result').append(i.name + " ");
            $('.result').append(i.antal);
            $('.result').append(i.enhet);
            $('.result').append('<br>');
        }
    }
    else{
     $('.result').text("Inget recept med det namnet hittades");
    }
})

//addRecipe();
start();
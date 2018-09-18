// $.getJSON('/autocomplete-ingredient-name/bac', function(recipes){
    // console.log(recipes);
// })

// let recipes = [];
let keyUpCount = 0;
$('#ingredient').keyup(function(){
    keyUpCount ++;
    if(keyUpCount > 1){
        $.getJSON('/autocomplete-ingredient-name/'+$('#ingredient').val(), function(sIngredients){
            //Här ska det komma en drop down från ingrediens input
            // let i = 0;
            $('#choose-ingredient').empty();
            for(let ing of sIngredients){
            //    if(i == 0){ 
            
            $('#choose-ingredient').append('<li><a href="#">'+ing+'</a></li>');
            // $('#choose-ingredient').append('</br>');

        //     }else{            
        //         $('#choose-ingredient').append(ing +'</br>');
        // } i ++;
        }
 console.log(sIngredients);
    })}
    else{ console.log('För kort att söka på')}
});

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
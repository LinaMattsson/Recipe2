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
            $('.add-ingredient h1').text('Förslag på ingredienser');
            for(let ing of sIngredients){
            $('#choose-ingredient').append('<li><a href="#">'+ing+'</a></li>');
        }}})
}else
{ console.log('För kort att söka på')
$('#choose-ingredient').empty();
$('.add-ingredient h1').empty();
}});

//This function makes it possible to choose witch ingredient from the list provided in the ingredient search and fill in quantity but not add it
$('#choose-ingredient').on('click','a', function(){
    let ing = this.text;
 console.log(ing);
 $('.add-ingredient h1').text('Ange mängd');
 $('#choose-ingredient').empty();
 $('#choose-ingredient').append(ing);
 $('#choose-ingredient').append('</br>Mängd: <input> Enhet: <input> <input type="button" value = "skicka">');
})

//This two simular functions are posting the title and todo of the recipe to a preview
let deleteName = 0; 
$('#recipe-name-button').on('click', function(){
    let input = $('#recipe-name').val();
    console.log(input);
    $('#rubrik ul').append('<li>'+input + '</li>');
    if(deleteName == 0){
        console.log('här')
        $('#rubrik').append('  <input type="button" value="Töm"></input>');
    }
    $('#recipe-name').val("")
    deleteName ++;
})
let deleteToDo = 0;
$('#toDo-button').on('click', function(){
    let input = $('#toDo').val();
    $('#toDo-pre ul').append('<li>'+input+'</li>');
    if(deleteToDo == 0){
        $('#toDo-pre').append('  <input type="button" value="Töm"></input>');
    }
    $('#toDo').val("");
    deleteToDo ++;
})

//Method to delete title och todo in preview recipe
$('.pre-recipe').on('click','input',function(){
    console.log('try to empty')
let ulList = $(this).closest('div').attr('id');
$(this).closest('div').empty();
if(ulList == 'rubrik'){
    $('#rubrik').append('<ul>'+'</ul>');

    deleteName = 0;
}else if (ulList == 'toDo-pre'){
    $('#toDo-pre').append('<ul>'+'</ul>');
    deleteToDo = 0;
}
console.log('deleted'+ulList);
});

//This function is not permanent
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
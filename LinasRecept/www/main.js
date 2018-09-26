

let ingredientsToShow;
// This funktion sorts out the ingredients that starts with the letters provided in the ingredients-search input
$('#ingredient').keyup(function () {
    let value = $(this).val();
    if (value.length > 1) {
        $.getJSON('/autocomplete-ingredient-name/' + $('#ingredient').val(), function (sIngredients) {
            //Instead of a list maybe a drop down would be nice
            if (sIngredients) {
                $('#choose-ingredient').empty();
                $('.add-ingredient h1').text('Förslag på ingredienser');
                for (let ing of sIngredients) {
                    $('#choose-ingredient').append('<li><a href="#">' + ing + '</a></li>');
                }
            }
        })
    } else {
        console.log('För kort att söka på')
        $('#choose-ingredient').empty();
        $('.add-ingredient h1').empty();
    }
});

//This function makes it possible to choose witch ingredient from the list provided in the ingredient search and fill in quantity but not add it
let recipeIngredients = [];
let deleteIngredient = 0;
$('#choose-ingredient').on('click', 'a', function () {
    let ing = this.text;
    console.log(ing);
    $('#ingredient').val("");
    $('.add-ingredient h1').text('Ange mängd');
    $('#choose-ingredient').empty();
    $('#choose-ingredient').append(ing);
    $('#choose-ingredient').append('</br>Mängd: <input id="m"/> Enhet: <input id="e"/> En enhet i gram <input id="g"/> <input id="addIngredient" type="button" value = "skicka"/>');

    let numErr = 0;
    let fieldErr = 0;
    $('#addIngredient').on('click', function () {
        console.log('tryckte på lägg till ingridient')
        let m = $('#m').val();
        let e = $('#e').val();
        let g = $('#g').val();

        if (!m || !e || !g & fieldErr == 0) { //Posible to use regex here :)
            $('#choose-ingredient').append("Alla rutor måste fyllas i. ");
            fieldErr++;
        } else {
            if (!isNaN(m) & !isNaN(g) & isNaN(e)) {
                let ingredientToAppend =
                {
                    name: ing,
                    quantity: m,
                    unit: e,
                    inGrams: g
                }

                $('#ingredienser ul').append('<li>' + ing + " " + m + " " + e + '</li>');
                if (deleteIngredient == 0) {
                    console.log('här')
                    $('#ingredienser').append('  <input type="button" value="Töm"></input>');
                    deleteIngredient++;
                }
                recipeIngredients.push(ingredientToAppend);
                console.log(recipeIngredients)
                $('#choose-ingredient').empty();
                $('.add-ingredient h1').empty();
            }
            else if (numErr == 0) {
                $('#choose-ingredient').append('"Mängd" och "i gram" får bara vara siffror, "enhet" ska vara i bokstäver');
                numErr++;
            }
        }
    })
})


//This five simular functions are posting to a preview
//Name
let deleteName = 0;
let recipeName = "";
$('#recipe-name-button').on('click', function () {
    let input = $('#recipe-name').val();
    recipeName = input;
    showInPreview($('#rubrik ul'),$('#rubrik'), deleteName, input, true);
    $('#recipe-name').val("")
    deleteName++;
})

//Todo
let deleteToDo = 0;
let todoList = [];
$('#toDo-button').on('click', function () {
    let input = $('#toDo').val();
    todoList.push(input);
    showInPreview($('#toDo-pre ul'),$('#toDo-pre'), deleteToDo, input, false);
    $('#toDo').val("");
    deleteToDo++;
})
//Description
let deleteDescription = 0;
let description;
$('#recipe-description-button').on('click', function () {
    let input = $('#recipe-description').val();
    description = input;
    showInPreview($('#pre-description ul'),$('#pre-description'), deleteDescription, input, true);
    $('#recipe-description').val("");
    deleteDescription++;
})

//Picture
let deletePicture = 0;
let recipePicture;
$('#recipe-picture-button').on('click', function () {
    let input = $('#recipe-picture').val();
    recipePicture = input;
    showInPreview($('#pre-picture ul'),$('#pre-picture'),deletePicture,input, true);
    $('#recipe-picture').val("")
    deletePicture++;
})

//Tags 2
let deleteTags = 0;
let recipeTags = [];
$('#recipe-tag-button2').on('click', function () {
    let input = $('#recipe-tag-select').val();
    recipeTags.push(input);
    showInPreview($('#pre-tags ul'),$('#pre-tags'),deleteTags, input, false);
    deleteTags++;
})

//Function to show Recipe-Name, Picture-url, ingrdeients, todo, tags in preview
function showInPreview(targetUl, target, deleteCount, input, oneOnly){
    if(oneOnly){
        targetUl.empty();
    }   
    console.log(input);
    targetUl.append('<li>' + input + '</li>');
    if (deleteCount == 0) {
        console.log('här')
        target.append('<input type="button" value="Töm"></input>');
    }
}

//Method to delete title, todo, tags, picture, description in preview recipe
$('.pre-recipe').on('click', 'input', function () {
    let div = $(this).closest('div');
    let ulList = div.attr('id');
    div.empty();
    div.append('<ul></ul>');
    if (ulList == 'rubrik') {
        recipeName = "";
        deleteName = 0;
    } else if (ulList == 'toDo-pre') {
        todoList = [];
        deleteToDo = 0;
    } else if (ulList == 'ingredienser') {
        recipeIngredients = [];
        deleteIngredient = 0;
    } else if (ulList == 'pre-picture') {
         recipePicture = "";
        deletePicture = 0;
    } else if (ulList == 'pre-tags') {
        recipeTags = [];
        deleteTags = 0;
    } else if (ulList == 'pre-description'){
        description = "";
        deleteDescription = 0 ;
    }
    console.log('deleted' + ulList);
});


//Method to get the right nutrition data and add it to the recipe.json
$('#submitRecipe').on('click', async function () {
    if (recipeIngredients.length > 0 && todoList.length > 0 && recipeName !== "" && recipePicture!=="" && recipeTags.length>0) {
        console.log('receptet ska sparas strax')
        let nutrition = 
            {
                "Ener" : 0,
                "Prot" : 0,
                "Kolh" : 0,
                "Mono/disack" : 0,
                "Mfet" : 0,
                "Mone" : 0,
                "Pole" : 0,
                "NaCl" : 0
            }

        // recipeIngredients.forEach(i => {
        for (let index = 0; index < recipeIngredients.length; ++index) {
            let ingredient = recipeIngredients[index];
            console.log(ingredient.name)
            let tempName = encodeURI(ingredient.name)
            let nutritionPerIng = await $.getJSON('/ingredient-name/' + tempName); // add url
            let nutritions = nutritionPerIng[0].Naringsvarden.Naringsvarde;
            console.log(nutritionPerIng)
            //for (let a = 0; a < 8; a++) {
            for(let nutrient of nutritions){
                const shortName = nutrient.Forkortning;
                const value = nutrient.Varde;
                //debugger;
                if(nutrition.hasOwnProperty(shortName)){
                    let quantity = ingredient.quantity.replace(",", ".");
                    let inGrams = ingredient.inGrams.replace(",", ".");

                    nutrition[shortName] += (parseFloat(value)*parseFloat(quantity)*parseFloat(inGrams)/100);
                }
            }
        };

        //Making a recipe-object that is sent to recipe.json
        let recipe = {
            name: recipeName,
            picture: recipePicture,
            description: description,
            tags: recipeTags,
            ingredients: recipeIngredients,
            todo: todoList,
            nutrition: nutrition
        };
        
        $.ajax({
            type : "POST",
            url: "/add-recipe",
            data: JSON.stringify(recipe),
            processData: false,
            dataType: "json",
            headers: {"Content-type": "application/json"}
        })
        $('.pre-recipe').find('div').empty().append('<ul></ul>');
        deleteName=0;
        deletePicture=0;
        deleteDescription=0;
        deleteTags=0;
        deleteIngredient=0;
        deleteToDo=0;
        recipeTags=[];
        todoList=[];
        recipeIngredients=[];
    }
    else {
        console.log("alla fält måste vara i fyllda")
    }
});




//ALLT NEDAN HÖR TILL SOK.HTML!!!

//Method to search for recipe
let result;
let matchedRecipes = [];
$('#input-search-recipe').keyup(async function () {
    matchedRecipes = [];
    $('.result').empty();
    $('#numberOfPortions').val(2);

    let searchinput = $('#input-search-recipe').val().toLowerCase();
    let recipes = await $.getJSON('/recipes.json').catch(console.err);
    saveMatchedRecipesInArray(recipes, searchinput, false);
    if(matchedRecipes.length>0){
        showRecipes(matchedRecipes);  
    }
    else { $('.result').text("Inget recept med det namnet hittades");} 
    
    $('.result a').on('click', function(){        
        let clickedName = $(this).text();
        console.log(clickedName);
        findSingleRecipe(clickedName, recipes)
    });
});

//Method to search with tags
$('.tag-checkbox').on('change', async function () {
    matchedRecipes = [];
    $('.result').empty();
    $('#numberOfPortions').val(2);
    let taginput = $('.tag-checkbox').val().toLowerCase();
    console.log(taginput);
    let recipes = await $.getJSON('/recipes.json').catch(console.err);
    saveMatchedRecipesInArray(recipes, taginput, true);
    if(matchedRecipes.length>0){
        showRecipes(matchedRecipes);  
    }
    else { $('.result').text("Inget recept med det namnet hittades");} 
    
    $('.result a').on('click', function(){        
        let clickedName = $(this).text();
        console.log(clickedName);
        findSingleRecipe(clickedName, recipes)
    });
});

function findSingleRecipe(recipeName, recipes){
    for(let r of recipes){
        if(r.name == recipeName){
            showSingleRecipe(r);
        }
    }
}

function showSingleRecipe(recipe){
    //console.log(recipe)
    $('.tag-checkbox').val(0);
    $('.result').empty();
    $('#div-result').append('<h2>'+recipe.name+'</h2>');
    $('#div-picture').append('<img src= "'+recipe.picture +'"/>')
    $('#div-ingredients').append('<h3>Ingredienser:</h3><ul></ul>');
    $('#div-description').append(recipe.description);
    let x = recipe.ingredients.length;
    if(x>0){
        console.log("jippi")
        for(let ing of recipe.ingredients){
        $('#div-ingredients ul').append('<li>' + ing["name"] + " " + ing["quantity"] + " " + ing["unit"] + '</li>');}
    }else{    $('#div-ingredients ul').append('<li>' + recipe.ingredients["name"] + " " + recipe.ingredients["quantity"] + " " + recipe.ingredients["unit"] + '</li>');}

    $('#div-todo').append('<h3>Gör så här:</h3>')
    $('#div-todo').append('<ul></ul>');
    for(let todo of recipe.todo){
        $('#div-todo ul').append('<li>' + todo + '</li>');
    }
    $('#div-nutrition').append('<h3>Näringsinnehåll:</h3>')
    $('#div-nutrition').append('<ul><li> Energi (kcal) ' + recipe.nutrition["Ener"] +
    '</li><li> Protein (g) ' + recipe.nutrition["Prot"] +
    '</li><li> Kolhydrater (g) ' + recipe.nutrition["Kolh"] +
    '</li><li> Varav sockerarter (g) ' + recipe.nutrition["Mono/disack"] +
    '</li><li> Mättade fetter (g) ' + recipe.nutrition["Mfet"] +
    '</li><li> Enkelomättade fetter (g) ' + recipe.nutrition["Mone"] +
    '</li><li> Fleromättade fetter (g) ' + recipe.nutrition["Pole"] +
    '</li><li> Salter (g) ' + recipe.nutrition["NaCl"] +'</li></ul>');
}

// saves matched recepies when searching
function saveMatchedRecipesInArray(recipes, searchinput, isTag){
    for (let r of recipes) {
        //console.log("dessa taggar"+r.tags);
        //console.log(searchinput);
        if((isTag && r.tags.includes(searchinput)) || (!isTag && r.name.toLowerCase().startsWith(searchinput))){//funkar antagligen inte
            //match = true;
            console.log("hittar match")
            result = r;
            recipeInList = {
                name: r.name,
                picture: r.picture
            };
            matchedRecipes.push(recipeInList);
        };
    };
};

//Function that shows found recipes in browser
function showRecipes(recipesToShow){
    $('.result-temp').append("<div><ul></ul></div>")
        for(rec of recipesToShow){
            if(rec.picture){
                $('.result-temp').append("<a href='#'><li>"+rec.name +"</li><li><img src='"+rec.picture+"' alt='Linastest'></img></li></a>");
            }
            else{
                console.log("rad 406");
                //debugger
                $('.result-temp').append("<a href='#'><li>" + rec.name + "</li></a>");
            }
        }
};

//Changing ingredient quantity when portions is changed
$('#numberOfPortions').on('change', function(){
    $('#div-ingredients').empty();
    $('#div-ingredients').append('<h3>Ingredienser:</h3><ul></ul>');
    for (let i of result.ingredients) {
        $('#div-ingredients ul').append('<li>'+i.name + " " +i.quantity*$(this).val()/2 + i.unit+'</li>');
    }
});


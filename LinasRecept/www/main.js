//Login
function showLogin(){
    if($('.modal-login').hasClass("hide")){
    $('.modal-login').toggleClass("hide");
}}
showLogin();

$('.login-btn').on('click', function(){
    let username=$('#username').val();
    let password=$('#password').val();
    let user={username: username,
        password: password
    };
    $.ajax({
        type : "POST",
        url: "/login",
        data: JSON.stringify(user),
        processData: false,
        dataType: "json",
        headers: {"Content-type": "application/json"},
        success: function(data){
            if(data){
                $('.modal-login').toggleClass("hide");
            }
        }
    })
});


let ingredientsToShow;
$('#ingredient').keyup(function () {
    let value = $(this).val();
    if (value.length > 1) {
        $.getJSON('/autocomplete-ingredient-name/' + $('#ingredient').val(), function (sIngredients) {
            if (sIngredients) {
                $('#choose-ingredient').empty();
                $('.add-ingredient h1').text('Förslag på ingredienser');
                for (let ing of sIngredients) {
                    $('#choose-ingredient').append('<li><a href="#">' + ing + '</a></li>');
                }
            }
        })
    } else {
        $('#choose-ingredient').empty();
        $('.add-ingredient h1').empty();
    }
});

//Index.html add recipes
let sIngredientsCopy=[];
$('#ingredientInput').keyup(function () {
    $('#ingredients').empty();
   
    let value = $(this).val();
    if (value.length > 1) {
        $.getJSON('/autocomplete-ingredient-name/' + $('#ingredientInput').val(), function (sIngredients) {
            if (sIngredients) {
               sIngredientsCopy=sIngredients;
                for (let ing of sIngredients) { 
                    $('#ingredients').append('><option value="'+ing + '">');
                }
            }
        })
    } 
});
let recipeIngredients = [];
let deleteIngredient = 0;
$('#choose-ingredient2').on('click', function () {
    let ing = $('#ingredientInput').val();
    
    if(sIngredientsCopy.includes(ing)){
    $('.ingredientDoNotExcist').empty();
    $('#ingredients').val("");
    $('.add-ingredient h5').text('Ange mängd');
    $('#choose-ingredient').empty();
    $('#choose-ingredient').append(ing);
    $('#choose-ingredient').append('</br>Mängd: <input class="form-control" id="m"/> Enhet: <input class="form-control" id="e"/> En enhet i gram <input class="form-control" id="g"/> <input id="addIngredient" type="button" class="btn" value = "skicka"/>');

    let numErr = 0;
    let fieldErr = 0;
    $('#addIngredient').on('click', function () {
        let m = $('#m').val();
        let e = $('#e').val();
        let g = $('#g').val();

        if (!m || !e || !g & fieldErr == 0) { 
            $('#choose-ingredient').append('Alla rutor måste fyllas i!');
            fieldErr++;
        } else {
            $('.add-ingredient h5').text("");
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
                    $('#ingredienser').append('  <input type="button" value="Töm"></input>');
                    deleteIngredient++;
                }
                recipeIngredients.push(ingredientToAppend);
                $('#choose-ingredient').empty();
                $('.add-ingredient h1').empty();
            }
            else if (numErr == 0) {
                $('#choose-ingredient').append('<p class="warning">"Mängd" och "i gram" får bara vara siffror, "enhet" ska vara i bokstäver</p>');
                numErr++;
            }
        }
    })
}else{
    $('.ingredientDoNotExcist').append('Ingrediensen finns inte, välj en från listan!')
}
});

//This five simular functions are posting to a preview
//Name
let deleteName = 0;
let recipeName = "";
$('#recipe-name-button').on('click', async function () {
    let recepies = await $.getJSON('/recipes.json').catch(console.err);
    let nameNotTaken=true;
    let input = $('#recipe-name').val();
    for(let r of recepies){
        if(r.name.toLowerCase()==input.toLowerCase()){
            nameNotTaken=false;
            
        }
    }
    if(nameNotTaken){
    recipeName = input;
    showInPreview($('#rubrik ul'),$('#rubrik'), deleteName, input, true);
    $('#recipe-name').val("")
    deleteName++;
    $('.name-message').text('');
} else{
    $('.name-message').text('Det finns redan ett recept med detta namn! Välj ett annat!');
}
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
let description="";
$('#recipe-description-button').on('click', function () {
    let input = $('#recipe-description').val();
    description = input;
    showInPreview($('#pre-description ul'),$('#pre-description'), deleteDescription, input, true);
    $('#recipe-description').val("");
    deleteDescription++;
})

//Picture
let deletePicture = 0;
let recipePicture="";
$('#recipe-picture-button').on('click', function () {
    let input = $('#recipe-picture').val();
    recipePicture = input;
    showInPreview($('#pre-picture ul'),$('#pre-picture'),deletePicture,input, true);
    $('#recipe-picture').val("")
    deletePicture++;
})

//Tags
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
    targetUl.append('<li>' + input + '</li>');
    if (deleteCount == 0) {
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
});


//Method to get the right nutrition data and add it to the recipe.json
$('#submitRecipe').on('click', async function () {
    if (recipeIngredients.length > 0 && todoList.length > 0 && recipeName !== "" && recipePicture!=="" && recipeTags.length>0 && description!=="") {
        $('#submit-message').empty();
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

        for (let index = 0; index < recipeIngredients.length; ++index) {
            let ingredient = recipeIngredients[index];
            let tempName = encodeURI(ingredient.name)
            let nutritionPerIng = await $.getJSON('/ingredient-name/' + tempName);
            let nutritions = nutritionPerIng[0].Naringsvarden.Naringsvarde;
            for(let nutrient of nutritions){
                const shortName = nutrient.Forkortning;
                const value = nutrient.Varde;
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
        $('.preview').empty().append('<ul></ul>');
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
        $('#submit-message').text('Alla fält måste vara ifyllda innan receptet sparas!');
    }
});




//Methods to the SOK.HTML!!!
let lastRecipes;
async function loadRecipesOnStart(){
 RecipesOnStart = await $.getJSON('/recipes.json').catch(console.err);
 let numberOfRecipes = RecipesOnStart.length;
 let lastRecipes=[];
    for(let index=numberOfRecipes-1; index>numberOfRecipes-7; index--){
        lastRecipes.push(RecipesOnStart[index])
    }
    showRecipes(lastRecipes);
    $('.result a').on('click', function(){        
        let clickedName = $(this).find('h5').text();
        findSingleRecipe(clickedName, lastRecipes)
    });
};

loadRecipesOnStart();
$('.showOnSingleRecipe').hide();

//Method to search for recipe
let result;
let matchedRecipes = [];
$('#input-search-recipe').keyup(async function () {
    $('.showOnSingleRecipe').hide();
    matchedRecipes = [];
    emptySearchOutputField();
    
    $('#numberOfPortions').val(2);

    let searchinput = $('#input-search-recipe').val().toLowerCase();
    let recipes = await $.getJSON('/recipes.json').catch(console.err);
    
    saveMatchedRecipesInArray(recipes, searchinput, "recipename");
    if(matchedRecipes.length>0 && searchinput!=""){
        showRecipes(matchedRecipes);  
    }
    else { 
        alert("Inget recept hittat");
        loadRecipesOnStart();
        $('#input-search-recipe').val("");
    } 
    
    $('.result a').on('click', function(){        
        let clickedName = $(this).find('h5').text();
        findSingleRecipe(clickedName, recipes)
    });
});

//Method to search in description of recipe
$('#input-search-description').keyup(async function () {
    $('.showOnSingleRecipe').hide();
    matchedRecipes = [];
    emptySearchOutputField();
    
    $('#numberOfPortions').val(2);

    let searchinput = $('#input-search-description').val().toLowerCase();
    let recipes = await $.getJSON('/recipes.json').catch(console.err);
    
    saveMatchedRecipesInArray(recipes, searchinput, "description");
    if(matchedRecipes.length>0 && searchinput!=""){
        showRecipes(matchedRecipes);  
    }
    else { 
        alert("Inget recept hittat");
        loadRecipesOnStart();
        $('#input-search-recipe').val("");
    } 
    
    $('.result a').on('click', function(){        
        let clickedName = $(this).find('h5').text();
        findSingleRecipe(clickedName, recipes)
    });
});

//Method to search with tags
$('.tag-checkbox').on('change', async function () {
    $('.showOnSingleRecipe').hide();
    matchedRecipes = [];
    emptySearchOutputField();
    $('#numberOfPortions').val(2);
    let taginput = $('.tag-checkbox').val().toLowerCase();
    let recipes = await $.getJSON('/recipes.json').catch(console.err);
    saveMatchedRecipesInArray(recipes, taginput, "tag");
    if(matchedRecipes.length>0){
        showRecipes(matchedRecipes);  
    }

    else {
         $('.colOne ul').text("Inget recept med det namnet hittades");
        } 
    
    $('.result a').on('click', function(){        
        let clickedName = $(this).find('h5').text();
        findSingleRecipe(clickedName, recipes)
    });
});

function findSingleRecipe(clickedName, recipes){
    for(let r of recipes){
        if(r.name == clickedName){
            showSingleRecipe(r);
        }
    }
}

let tempIngredientList;
function showSingleRecipe(recipe){
    $('.showOnSingleRecipe').show();

    tempIngredientList = recipe.ingredients;
    $('.tag-checkbox').val(0);
    emptySearchOutputField();
    $('#div-title').append('<h2>'+recipe.name+'</h2>');
    $('#div-picture').append('<img class="bigPicture" src= "'+recipe.picture +'"/>')
    $('#div-ingredients').append('<h3>Ingredienser:</h3><ul></ul>');
    $('#div-description').append(recipe.description);
    let x = recipe.ingredients.length;
    if(x>0){
        for(let ing of recipe.ingredients){
        let quantity=ing["quantity"].replace(".",","); 
        $('#div-ingredients ul').append('<li>' + ing["name"] + " " + quantity + " " + ing["unit"] + '</li>');}
    }else{ 
        let quantity = recipe.ingredients["quantity"].replace(".",",");   
        $('#div-ingredients ul').append('<li>' + recipe.ingredients["name"] + " " + recipe.ingredients["quantity"] + " " + recipe.ingredients["unit"] + '</li>');}

    $('#div-todo').append('<h3>Gör så här:</h3>')
    $('#div-todo').append('<ul></ul>');
    for(let todo of recipe.todo){
        
        $('#div-todo ul').append('<li>' + todo + '</li>');
    }
    $('#div-nutrition').append('<h3>Näringsinnehåll:</h3>')
    $('#div-nutrition').append('<ul><li> Energi (kcal) ' + Number(recipe.nutrition["Ener"]).toFixed(2).replace(".",",") +
    '</li><li> Protein (g) ' + Number(recipe.nutrition["Prot"]).toFixed(2).replace(".",",") +
    '</li><li> Kolhydrater (g) ' + Number(recipe.nutrition["Kolh"]).toFixed(2).replace(".",",") +
    '</li><li> Varav sockerarter (g) ' + Number(recipe.nutrition["Mono/disack"]).toFixed(2).replace(".",",") +
    '</li><li> Mättade fetter (g) ' + Number(recipe.nutrition["Mfet"]).toFixed(2).replace(".",",") +
    '</li><li> Enkelomättade fetter (g) ' + Number(recipe.nutrition["Mone"]).toFixed(2).replace(".",",") +
    '</li><li> Fleromättade fetter (g) ' + Number(recipe.nutrition["Pole"]).toFixed(2).replace(".",",") +
    '</li><li> Salter (g) ' + Number(recipe.nutrition["NaCl"]).toFixed(2).replace(".",",") +'</li></ul>');
}

// saves matched recepies when searching
function saveMatchedRecipesInArray(recipes, searchinput, type){
    for (let r of recipes) {
        if((type=="tag" && r.tags.includes(searchinput)) ||(type=="description" && r.description.toLowerCase().includes(searchinput)) || (type=="recipename" && r.name.toLowerCase().startsWith(searchinput))){//funkar antagligen inte
            result = r;
            recipeInList = {
                name: r.name,
                picture: r.picture,
                description: r.description
            };
            matchedRecipes.push(recipeInList);
        };
    };
};

//Function that shows found recipes in browser
function showRecipes(recipesToShow){
    let tempvariabel=0; 
    for(rec of recipesToShow){
            if(tempvariabel%3==0){
                $('.colOne').append('<a href="#"><div class="card"><img class= "card-img-top" src="'+rec.picture+'"alt="Linastest"><div class="card-body"><h5 class="card-title">'+rec.name+'</h5>'+rec.description+'</div></div></a>');
                tempvariabel++;
            }else if(tempvariabel%3==1){
                $('.colTwo').append('<a href="#"><div class="card"><img class= "card-img-top" src="'+rec.picture+'"alt="Linastest"><div class="card-body"><h5 class="card-title">'+rec.name+'</h5>'+rec.description+'</div></div></a>');
                tempvariabel++;
            }else if(tempvariabel%3==2){
                $('.colThree').append('<a href="#"><div class="card"><img class= "card-img-top" src="'+rec.picture+'"alt="Linastest"><div class="card-body"><h5 class="card-title">'+rec.name+'</h5>'+rec.description+'</div></div></a>');
                tempvariabel++;
            }
        }
};

//Changing ingredient quantity when portions is changed
$('#numberOfPortions').on('change', function(){
    $('#div-ingredients').empty();
    $('#div-ingredients').append('<h3>Ingredienser:</h3><ul></ul>');
    for (let i of tempIngredientList) {
        let quantity = i.quantity*$(this).val()/2;
        $('#div-ingredients ul').append('<li>'+i.name + " " +quantity.toString().replace(".",",") + i.unit+'</li>');
    }
});

function emptySearchOutputField(){
    $('.colOne').empty();
    $('.colTwo').empty();
    $('.colThree').empty();
    $('#div-picture').empty();
    $('#div-ingredients').empty();
    $('#div-description').empty();
    $('#div-nutrition').empty();
    $('#div-todo').empty();
    $('#div-title').empty();
}


// let logedIn =false;
// $('.login').on('click', function(){
//     console.log($('.uname').val())
//     if($('.uname').val()=="Lina" && $('.password').val()=="Mattsson"){
//         console.log('rad 382 inlogg rätt')
//         logedIn = true;
//         window.location = '/index.html';
//     }
//     else{$('container1').append("fel användarnamn eller lösenord")};
// });
// testtesttest
// $('#ingredient2').keyup(function () {
//     $('select-ingredient2').empty();
//     let value = $(this).val();
//     if (value.length > 1) {
//         $.getJSON('/autocomplete-ingredient-name/' + $('#ingredient2').val(), function (sIngredients) {
//             console.log($('#ingredient2').val());
//             //Instead of a list maybe a drop down would be nice
//             if (sIngredients) {
//                 console.log('finns ingredienser');
//                 // $('#choose-ingredient').empty();
//                 // $('.add-ingredient h1').text('Förslag på ingredienser');
               
//                 for (let ing of sIngredients) { 
//                     console.log('det går frammåt');
//                     $('#select-ingredient2').append('<option value="'+ing + '">'+ing+'</option>');
//                     debugger
//                     // $('#choose-ingredient').append('<li><a href="#">' + ing + '</a></li>');
//                 }
//             }
//         })
//     } else {
//         console.log('För kort att söka på')
//         // $('#choose-ingredient').empty();
//         // $('.add-ingredient h1').empty();
//     }
// });

//This function makes it possible to choose witch ingredient from the list provided in the ingredient search and fill in quantity but not add it

// $('#choose-ingredient').on('click', 'a', function () {
//     let ing = this.text;
//     console.log(ing);
//     $('#ingredient').val("");
//     $('.add-ingredient h1').text('Ange mängd');
//     $('#choose-ingredient').empty();
//     $('#choose-ingredient').append(ing);
//     $('#choose-ingredient').append('</br>Mängd: <input class="form-control" id="m"/> Enhet: <input class="form-control" id="e"/> En enhet i gram <input class="form-control" id="g"/> <input id="addIngredient" type="button" class="btn" value = "skicka"/>');

//     let numErr = 0;
//     let fieldErr = 0;
//     $('#addIngredient').on('click', function () {
//         console.log('tryckte på lägg till ingridient')
//         let m = $('#m').val();
//         let e = $('#e').val();
//         let g = $('#g').val();

//         if (!m || !e || !g & fieldErr == 0) { //Posible to use regex here :)
//             $('#choose-ingredient').append('Alla rutor måste fyllas i!');
//             fieldErr++;
//         } else {
//             if (!isNaN(m) & !isNaN(g) & isNaN(e)) {
//                 let ingredientToAppend =
//                 {
//                     name: ing,
//                     quantity: m,
//                     unit: e,
//                     inGrams: g
//                 }

//                 $('#ingredienser ul').append('<li>' + ing + " " + m + " " + e + '</li>');
//                 if (deleteIngredient == 0) {
//                     console.log('här')
//                     $('#ingredienser').append('  <input type="button" value="Töm"></input>');
//                     deleteIngredient++;
//                 }
//                 recipeIngredients.push(ingredientToAppend);
//                 console.log(recipeIngredients)
//                 $('#choose-ingredient').empty();
//                 $('.add-ingredient h1').empty();
//             }
//             else if (numErr == 0) {
//                 $('#choose-ingredient').append('<p class="warning">"Mängd" och "i gram" får bara vara siffror, "enhet" ska vara i bokstäver</p>');
//                 numErr++;
//             }
//         }
//     })
// })

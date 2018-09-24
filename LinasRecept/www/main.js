// $.getJSON('/autocomplete-ingredient-name/bac', function(recipes){
// console.log(recipes);
// })

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
            }
            else if (numErr == 0) {
                $('#choose-ingredient').append('"Mängd" och "i gram" får bara vara siffror, "enhet" ska vara i bokstäver');
                numErr++;
            }
        }
    })
})


//This two simular functions are posting the title and todo of the recipe to a preview
let deleteName = 0;
let recipeName = "";
$('#recipe-name-button').on('click', function () {
    let input = $('#recipe-name').val();
    recipeName = input;
    $('#rubrik ul').empty();
    console.log(input);
    $('#rubrik ul').append('<li>' + input + '</li>');
    if (deleteName == 0) {
        console.log('här')
        $('#rubrik').append('  <input type="button" value="Töm"></input>');
    }
    $('#recipe-name').val("")
    deleteName++;
})

let deleteToDo = 0;
let todoList = [];
$('#toDo-button').on('click', function () {
    let input = $('#toDo').val();
    todoList.push(input);
    $('#toDo-pre ul').append('<li>' + input + '</li>');
    if (deleteToDo == 0) {
        $('#toDo-pre').append('  <input type="button" value="Töm"></input>');
    }
    $('#toDo').val("");
    deleteToDo++;
})

//Method to delete title och todo in preview recipe
$('.pre-recipe').on('click', 'input', function () {
    console.log('try to empty')
    let ulList = $(this).closest('div').attr('id');
    $(this).closest('div').empty();
    if (ulList == 'rubrik') {
        recipeName = "";
        $('#rubrik').append('<ul>' + '</ul>');
        deleteName = 0;
    } else if (ulList == 'toDo-pre') {
        todoList = [];
        $('#toDo-pre').append('<ul>' + '</ul>');
        deleteToDo = 0;
    } else if (ulList == 'ingredienser') {
        recipeIngredients = [];
        $('#ingredienser').append('<ul>' + '</ul>');
        deleteIngredient = 0;
    }
    console.log('deleted' + ulList);
});

//This function is not permanent
async function start() {
    recipes = await $.getJSON('/recipes.json').catch(console.err);
    console.log(recipes);
    // let recipes2 = await $.getJSON('/recipe2.json');
}

//Metod för att få fram näringsvärde till receptet och lägga till det i recipe.json
$('#submitRecipe').on('click', async function () {
    if (recipeIngredients.length > 0 && todoList.length > 0 && recipeName !== "") {
        console.log('receptet ska sparas strax')
        let nutrition = /*[
            ["Energi i kcal", "Protein", "Kolhydrater", "varav Sockerarter",
            "Mättat fett", "OmättatFett", "Fleromättat fett", "Salt"],
            ["Ener", "Prot", "Kolh", "Mono/disack", "Mfet", "Mone", "Pole", "NaCl"],
            ["0", "0", "0", "0", "0", "0", "0", "0"],
            ["kcal", "g", "g", "g", "g", "g", "g", "g"]];*/
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
                debugger;
                if(nutrition.hasOwnProperty(shortName)){
                    let quantity = ingredient.quantity.replace(",", ".");
                    let inGrams = ingredient.inGrams.replace(",", ".");

                    nutrition[shortName] += (parseFloat(value)*parseFloat(quantity)*parseFloat(inGrams)/100);
                }
            }
                // let shortPath = nutritionPerIng[0].Naringsvarden.Naringsvarde;
                // let index = shortPath.map(obj => obj.Forkortning).indexOf(nutrition[1][a]);
                // let num = shortPath[index].Varde;
                // num = num.replace(",", ".");
                // num = num.replace(" ", "");
                // ingredient.quantity = ingredient.quantity.replace(",", "."); //This could be the reason why the decimals don't add upp correct
                // ingredient.inGrams = ingredient.inGrams.replace(",", ".");
                // let percent = parseFloat(ingredient.quantity) * parseFloat(ingredient.inGrams) / 100;
                // nutrition[2][a] = parseFloat(nutrition[2][a]) + (parseFloat(num) * percent);
                // //let t= parseFloat(nutrition[2][a]) + parseFloat(shortPath[index].Varde);
                // console.log("index " + index)
                // console.log("värde " + nutrition[2][a]);
            
        };
        //Gör receptet till ett objekt som kan skickas till recipe.json
        let recipe = {
            name: recipeName,
            ingredients: recipeIngredients,
            todo: todoList,
            nutrition: nutrition
        };
        console.log('aaaaaaa', recipe);
        $.ajax({
            type : "POST",
            url: "/add-recipe",
            data: JSON.stringify(recipe),
            processData: false,
            dataType: "json",
            headers: {"Content-type": "application/json"}
        })
        // $.post('/add-recipe', recipe, function () {
        //     console.log('sparat');
        // }, "json");
    }
    else {
        console.log("alla fält måste vara i fyllda")
    }
});




//ALLT NEDAN HÖR TILL SOK.HTML!!!
let result;
//Metod för att söka recept
$('#search-recipe').on('click', async function () {
    let searchinput = $('#input-search-recipe').val().toLowerCase();
    recipes = await $.getJSON('/recipes.json').catch(console.err);
    let match = false;
    
    console.log(recipes);
    for (let r of recipes) {
        if (searchinput == r.name.toLowerCase()) {
            console.log(r.name)
            match = true;
            result = r;
        }
    }
    if (match) {
        $('.result').text(result.name);
        $('.result').append('<br>');
        // $('.result').append('<select id = "numberOfPortions"><option value = "2">2</option><option value = "4">4</option><option value = "6">6</option><option value = "8">8</option><option value = "10">10</option><option value = "12">12</select>');

        let ingredientlist;
        //if(result.ingredients.length>0){
        for (let i of result.ingredients) {
            $('.result').append(i.name + " ");
            $('.result').append(i.quantity);
            $('.result').append(i.unit);
            $('.result').append('</br>');
          //  (result.nutrition[0].forEach(nut => ))
            $('.result').append(result.nutrition[2]);
        }
        
    //}
        // else {
        //     let i = result.ingredienser;
        //     $('.result').append(i.name + " ");
        //     $('.result').append(i.antal);
        //     $('.result').append(i.enhet);
        //     $('.result').append('<br>');
        // }
    }
    else {
        $('.result').text("Inget recept med det namnet hittades");
    }


})

$('#numberOfPortions').on('change', function(){
    $('.result').text(result.name);
    $('.result').append('<br>');
    // $('.result').append('<select id = "numberOfPortions"><option value = "2">2</option><option value = "4">4</option><option value = "6">6</option><option value = "8">8</option><option value = "10">10</option><option value = "12">12</select>');
    let ingredientlist;
//if(result.ingredients.length>0){
    
    for (let i of result.ingredients) {
        $('.result').append(i.name + " ");
        $('.result').append(i.quantity*$(this).val()/2);
        $('.result').append(i.unit);
        $('.result').append('</br>');
  //  (result.nutrition[0].forEach(nut => ))
        $('.result').append(result.nutrition[2]);
    }
});
//addRecipe()

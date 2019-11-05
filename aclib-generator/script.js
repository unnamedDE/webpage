
window.addEventListener('load', () => {
  if(localStorage.getItem('current-recipe')) {
    const recipe = JSON.parse(localStorage.getItem('current-recipe'));
    setRecipe(recipe);
  }
  if(!localStorage.getItem('saved-recipes')) localStorage.setItem('saved-recipes', "[]")
  refreshSavedRecipes();
});

function refreshSavedRecipes() {
  document.querySelector('div#saved-recipes-container').innerHTML = '';
  if(localStorage.getItem('saved-recipes')) {
    const savedRecipes = JSON.parse(localStorage.getItem('saved-recipes'));
    const recipeContainer = document.querySelector('#saved-recipes-container');
    for (let i = 0; i < savedRecipes.length; i++) {
      const e = document.createElement('div');
      e.innerHTML = `<span>${savedRecipes[i].name}</span><button type="button" class="delete-recipe">Delete</button><button type="button" class="load-recipe">Load</button>`;
      recipeContainer.appendChild(e);
      // recipeContainer.insertBefore(e, recipeContainer.childNodes[recipeContainer.childNodes.length - 1])
    }
  }
  document.querySelector('div#saved-recipes-container').innerHTML += '\n<div><input type="text" placeholder="Recipe name" id="save-recipe-name" autocomplete="off"><button type="button" id="add-save-recipe">Save</button></div>';
  const savedRecipes = JSON.parse(localStorage.getItem('saved-recipes'));
  (() => {
    const recipeDeleteButtons = document.querySelectorAll('button.delete-recipe');
    for (let i = 0; i < recipeDeleteButtons.length; i++) {
      recipeDeleteButtons[i].addEventListener('click', () => {
        if(confirm('Are you sure to delete this recipe?') === true) {
          const result = savedRecipes.filter(e => e.name != recipeDeleteButtons[i].previousElementSibling.innerText);
          localStorage.setItem('saved-recipes', JSON.stringify(result));
          refreshSavedRecipes();
        }
      })
    }
  })();
  (() => {
    document.querySelector('button#add-save-recipe').addEventListener('click', () => {
      let result = savedRecipes;
      if(savedRecipes.some(e => e.name == document.querySelector('#save-recipe-name').value)) {
        swal({
          title: "Error!",
          text: "You have to choose a unique recipe name'",
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#E12F2F",
          closeOnConfirm: true});
        document.querySelector('#save-recipe-name').value = '';
        return;
      }
      result.push({name: document.querySelector('#save-recipe-name').value, recipe: recipeToJson()});
      localStorage.setItem('saved-recipes', JSON.stringify(result));
      refreshSavedRecipes();
    });
  })();
  (() => {
    const recipeLoadButtons = document.querySelectorAll('button.load-recipe');
    for (let i = 0; i < recipeLoadButtons.length; i++) {
      recipeLoadButtons[i].addEventListener('click', () => {
        const result = savedRecipes.find(e => e.name == recipeLoadButtons[i].previousElementSibling.previousElementSibling.innerText);
        setRecipe(result.recipe);
        document.querySelector('#save-overlay').classList.add('hidden');
      })
    }
  })();
}

function download(filename,text) {
  console.log('download(' + filename + ')');
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename)
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function alertReset(){
  console.log('alertReset()');
	swal({   title: "Reset can't be undone!",
    text: "Are you sure to proceed?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E12F2F",
    confirmButtonText: "Reset!",
    cancelButtonText: "Cancel",
    closeOnConfirm: true,
    closeOnCancel: true },
    function(isConfirm){
      if (isConfirm) {
        reset()
      }
    }
  );
}

function helpMcscript(){
  console.log('helpMcscript()');
	swal({   title: "Using this generator with MCScript",
    text: "Using this generator with MCScript is very simple. \nFirst you have to fill in the input/output items. After that you have to give the recipe a unique ID. The main path should look something like this './folder/subfolder/craft' and the function path like this 'packname:folder/subfolder/craft'. \nThen paste the output in a .mcscript file. Don't forget to insert the main crafting function into the function tag '#ac_lib:advanced_crafter_recipes'.",
    type: "info",
    confirmButtonColor: "#4C36EC",
    confirmButtonText: "OK",
    closeOnConfirm: true
  });
}
function helpMcfunction(){
  console.log('helpMcfunction()');
	swal({   title: "Using this generator with vanilla mcfunctions",
    text: "Using this generator with mcfunctions is very simple. \nFirst you have to fill in the input/output items. After that you have to give the recipe a unique ID. \nThe function path should look something like this 'packname:folder/subfolder/craft'. Then paste the most left output in a .mcfunction file (This is the file you have to mention in '#ac_lib:advanced_crafter_recipes'). After that create a subfolder named the way you specified it in function path and create 3 mcfunctions named 1, 2 and 3. \nThe second output has to go into 'craft/1', the third in 'craft/2', etc.",
    type: "info",
    confirmButtonColor: "#4CAF50",
    confirmButtonText: "OK",
    closeOnConfirm: true
  });
}
function helpSave(){
  console.log('helpSave()');
	swal({   title: "Saving Recipes",
    text: "You can save recipes by choosing a name and clicking save. Load/Delete them by clicking load/delete next to them. Click export to save the current recipe as a file to your computer\nDrag & Drop the file to import.",
    type: "info",
    confirmButtonColor: "#4C36EC",
    confirmButtonText: "OK",
    closeOnConfirm: true
  });
}

const save_loadOverlay = document.querySelector('#save-overlay');

save_loadOverlay.addEventListener('dragover', (event) => {
  overrideDefault(event);
  // dragOver(event);
});
save_loadOverlay.addEventListener('drop', (event) => {
  dropFiles(event);
  overrideDefault(event);
});
save_loadOverlay.addEventListener('dragenter', (event) => {
  overrideDefault(event);
});
save_loadOverlay.addEventListener('dragleave', (event) => {
  overrideDefault(event);
});

function dropFiles(ev) {

    let droppedFiles = ev.dataTransfer.files;
    let fileInput= droppedFiles[0];
    if(!droppedFiles[0]) return;
    if(droppedFiles[0].type != 'text/plain') {
      //(/.+?\-recipe_export.txt/.test(droppedFiles[0].name) == false) && ev.shiftKey == false
      // document.querySelector('button.confirm').click();
      swal({
        title: "Error!",
        text: "Can't import that file\nFiles have to end with '-recipe_export.txt'",
        type: "error",
        showCancelButton: true,
        confirmButtonColor: "#E12F2F",
        confirmButtonText: "Try another file...",
        closeOnConfirm: true,
        closeOnCancel: true});
      return;
    }
    // console.log(ev.dataTransfer.files[0]);
    var reader = new FileReader();
    reader.onload = function() {
      let input = JSON.parse(reader.result)
      // console.log(input)
      if(input.length) {
        let output = [];
        output = output.concat(JSON.parse(localStorage.getItem('saved-recipes')));
        for(let i of input) {
          if(!output.some(e => e.name == i.name)) {
            output.push(i);
          }
        }
        localStorage.setItem('saved-recipes', JSON.stringify(output))
        // console.log(output);
        swal({title: "Success",
          text: "Import successfull",
          type: "success",
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "OK",
          closeOnConfirm: true});
      } else {
        setRecipe(input);
        swal({title: "Success",
          text: "Import successfull",
          type: "success",
          confirmButtonColor: "#4CAF50",
          confirmButtonText: "OK",
          closeOnConfirm: true});
            document.querySelector('#save-container #save-close-button').click();
      }
    }
    reader.readAsText(fileInput)
    sendInfo('Import')
}

function setRecipe(input) {

  var item0_id = document.getElementById('item_0_id');
  var item0_nbt = document.getElementById('item_0_nbt');
  var item0_keep = document.getElementById('item_0_keep');
  var item1_id = document.getElementById('item_1_id');
  var item1_nbt = document.getElementById('item_1_nbt');
  var item1_keep = document.getElementById('item_1_keep');
  var item2_id = document.getElementById('item_2_id');
  var item2_nbt = document.getElementById('item_2_nbt');
  var item2_keep = document.getElementById('item_2_keep');
  var item3_id = document.getElementById('item_3_id');
  var item3_nbt = document.getElementById('item_3_nbt');
  var item3_keep = document.getElementById('item_3_keep');
  var item4_id = document.getElementById('item_4_id');
  var item4_nbt = document.getElementById('item_4_nbt');
  var item4_keep = document.getElementById('item_4_keep');
  var item5_id = document.getElementById('item_5_id');
  var item5_nbt = document.getElementById('item_5_nbt');
  var item5_keep = document.getElementById('item_5_keep');
  var item6_id = document.getElementById('item_6_id');
  var item6_nbt = document.getElementById('item_6_nbt');
  var item6_keep = document.getElementById('item_6_keep');
  var item7_id = document.getElementById('item_7_id');
  var item7_nbt = document.getElementById('item_7_nbt');
  var item7_keep = document.getElementById('item_7_keep');
  var item8_id = document.getElementById('item_8_id');
  var item8_nbt = document.getElementById('item_8_nbt');
  var item8_keep = document.getElementById('item_8_keep');
  var item9_id = document.getElementById('item_9_id');
  var item9_nbt = document.getElementById('item_9_nbt');
  var item9_keep = document.getElementById('item_9_keep');
  var item10_id = document.getElementById('item_10_id');
  var item10_nbt = document.getElementById('item_10_nbt');
  var item10_keep = document.getElementById('item_10_keep');
  var item11_id = document.getElementById('item_11_id');
  var item11_nbt = document.getElementById('item_11_nbt');
  var item11_keep = document.getElementById('item_11_keep');

  var itemout0_id = document.getElementById('output_item_0_id');
  var itemout0_nbt = document.getElementById('output_item_0_nbt');
  var itemout0_count = document.getElementById('output_item_0_count');
  var itemout1_id = document.getElementById('output_item_1_id');
  var itemout1_nbt = document.getElementById('output_item_1_nbt');
  var itemout1_count = document.getElementById('output_item_1_count');
  var itemout2_id = document.getElementById('output_item_2_id');
  var itemout2_nbt = document.getElementById('output_item_2_nbt');
  var itemout2_count = document.getElementById('output_item_2_count');

  var txtMainPath = document.getElementById("main_path");
  var txtFunctionPath = document.getElementById("function_path");
  var txtRecipeId = document.getElementById("receipe_id");

  var commandsInit = document.getElementById("commands_init");
  var commandsCraft = document.getElementById("commands_craft");
  var commandsCancel = document.getElementById("commands_cancel");

  txtMainPath.value = input.txtMainPath || '';
  txtFunctionPath.value = input.txtFunctionPath || '';
  txtRecipeId.value = input.txtRecipeId || '';

  item0_id.value = input.item0 ? input.item0.id || '' : '';
  item0_nbt.value = input.item0 ? input.item0.nbt || '' : '';
  item0_keep.value = input.item0 ? input.item0.keep ? 'keep' : 'use' : 'use';
  item1_id.value = input.item1 ? input.item1.id || '' : '';
  item1_nbt.value = input.item1 ? input.item1.nbt || '' : '';
  item1_keep.value = input.item1 ? input.item1.keep ? 'keep' : 'use' : 'use';
  item2_id.value = input.item2 ? input.item2.id || '' : '';
  item2_nbt.value = input.item2 ? input.item2.nbt || '' : '';
  item2_keep.value = input.item2 ? input.item2.keep ? 'keep' : 'use' : 'use';
  item3_id.value = input.item3 ? input.item3.id || '' : '';
  item3_nbt.value = input.item3 ? input.item3.nbt || '' : '';
  item3_keep.value = input.item3 ? input.item3.keep ? 'keep' : 'use' : 'use';
  item4_id.value = input.item4 ? input.item4.id || '' : '';
  item4_nbt.value = input.item4 ? input.item4.nbt || '' : '';
  item4_keep.value = input.item4 ? input.item4.keep ? 'keep' : 'use' : 'use';
  item5_id.value = input.item5 ? input.item5.id || '' : '';
  item5_nbt.value = input.item5 ? input.item5.nbt || '' : '';
  item5_keep.value = input.item5 ? input.item5.keep ? 'keep' : 'use' : 'use';
  item6_id.value = input.item6 ? input.item6.id || '' : '';
  item6_nbt.value = input.item6 ? input.item6.nbt || '' : '';
  item6_keep.value = input.item6 ? input.item6.keep ? 'keep' : 'use' : 'use';
  item7_id.value = input.item7 ? input.item7.id || '' : '';
  item7_nbt.value = input.item7 ? input.item7.nbt || '' : '';
  item7_keep.value = input.item7 ? input.item7.keep ? 'keep' : 'use' : 'use';
  item8_id.value = input.item8 ? input.item8.id || '' : '';
  item8_nbt.value = input.item8 ? input.item8.nbt || '' : '';
  item8_keep.value = input.item8 ? input.item8.keep ? 'keep' : 'use' : 'use';
  item9_id.value = input.item9 ? input.item9.id || '' : '';
  item9_nbt.value = input.item9 ? input.item9.nbt || '' : '';
  item9_keep.value = input.item9 ? input.item9.keep ? 'keep' : 'use' : 'use';
  item10_id.value = input.item10 ? input.item10.id || '' : '';
  item10_nbt.value = input.item10 ? input.item10.nbt || '' : '';
  item10_keep.value = input.item10 ? input.item10.keep ? 'keep' : 'use' : 'use';
  item11_id.value = input.item11 ? input.item11.id || '' : '';
  item11_nbt.value = input.item11 ? input.item11.nbt || '' : '';
  item11_keep.value = input.item11 ? input.item11.keep ? 'keep' : 'use' : 'use';

  itemout0_id.value = input.itemout0 ? input.itemout0.id || '' : '';
  itemout0_nbt.value = input.itemout0 ? input.itemout0.nbt || '' : '';
  itemout0_count.value = input.itemout0 ? input.itemout0.count || '1' : '1';
  itemout1_id.value = input.itemout1 ? input.itemout1.id || '' : '';
  itemout1_nbt.value = input.itemout1 ? input.itemout1.nbt || '' : '';
  itemout1_count.value = input.itemout1 ? input.itemout1.count || '1' : '1';
  itemout2_id.value = input.itemout2 ? input.itemout2.id || '' : '';
  itemout2_nbt.value = input.itemout2 ? input.itemout2.nbt || '' : '';
  itemout2_count.value = input.itemout2 ? input.itemout2.count || '1' : '1';

  commandsInit.value = input.commandsInit ? input.commandsInit.join('\n') : '';
  commandsCraft.value = input.commandsCraft ? input.commandsCraft.join('\n') : '';
  commandsCancel.value = input.commandsCancel ? input.commandsCancel.join('\n') : '';

  changedInputs();
}

function reset() {
  console.log('reset()');
  document.getElementById('item_0_id').value = "";
  document.getElementById('item_0_nbt').value = "";
  document.getElementById('item_0_keep').value = "use";
  document.getElementById('item_1_id').value = "";
  document.getElementById('item_1_nbt').value = "";
  document.getElementById('item_1_keep').value = "use";
  document.getElementById('item_2_id').value = "";
  document.getElementById('item_2_nbt').value = "";
  document.getElementById('item_2_keep').value = "use";
  document.getElementById('item_3_id').value = "";
  document.getElementById('item_3_nbt').value = "";
  document.getElementById('item_3_keep').value = "use";
  document.getElementById('item_4_id').value = "";
  document.getElementById('item_4_nbt').value = "";
  document.getElementById('item_4_keep').value = "use";
  document.getElementById('item_5_id').value = "";
  document.getElementById('item_5_nbt').value = "";
  document.getElementById('item_5_keep').value = "use";
  document.getElementById('item_6_id').value = "";
  document.getElementById('item_6_nbt').value = "";
  document.getElementById('item_6_keep').value = "use";
  document.getElementById('item_7_id').value = "";
  document.getElementById('item_7_nbt').value = "";
  document.getElementById('item_7_keep').value = "use";
  document.getElementById('item_8_id').value = "";
  document.getElementById('item_8_nbt').value = "";
  document.getElementById('item_8_keep').value = "use";
  document.getElementById('item_9_id').value = "";
  document.getElementById('item_9_nbt').value = "";
  document.getElementById('item_9_keep').value = "use";
  document.getElementById('item_10_id').value = "";
  document.getElementById('item_10_nbt').value = "";
  document.getElementById('item_10_keep').value = "use";
  document.getElementById('item_11_id').value = "";
  document.getElementById('item_11_nbt').value = "";
  document.getElementById('item_11_keep').value = "use";

  document.getElementById('output_item_0_id').value = "";
  document.getElementById('output_item_0_nbt').value = "";
  document.getElementById('output_item_0_count').value = "1";
  document.getElementById('output_item_1_id').value = "";
  document.getElementById('output_item_1_nbt').value = "";
  document.getElementById('output_item_1_count').value = "1";
  document.getElementById('output_item_2_id').value = "";
  document.getElementById('output_item_2_nbt').value = "";
  document.getElementById('output_item_2_count').value = "1";

  document.getElementById("main_path").value = "";
  document.getElementById("function_path").value = "";
  document.getElementById("receipe_id").value = "";

  document.getElementById("output_mcscript").innerHTML = "";
  document.getElementById("output_mcfunction_0").innerHTML = "";
  document.getElementById("output_mcfunction_1").innerHTML = "";
  document.getElementById("output_mcfunction_2").innerHTML = "";
  document.getElementById("output_mcfunction_3").innerHTML = "";


  document.getElementById("commands_init").value = "";
  document.getElementById("commands_craft").value = "";
  document.getElementById("commands_cancel").value = "";

  localStorage.setItem('current-recipe', "{}")
}


function generateInit() {
  var item0_id = document.getElementById('item_0_id');
  var item0_nbt = document.getElementById('item_0_nbt');
  var item1_id = document.getElementById('item_1_id');
  var item1_nbt = document.getElementById('item_1_nbt');
  var item2_id = document.getElementById('item_2_id');
  var item2_nbt = document.getElementById('item_2_nbt');
  var item3_id = document.getElementById('item_3_id');
  var item3_nbt = document.getElementById('item_3_nbt');
  var item4_id = document.getElementById('item_4_id');
  var item4_nbt = document.getElementById('item_4_nbt');
  var item5_id = document.getElementById('item_5_id');
  var item5_nbt = document.getElementById('item_5_nbt');
  var item6_id = document.getElementById('item_6_id');
  var item6_nbt = document.getElementById('item_6_nbt');
  var item7_id = document.getElementById('item_7_id');
  var item7_nbt = document.getElementById('item_7_nbt');
  var item8_id = document.getElementById('item_8_id');
  var item8_nbt = document.getElementById('item_8_nbt');
  var item9_id = document.getElementById('item_9_id');
  var item9_nbt = document.getElementById('item_9_nbt');
  var item10_id = document.getElementById('item_10_id');
  var item10_nbt = document.getElementById('item_10_nbt');
  var item11_id = document.getElementById('item_11_id');
  var item11_nbt = document.getElementById('item_11_nbt');

  var itemout0_id = document.getElementById('output_item_0_id');
  var itemout0_nbt = document.getElementById('output_item_0_nbt');
  var itemout0_count = document.getElementById('output_item_0_count');
  var itemout1_id = document.getElementById('output_item_1_id');
  var itemout1_nbt = document.getElementById('output_item_1_nbt');
  var itemout1_count = document.getElementById('output_item_1_count');
  var itemout2_id = document.getElementById('output_item_2_id');
  var itemout2_nbt = document.getElementById('output_item_2_nbt');
  var itemout2_count = document.getElementById('output_item_2_count');

  var commandsInit = document.getElementById("commands_init");
  var commandsCraft = document.getElementById("commands_craft");
  var commandsCancel = document.getElementById("commands_cancel");

  if(/^\w+?:\w+?$/.test(item0_id.value) == false && item0_id.value != "") {
    item0_id.value = "minecraft:" + item0_id.value
  }
  if(/^\w+?:\w+?$/.test(item1_id.value) == false && item1_id.value != "") {
    item1_id.value = "minecraft:" + item1_id.value
  }
  if(/^\w+?:\w+?$/.test(item2_id.value) == false && item2_id.value != "") {
    item2_id.value = "minecraft:" + item2_id.value
  }
  if(/^\w+?:\w+?$/.test(item3_id.value) == false && item3_id.value != "") {
    item3_id.value = "minecraft:" + item3_id.value
  }
  if(/^\w+?:\w+?$/.test(item4_id.value) == false && item4_id.value != "") {
    item4_id.value = "minecraft:" + item4_id.value
  }
  if(/^\w+?:\w+?$/.test(item5_id.value) == false && item5_id.value != "") {
    item5_id.value = "minecraft:" + item5_id.value
  }
  if(/^\w+?:\w+?$/.test(item6_id.value) == false && item6_id.value != "") {
    item6_id.value = "minecraft:" + item6_id.value
  }
  if(/^\w+?:\w+?$/.test(item7_id.value) == false && item7_id.value != "") {
    item7_id.value = "minecraft:" + item7_id.value
  }
  if(/^\w+?:\w+?$/.test(item8_id.value) == false && item8_id.value != "") {
    item8_id.value = "minecraft:" + item8_id.value
  }
  if(/^\w+?:\w+?$/.test(item9_id.value) == false && item9_id.value != "") {
    item9_id.value = "minecraft:" + item9_id.value
  }
  if(/^\w+?:\w+?$/.test(item10_id.value) == false && item10_id.value != "") {
    item10_id.value = "minecraft:" + item10_id.value
  }
  if(/^\w+?:\w+?$/.test(item11_id.value) == false && item11_id.value != "") {
    item11_id.value = "minecraft:" + item11_id.value
  }
  if(/^\w+?:\w+?$/.test(itemout0_id.value) == false && itemout0_id.value != "") {
    itemout0_id.value = "minecraft:" + itemout0_id.value
  }
  if(/^\w+?:\w+?$/.test(itemout1_id.value) == false && itemout1_id.value != "") {
    itemout1_id.value = "minecraft:" + itemout1_id.value
  }
  if(/^\w+?:\w+?$/.test(itemout2_id.value) == false && itemout2_id.value != "") {
    itemout2_id.value = "minecraft:" + itemout2_id.value
  }

  if(/^{/.test(item0_nbt.value)) {
    item0_nbt.value = item0_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item1_nbt.value)) {
    item1_nbt.value = item1_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item2_nbt.value)) {
    item2_nbt.value = item2_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item3_nbt.value)) {
    item3_nbt.value = item3_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item4_nbt.value)) {
    item4_nbt.value = item4_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item5_nbt.value)) {
    item5_nbt.value = item5_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item6_nbt.value)) {
    item6_nbt.value = item6_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item7_nbt.value)) {
    item7_nbt.value = item7_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item8_nbt.value)) {
    item8_nbt.value = item8_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item9_nbt.value)) {
    item9_nbt.value = item9_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item10_nbt.value)) {
    item10_nbt.value = item10_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(item11_nbt.value)) {
    item11_nbt.value = item11_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(itemout0_nbt.value)) {
    itemout0_nbt.value = itemout0_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(itemout1_nbt.value)) {
    itemout1_nbt.value = itemout1_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }
  if(/^{/.test(itemout2_nbt.value)) {
    itemout2_nbt.value = itemout2_nbt.value.replace(/^{/, "").replace(/}$/, "");
  }

  let commandsInitValue = "";
  commandsInit.value.split('\n').forEach(e => {
    let v = e;
    if(/^\//.test(v)) {
      v = v.replace(/^\//, '');
    }
    commandsInitValue += (commandsInitValue == "" ? "" : "\n") + v;
  });
  commandsInit.value = commandsInitValue;

  let commandsCraftValue = "";
  commandsCraft.value.split('\n').forEach(e => {
    let v = e;
    if(/^\//.test(v)) {
      v = v.replace(/^\//, '');
    }
    commandsCraftValue += (commandsCraftValue == "" ? "" : "\n") + v;
  });
  commandsCraft.value = commandsCraftValue;

  let commandsCancelValue = "";
  commandsCancel.value.split('\n').forEach(e => {
    let v = e;
    if(/^\//.test(v)) {
      v = v.replace(/^\//, '');
    }
    commandsCancelValue += (commandsCancelValue == "" ? "" : "\n") + v;
  });
  commandsCancel.value = commandsCancelValue;
}
function dragOver(ev) {
  swal({   title: "Importing...",
    text: "Import a recipe",
    type: "info",
    confirmButtonColor: "#ccc",
    confirmButtonText: "cancel",
    closeOnConfirm: true});
}
function recipeToJson() {
  generateInit();
  var item0_id = document.getElementById('item_0_id').value;
  var item0_nbt = document.getElementById('item_0_nbt').value;
  var item0_keep = document.getElementById('item_0_keep').value;
  var item1_id = document.getElementById('item_1_id').value;
  var item1_nbt = document.getElementById('item_1_nbt').value;
  var item1_keep = document.getElementById('item_1_keep').value;
  var item2_id = document.getElementById('item_2_id').value;
  var item2_nbt = document.getElementById('item_2_nbt').value;
  var item2_keep = document.getElementById('item_2_keep').value;
  var item3_id = document.getElementById('item_3_id').value;
  var item3_nbt = document.getElementById('item_3_nbt').value;
  var item3_keep = document.getElementById('item_3_keep').value;
  var item4_id = document.getElementById('item_4_id').value;
  var item4_nbt = document.getElementById('item_4_nbt').value;
  var item4_keep = document.getElementById('item_4_keep').value;
  var item5_id = document.getElementById('item_5_id').value;
  var item5_nbt = document.getElementById('item_5_nbt').value;
  var item5_keep = document.getElementById('item_5_keep').value;
  var item6_id = document.getElementById('item_6_id').value;
  var item6_nbt = document.getElementById('item_6_nbt').value;
  var item6_keep = document.getElementById('item_6_keep').value;
  var item7_id = document.getElementById('item_7_id').value;
  var item7_nbt = document.getElementById('item_7_nbt').value;
  var item7_keep = document.getElementById('item_7_keep').value;
  var item8_id = document.getElementById('item_8_id').value;
  var item8_nbt = document.getElementById('item_8_nbt').value;
  var item8_keep = document.getElementById('item_8_keep').value;
  var item9_id = document.getElementById('item_9_id').value;
  var item9_nbt = document.getElementById('item_9_nbt').value;
  var item9_keep = document.getElementById('item_9_keep').value;
  var item10_id = document.getElementById('item_10_id').value;
  var item10_nbt = document.getElementById('item_10_nbt').value;
  var item10_keep = document.getElementById('item_10_keep').value;
  var item11_id = document.getElementById('item_11_id').value;
  var item11_nbt = document.getElementById('item_11_nbt').value;
  var item11_keep = document.getElementById('item_11_keep').value;

  var itemout0_id = document.getElementById('output_item_0_id').value;
  var itemout0_nbt = document.getElementById('output_item_0_nbt').value;
  var itemout0_count = document.getElementById('output_item_0_count').value;
  var itemout1_id = document.getElementById('output_item_1_id').value;
  var itemout1_nbt = document.getElementById('output_item_1_nbt').value;
  var itemout1_count = document.getElementById('output_item_1_count').value;
  var itemout2_id = document.getElementById('output_item_2_id').value;
  var itemout2_nbt = document.getElementById('output_item_2_nbt').value;
  var itemout2_count = document.getElementById('output_item_2_count').value;

  var txtMainPath = document.getElementById("main_path").value;
  var txtFunctionPath = document.getElementById("function_path").value;
  var txtRecipeId = document.getElementById("receipe_id").value;

  var commandsInit = document.getElementById("commands_init").value;
  var commandsCraft = document.getElementById("commands_craft").value;
  var commandsCancel = document.getElementById("commands_cancel").value;

  let output = { };

  if(txtMainPath) output.txtMainPath = txtMainPath;
  if(txtFunctionPath) output.txtFunctionPath = txtFunctionPath;
  if(txtRecipeId) output.txtRecipeId = txtRecipeId;

  if(item0_id || item0_nbt || item0_keep === "keep") output.item0 = { };
  if(item0_id) output.item0.id = item0_id;
  if(item0_nbt) output.item0.nbt = item0_nbt;
  if(item0_keep === "keep") output.item0.keep = true;
  if(item1_id || item1_nbt || item1_keep === "keep") output.item1 = { };
  if(item1_id) output.item1.id = item1_id;
  if(item1_nbt) output.item1.nbt = item1_nbt;
  if(item1_keep === "keep") output.item1.keep = true;
  if(item2_id || item2_nbt || item2_keep === "keep") output.item2 = { };
  if(item2_id) output.item2.id = item2_id;
  if(item2_nbt) output.item2.nbt = item2_nbt;
  if(item2_keep === "keep") output.item2.keep = true;
  if(item3_id || item3_nbt || item3_keep === "keep") output.item3 = { };
  if(item3_id) output.item3.id = item3_id;
  if(item3_nbt) output.item3.nbt = item3_nbt;
  if(item3_keep === "keep") output.item3.keep = true;
  if(item4_id || item4_nbt || item4_keep === "keep") output.item4 = { };
  if(item4_id) output.item4.id = item4_id;
  if(item4_nbt) output.item4.nbt = item4_nbt;
  if(item4_keep === "keep") output.item4.keep = true;
  if(item5_id || item5_nbt || item5_keep === "keep") output.item5 = { };
  if(item5_id) output.item5.id = item5_id;
  if(item5_nbt) output.item5.nbt = item5_nbt;
  if(item5_keep === "keep") output.item5.keep = true;
  if(item6_id || item6_nbt || item6_keep === "keep") output.item6 = { };
  if(item6_id) output.item6.id = item6_id;
  if(item6_nbt) output.item6.nbt = item6_nbt;
  if(item6_keep === "keep") output.item6.keep = true;
  if(item7_id || item7_nbt || item7_keep === "keep") output.item7 = { };
  if(item7_id) output.item7.id = item7_id;
  if(item7_nbt) output.item7.nbt = item7_nbt;
  if(item7_keep === "keep") output.item7.keep = true;
  if(item8_id || item8_nbt || item8_keep === "keep") output.item8 = { };
  if(item8_id) output.item8.id = item8_id;
  if(item8_nbt) output.item8.nbt = item8_nbt;
  if(item8_keep === "keep") output.item8.keep = true;
  if(item9_id || item9_nbt || item9_keep === "keep") output.item9 = { };
  if(item9_id) output.item9.id = item9_id;
  if(item9_nbt) output.item9.nbt = item9_nbt;
  if(item9_keep === "keep") output.item9.keep = true;
  if(item10_id || item10_nbt || item10_keep === "keep") output.item10 = { };
  if(item10_id) output.item10.id = item10_id;
  if(item10_nbt) output.item10.nbt = item10_nbt;
  if(item10_keep === "keep") output.item10.keep = true;
  if(item11_id || item11_nbt || item11_keep === "keep") output.item11 = { };
  if(item11_id) output.item11.id = item11_id;
  if(item11_nbt) output.item11.nbt = item11_nbt;
  if(item11_keep === "keep") output.item11.keep = true;

  if(itemout0_id || itemout0_nbt || (itemout0_count != "1" && itemout0_count != "")) output.itemout0 = { };
  if(itemout0_id) output.itemout0.id = itemout0_id;
  if(itemout0_nbt) output.itemout0.nbt = itemout0_nbt;
  if(itemout0_count != "1" && itemout0_count != "") output.itemout0.count = itemout0_count;
  if(itemout1_id || itemout1_nbt || (itemout1_count != "1" && itemout1_count != "")) output.itemout1 = { };
  if(itemout1_id) output.itemout1.id = itemout1_id;
  if(itemout1_nbt) output.itemout1.nbt = itemout1_nbt;
  if(itemout1_count != "1" && itemout1_count != "") output.itemout1.count = itemout1_count;
  if(itemout2_id || itemout2_nbt || (itemout2_count != "1" && itemout2_count != "")) output.itemout2 = { };
  if(itemout2_id) output.itemout2.id = itemout2_id;
  if(itemout2_nbt) output.itemout2.nbt = itemout2_nbt;
  if(itemout2_count != "1" && itemout2_count != "") output.itemout2.count = itemout2_count;

  if(commandsInit) output.commandsInit = commandsInit.split('\n');
  if(commandsCraft) output.commandsCraft = commandsCraft.split('\n');
  if(commandsCancel) output.commandsCancel = commandsCancel.split('\n');

  return output;
  //{txtMainPath:txtMainPath,txtFunctionPath:txtFunctionPath,txtRecipeId:txtRecipeId,item0:{id:item0_id.value,nbt:item0_nbt.value},item1:{id:item1_id.value,nbt:item1_nbt.value},item2:{id:item2_id.value,nbt:item2_nbt.value},item3:{id:item3_id.value,nbt:item3_nbt.value},item4:{id:item4_id.value,nbt:item4_nbt.value},item5:{id:item5_id.value,nbt:item5_nbt.value},item6:{id:item6_id.value,nbt:item6_nbt.value},item7:{id:item7_id.value,nbt:item7_nbt.value},item8:{id:item8_id.value,nbt:item8_nbt.value},item9:{id:item9_id.value,nbt:item9_nbt.value},item10:{id:item10_id.value,nbt:item10_nbt.value},item11:{id:item11_id.value,nbt:item11_nbt.value},output0:{id:itemout0_id.value,nbt:itemout0_nbt.value,count:itemout0_count.value},output1:{id:itemout1_id.value,nbt:itemout1_nbt.value,count:itemout1_count.value},output2:{id:itemout2_id.value,nbt:itemout2_nbt.value,count:itemout2_count.value}};


}

const inputs = Array.from(document.querySelectorAll('.container_items input[type=text]:not(.sweet-alert), .container_items input[type=number], .paths_input input, .container_items select, #custom-commands-container textarea')).filter(e => e.offsetParent.id !== "save-container");
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('change', changedInputs)
}

function changedInputs() {
  localStorage.setItem('current-recipe', JSON.stringify(recipeToJson()));
}

document.querySelector('#button_export').addEventListener('click', () => {

  var txtRecipeId = document.getElementById("receipe_id").value;

  if(txtRecipeId == '') {
    swal({   title: "Export failed",
      text: "To export you have to set a recipe ID",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true});
      console.log('export failed');
      return
  }

  console.log('exportRecipe()');
  let output = recipeToJson();
  sendInfo('Export&value2=' + JSON.stringify(output))
  console.log('Export output: ' + JSON.stringify(output));
  download(txtRecipeId + '-recipe_export.txt', JSON.stringify(output));
});

document.querySelector('#button_export_saved').addEventListener('click', () => {
  if(JSON.parse(localStorage.getItem('saved-recipes')).length < 1) {
    swal({   title: "Export failed",
      text: "To export you have to at least save one recipe",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true});
      console.log('export failed');
      return
    }
    const date = new Date();
    download(`saved-recipes-export-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}--${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`, localStorage.getItem('saved-recipes'))
});

function overrideDefault(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

// function dropFiles(ev) {
  // console.log('dropFiles()');
  // let droppedFiles = ev.dataTransfer.files;
  // let fileInput= droppedFiles[0];
  // if(droppedFiles[0].type != 'text/plain' || (/.+?\-recipe_export.txt/.test(droppedFiles[0].name) == false) && ev.shiftKey == false) {return}
  // console.log(ev.dataTransfer.files[0]);
  // var reader = new FileReader();
  // reader.onload = function() {
  // console.log(reader.result)
  // }
  // reader.readAsText(fileInput)
// }

/*
let input = document.getElementById('input_file')
input.addEventListener('change', function(e) {
  var reader = new FileReader();
  reader.onload = function() {
    console.log(reader.result)
  }
  reader.readAsText(input.files[0])
},false);
*/

function generateMcscript() {
  console.log('generateMcscript()');

  let items = Array.from(document.querySelectorAll('#item_0_id, #item_0_nbt, #item_1_id, #item_1_nbt, #item_2_id, #item_2_nbt, #item_3_id, #item_3_nbt, #item_4_id, #item_4_nbt, #item_5_id, #item_5_nbt, #item_6_id, #item_6_nbt, #item_7_id, #item_7_nbt, #item_8_id, #item_8_nbt, #item_9_id, #item_9_nbt, #item_10_id, #item_10_nbt, #item_11_id, #item_11_nbt'));
  let outputs = Array.from(document.querySelectorAll('#output_item_0_id, #output_item_0_nbt, #output_item_1_id, #output_item_1_nbt, #output_item_2_id, #output_item_2_nbt'));
  let otherRequiredInputs = Array.from(document.querySelectorAll('#main_path, #function_path, #receipe_id'));
  if(!(items.some(e => e.value != '') && outputs.some(e => e.value != '') && otherRequiredInputs.every(e => e.value != ''))) {
    swal({
      title: "Error!",
      text: "You have to set at least one input item, one output item, the main path, the function path and the recipe ID",
      type: "error",
      showCancelButton: false,
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "Ok",
      closeOnConfirm: true,
      closeOnCancel: true});
    return;
  }
  // document.getElementById("output_mcscript").style.visibility = "visible";
  // document.getElementById("output_mcscript").style.height = "225px";
  // document.getElementById("output_mcscript").style.marginTop = "20px";
  // document.getElementById("output_mcscript").style.border = "black 2px solid";
  // document.getElementById("output_mcfunction").style.visibility = "hidden";
  // document.getElementById("output_mcfunction").style.height = "0px";
  // document.getElementById("output_mcfunction").style.marginTop = "0px";
  // document.getElementById("output_mcfunction").style.border = "none";

  // document.getElementById("output_mcscript").hidden = false;
  // document.getElementById("output_mcfunction").hidden = true;
  // document.getElementById("output_mcfunction").style.border = "none";
  // document.getElementById("output_mcfunction_0").hidden = true;
  // document.getElementById("output_mcfunction_1").hidden = true;
  // document.getElementById("output_mcfunction_2").hidden = true;
  // document.getElementById("output_mcfunction_3").hidden = true;
  document.getElementById("output_mcscript").classList.remove('hidden');
  document.getElementById("output_mcfunction").classList.add('hidden');

  var item0_id = document.getElementById('item_0_id');
  var item0_nbt = document.getElementById('item_0_nbt');
  var item0_keep = document.getElementById('item_0_keep');
  var item1_id = document.getElementById('item_1_id');
  var item1_nbt = document.getElementById('item_1_nbt');
  var item1_keep = document.getElementById('item_1_keep');
  var item2_id = document.getElementById('item_2_id');
  var item2_nbt = document.getElementById('item_2_nbt');
  var item2_keep = document.getElementById('item_2_keep');
  var item3_id = document.getElementById('item_3_id');
  var item3_nbt = document.getElementById('item_3_nbt');
  var item3_keep = document.getElementById('item_3_keep');
  var item4_id = document.getElementById('item_4_id');
  var item4_nbt = document.getElementById('item_4_nbt');
  var item4_keep = document.getElementById('item_4_keep');
  var item5_id = document.getElementById('item_5_id');
  var item5_nbt = document.getElementById('item_5_nbt');
  var item5_keep = document.getElementById('item_5_keep');
  var item6_id = document.getElementById('item_6_id');
  var item6_nbt = document.getElementById('item_6_nbt');
  var item6_keep = document.getElementById('item_6_keep');
  var item7_id = document.getElementById('item_7_id');
  var item7_nbt = document.getElementById('item_7_nbt');
  var item7_keep = document.getElementById('item_7_keep');
  var item8_id = document.getElementById('item_8_id');
  var item8_nbt = document.getElementById('item_8_nbt');
  var item8_keep = document.getElementById('item_8_keep');
  var item9_id = document.getElementById('item_9_id');
  var item9_nbt = document.getElementById('item_9_nbt');
  var item9_keep = document.getElementById('item_9_keep');
  var item10_id = document.getElementById('item_10_id');
  var item10_nbt = document.getElementById('item_10_nbt');
  var item10_keep = document.getElementById('item_10_keep');
  var item11_id = document.getElementById('item_11_id');
  var item11_nbt = document.getElementById('item_11_nbt');
  var item11_keep = document.getElementById('item_11_keep');

  var itemout0_id = document.getElementById('output_item_0_id');
  var itemout0_nbt = document.getElementById('output_item_0_nbt');
  var itemout0_count = document.getElementById('output_item_0_count');
  var itemout1_id = document.getElementById('output_item_1_id');
  var itemout1_nbt = document.getElementById('output_item_1_nbt');
  var itemout1_count = document.getElementById('output_item_1_count');
  var itemout2_id = document.getElementById('output_item_2_id');
  var itemout2_nbt = document.getElementById('output_item_2_nbt');
  var itemout2_count = document.getElementById('output_item_2_count');

  var txtMainPath = document.getElementById("main_path").value;
  var txtFunctionPath = document.getElementById("function_path").value;
  var txtRecipeId = document.getElementById("receipe_id").value;

  var commandsInit = document.getElementById("commands_init").value.split('\n')[0] != '' ? '/' + document.getElementById("commands_init").value.split('\n').join('&#13;&#10;/') + '&#13;&#10;' : '';
  var commandsCraft = document.getElementById("commands_craft").value.split('\n')[0] != '' ? '/' + document.getElementById("commands_craft").value.split('\n').join('&#13;&#10;/') + '&#13;&#10;' : '';
  var commandsCancel = document.getElementById("commands_cancel").value.split('\n')[0] != '' ? '/' + document.getElementById("commands_cancel").value.split('\n').join('&#13;&#10;/') + '&#13;&#10;' : '';


 Item0 = "";
 Item0I = "";
 Item1 = "";
 Item1I = "";
 Item2 = "";
 Item2I = "";
 Item3 = "";
 Item3I = "";
 Item4 = "";
 Item4I = "";
 Item5 = "";
 Item5I = "";
 Item6 = "";
 Item6I = "";
 Item7 = "";
 Item7I = "";
 Item8 = "";
 Item8I = "";
 Item9 = "";
 Item9I = "";
 Item10 = "";
 Item10I = "";
 Item11 = "";
 Item11I = "";

  if (item0_id.value != "")
    {
        Item0 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b,id:\"" + item0_id.value + "\",tag:{" + item0_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item0I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b,id:\"" + item0_id.value + "\",tag:{" + item0_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item0 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b}]}'";
        Item0I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b}]}'";
    }
    if (item1_id.value != "")
    {
        Item1 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b,id:\"" + item1_id.value + "\",tag:{" + item1_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item1I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b,id:\"" + item1_id.value + "\",tag:{" + item1_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item1 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b}]}'";
        Item1I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b}]}'";
    }
    if (item2_id.value != "")
    {
        Item2 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b,id:\"" + item2_id.value + "\",tag:{" + item2_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item2I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b,id:\"" + item2_id.value + "\",tag:{" + item2_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item2 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b}]}'";
        Item2I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b}]}'";
    }
    if (item3_id.value != "")
    {
        Item3 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b,id:\"" + item3_id.value + "\",tag:{" + item3_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item3I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b,id:\"" + item3_id.value + "\",tag:{" + item3_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item3 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b}]}'";
        Item3I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b}]}'";
    }
    if (item4_id.value != "")
    {
        Item4 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b,id:\"" + item4_id.value + "\",tag:{" + item4_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item4I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b,id:\"" + item4_id.value + "\",tag:{" + item4_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item4 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b}]}'";
        Item4I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b}]}'";
    }
    if (item5_id.value != "")
    {
        Item5 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b,id:\"" + item5_id.value + "\",tag:{" + item5_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item5I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b,id:\"" + item5_id.value + "\",tag:{" + item5_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item5 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b}]}'";
        Item5I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b}]}'";
    }
    if (item6_id.value != "")
    {
        Item6 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b,id:\"" + item6_id.value + "\",tag:{" + item6_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item6I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b,id:\"" + item6_id.value + "\",tag:{" + item6_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item6 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b}]}'";
        Item6I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b}]}'";
    }
    if (item7_id.value != "")
    {
        Item7 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b,id:\"" + item7_id.value + "\",tag:{" + item7_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item7I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b,id:\"" + item7_id.value + "\",tag:{" + item7_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item7 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b}]}'";
        Item7I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b}]}'";
    }
    if (item8_id.value != "")
    {
        Item8 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b,id:\"" + item8_id.value + "\",tag:{" + item8_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item8I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b,id:\"" + item8_id.value + "\",tag:{" + item8_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item8 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b}]}'";
        Item8I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b}]}'";
    }
    if (item9_id.value != "")
    {
        Item9 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b,id:\"" + item9_id.value + "\",tag:{" + item9_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item9I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b,id:\"" + item9_id.value + "\",tag:{" + item9_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item9 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b}]}'";
        Item9I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b}]}'";
    }
    if (item10_id.value != "")
    {
        Item10 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b,id:\"" + item10_id.value + "\",tag:{" + item10_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item10I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b,id:\"" + item10_id.value + "\",tag:{" + item10_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item10 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b}]}'";
        Item10I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b}]}'";
    }
    if (item11_id.value != "")
    {
        Item11 = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
        Item11I = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}'";
    }
    else
    {
        Item11 = "!'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]}'";
        Item11I = "'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]}'";
    }

    let keepItems1 = '';
    let keepItems2 = '';

    if(item0_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_0&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_0&#13;&#10;'
    }
    if(item1_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_1&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_1&#13;&#10;'
    }
    if(item2_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_2&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_2&#13;&#10;'
    }
    if(item3_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_3&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_3&#13;&#10;'
    }
    if(item4_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_4&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_4&#13;&#10;'
    }
    if(item5_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_5&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_5&#13;&#10;'
    }
    if(item6_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_6&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_6&#13;&#10;'
    }
    if(item7_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_7&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_7&#13;&#10;'
    }
    if(item8_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_8&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_8&#13;&#10;'
    }
    if(item9_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_9&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_9&#13;&#10;'
    }
    if(item10_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_10&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_10&#13;&#10;'
    }
    if(item11_keep.value === "keep") {
      keepItems1 += '/tag @s add ac_lib_keep_11&#13;&#10;'
      keepItems2 += '/tag @s remove ac_lib_keep_11&#13;&#10;'
    }

    var ItemOutNbtMain = "";
    if (itemout1_nbt.value != "")
    {
        ItemOutNbtMain = ",tag:{" + itemout1_nbt.value + "}";
    }
    var ItemOutNbtUp = "";
    if (itemout0_nbt.value != "")
    {
        ItemOutNbtUp = ",tag:{" + itemout0_nbt.value + "}";
    }
    var ItemOutNbtDown = "";
    if (itemout2_nbt.value != "")
    {
        ItemOutNbtDown = ",tag:{" + itemout2_nbt.value + "}";
    }

    var outputreplaceitemUp = "";
    var itemOutUpClearCmd = "";
    if (itemout0_id.value != "")
    {
        outputreplaceitemUp = "/replaceitem block ~ ~ ~ container.7 " + itemout0_id.value + ItemOutNbtUp.replace(",tag:", "") + " " + itemout0_count.value + "&#13;&#10;";
        itemOutUpClearCmd = "/replaceitem block ~ ~ ~ container.7 minecraft:air&#13;&#10;";
    }
    var outputreplaceitemMain = "";
    var itemOutMainClearCmd = "";
    if (itemout1_id.value != "")
    {
        outputreplaceitemMain = "/replaceitem block ~ ~ ~ container.16 " + itemout1_id.value + ItemOutNbtMain.replace(",tag:", "") + " " + itemout1_count.value + "&#13;&#10;";
        itemOutMainClearCmd = "/replaceitem block ~ ~ ~ container.16 minecraft:air&#13;&#10;";
    }
    var outputreplaceitemDown = "";
    var itemOutDownClearCmd = "";
    if (itemout2_id.value != "")
    {
        outputreplaceitemDown = "/replaceitem block ~ ~ ~ container.25 " + itemout2_id.value + ItemOutNbtDown.replace(",tag:", "") + " " + itemout2_count.value + "&#13;&#10;";
        itemOutDownClearCmd = "/replaceitem block ~ ~ ~ container.25 minecraft:air&#13;&#10;";
    }

    var outputUp = "";
    if(itemout0_id.value != "")
    {
        outputUp = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b,Count:" + itemout0_count.value + "b,id:\"" + itemout0_id.value + "\"" + ItemOutNbtUp.replace(/\\\"/g,"\\\\\"").replace(/'/g, "\\'") + "}]}'";
    }
    var outputMain = "";
    if (itemout1_id.value != "")
    {
        outputMain = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b,Count:" + itemout1_count.value + "b,id:\"" + itemout1_id.value + "\"" + ItemOutNbtMain.replace(/\\\"/g,"\\\\\"").replace(/'/g, "\\'") + "}]}'";
    }
    var outputDown = "";
    if (itemout2_id.value != "")
    {
        outputDown = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b,Count:" + itemout2_count.value + "b,id:\"" + itemout2_id.value + "\"" + ItemOutNbtDown.replace(/\\\"/g,"\\\\\"").replace(/'/g, "\\'") + "}]}'";
    }

  document.getElementById('output_mcscript').innerHTML = "#file: " + txtMainPath + "&#13;&#10;&#13;&#10;if('entity @s[tag=!ac_lib_advanced_crafter_crafted]' && " + Item0.replace(/,tag:{}/g,"") + " && " + Item1.replace(/,tag:{}/g,"") + " && " + Item2.replace(/,tag:{}/g,"") + " && " + Item3.replace(/,tag:{}/g,"") + " && " + Item4.replace(/,tag:{}/g,"") + " && " + Item5.replace(/,tag:{}/g,"") + " && " + Item6.replace(/,tag:{}/g,"") + " && " + Item7.replace(/,tag:{}/g,"") + " && " + Item8.replace(/,tag:{}/g,"") + " && " + Item9.replace(/,tag:{}/g,"") + " && " + Item10.replace(/,tag:{}/g,"") + " && " + Item11.replace(/,tag:{}/g,"") + " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b}]}' && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b}]}' && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b}]}') {&#13;&#10;  /function " + txtFunctionPath + "/1&#13;&#10;}&#13;&#10;if('entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "]' && " + Item0.replace(/,tag:{}/g,"") + " && " + Item1.replace(/,tag:{}/g,"") + " && " + Item2.replace(/,tag:{}/g,"") + " && " + Item3.replace(/,tag:{}/g,"") + " && " + Item4.replace(/,tag:{}/g,"") + " && " + Item5.replace(/,tag:{}/g,"") + " && " + Item6.replace(/,tag:{}/g,"") + " && " + Item7.replace(/,tag:{}/g,"") + " && " + Item8.replace(/,tag:{}/g,"") + " && " + Item9.replace(/,tag:{}/g,"") + " && " + Item10.replace(/,tag:{}/g,"") + " && " + Item11.replace(/,tag:{}/g,"") + outputUp + outputMain + outputDown + ") {&#13;&#10;  /function " + txtFunctionPath + "/2&#13;&#10;}&#13;&#10;if('entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "]' && 'block ~ ~ ~ minecraft:gray_shulker_box') {&#13;&#10;  if(" + Item0I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item1I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item2I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item3I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item4I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item5I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item6I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item7I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item8I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item9I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item10I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;  if(" + Item11I.replace(/,tag:{}/g,"") + ") {&#13;&#10;    /function " + txtFunctionPath + "/3&#13;&#10;  }&#13;&#10;}&#13;&#10;&#13;&#10;#file: " + txtMainPath + "/1&#13;&#10;&#13;&#10;" + outputreplaceitemUp + outputreplaceitemMain + outputreplaceitemDown + "//Add here what should happen when you put in the correct recipe&#13;&#10;" + commandsInit + keepItems1 + "/tag @s add ac_lib_advanced_crafter_crafted&#13;&#10;/tag @s add ac_lib_advanced_crafter_crafted_" + txtRecipeId + "&#13;&#10;&#13;&#10;#file: " + txtMainPath + "/2&#13;&#10;&#13;&#10;/function ac_lib:advanced_crafter/crafted&#13;&#10;//Add here what should happen when you take the output out&#13;&#10;" + commandsCraft + keepItems2 + "/tag @s remove ac_lib_advanced_crafter_crafted&#13;&#10;/tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId + "&#13;&#10;&#13;&#10;#file: " + txtMainPath + "/3&#13;&#10;&#13;&#10;" + itemOutUpClearCmd + itemOutMainClearCmd + itemOutDownClearCmd + "//Add here what should happen if you cancel the recipe&#13;&#10;" + commandsCancel + keepItems2 + "/tag @s remove ac_lib_advanced_crafter_crafted&#13;&#10;/tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  sendInfo('MCScript&value2=' + JSON.stringify(recipeToJson()));
}

function generateMcfunction() {
  console.log('generateMcfunction()');

  let items = Array.from(document.querySelectorAll('#item_0_id, #item_0_nbt, #item_1_id, #item_1_nbt, #item_2_id, #item_2_nbt, #item_3_id, #item_3_nbt, #item_4_id, #item_4_nbt, #item_5_id, #item_5_nbt, #item_6_id, #item_6_nbt, #item_7_id, #item_7_nbt, #item_8_id, #item_8_nbt, #item_9_id, #item_9_nbt, #item_10_id, #item_10_nbt, #item_11_id, #item_11_nbt'));
  let outputs = Array.from(document.querySelectorAll('#output_item_0_id, #output_item_0_nbt, #output_item_1_id, #output_item_1_nbt, #output_item_2_id, #output_item_2_nbt'));
  let otherRequiredInputs = Array.from(document.querySelectorAll('#function_path, #receipe_id'));
  if(!(items.some(e => e.value != '') && outputs.some(e => e.value != '') && otherRequiredInputs.every(e => e.value != ''))) {
    swal({
      title: "Error!",
      text: "You have to set at least one input item, one output item, the function path and the recipe ID",
      type: "error",
      showCancelButton: false,
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "Ok",
      closeOnConfirm: true,
      closeOnCancel: true});
    return;
  }

  // document.getElementById("output_mcfunction").style.visibility = "visible";
  // document.getElementById("output_mcfunction").style.height = "225px";
  // document.getElementById("output_mcfunction").style.marginTop = "20px";
  // document.getElementById("output_mcfunction").style.border = "black 2px solid";
  // document.getElementById("output_mcscript").style.visibility = "hidden";
  // document.getElementById("output_mcscript").style.height = "0px";
  // document.getElementById("output_mcscript").style.marginTop = "0px";
  // document.getElementById("output_mcscript").style.border = "none";

  // document.getElementById("output_mcfunction").hidden = false;
  // document.getElementById("output_mcfunction").style.border = "black 2px solid";
  // document.getElementById("output_mcfunction_0").hidden = false;
  // document.getElementById("output_mcfunction_1").hidden = false;
  // document.getElementById("output_mcfunction_2").hidden = false;
  // document.getElementById("output_mcfunction_3").hidden = false;
  // document.getElementById("output_mcscript").hidden = true;


  document.getElementById("output_mcscript").classList.add('hidden');
  document.getElementById("output_mcfunction").classList.remove('hidden');


  var item0_id = document.getElementById('item_0_id');
  var item0_nbt = document.getElementById('item_0_nbt');
  var item0_keep = document.getElementById('item_0_keep');
  var item1_id = document.getElementById('item_1_id');
  var item1_nbt = document.getElementById('item_1_nbt');
  var item1_keep = document.getElementById('item_1_keep');
  var item2_id = document.getElementById('item_2_id');
  var item2_nbt = document.getElementById('item_2_nbt');
  var item2_keep = document.getElementById('item_2_keep');
  var item3_id = document.getElementById('item_3_id');
  var item3_nbt = document.getElementById('item_3_nbt');
  var item3_keep = document.getElementById('item_3_keep');
  var item4_id = document.getElementById('item_4_id');
  var item4_nbt = document.getElementById('item_4_nbt');
  var item4_keep = document.getElementById('item_4_keep');
  var item5_id = document.getElementById('item_5_id');
  var item5_nbt = document.getElementById('item_5_nbt');
  var item5_keep = document.getElementById('item_5_keep');
  var item6_id = document.getElementById('item_6_id');
  var item6_nbt = document.getElementById('item_6_nbt');
  var item6_keep = document.getElementById('item_6_keep');
  var item7_id = document.getElementById('item_7_id');
  var item7_nbt = document.getElementById('item_7_nbt');
  var item7_keep = document.getElementById('item_7_keep');
  var item8_id = document.getElementById('item_8_id');
  var item8_nbt = document.getElementById('item_8_nbt');
  var item8_keep = document.getElementById('item_8_keep');
  var item9_id = document.getElementById('item_9_id');
  var item9_nbt = document.getElementById('item_9_nbt');
  var item9_keep = document.getElementById('item_9_keep');
  var item10_id = document.getElementById('item_10_id');
  var item10_nbt = document.getElementById('item_10_nbt');
  var item10_keep = document.getElementById('item_10_keep');
  var item11_id = document.getElementById('item_11_id');
  var item11_nbt = document.getElementById('item_11_nbt');
  var item11_keep = document.getElementById('item_11_keep');

  var itemout0_id = document.getElementById('output_item_0_id');
  var itemout0_nbt = document.getElementById('output_item_0_nbt');
  var itemout0_count = document.getElementById('output_item_0_count');
  var itemout1_id = document.getElementById('output_item_1_id');
  var itemout1_nbt = document.getElementById('output_item_1_nbt');
  var itemout1_count = document.getElementById('output_item_1_count');
  var itemout2_id = document.getElementById('output_item_2_id');
  var itemout2_nbt = document.getElementById('output_item_2_nbt');
  var itemout2_count = document.getElementById('output_item_2_count');

  var txtFunctionPath = document.getElementById("function_path").value;
  var txtRecipeId = document.getElementById("receipe_id").value;

  var commandsInit = document.getElementById("commands_init").value.split('\n').join('&#13;&#10;') + '&#13;&#10;';
  var commandsCraft = document.getElementById("commands_craft").value.split('\n').join('&#13;&#10;') + '&#13;&#10;';
  var commandsCancel = document.getElementById("commands_cancel").value.split('\n').join('&#13;&#10;') + '&#13;&#10;';


 Item0 = "";
 Item0I = "";
 Item1 = "";
 Item1I = "";
 Item2 = "";
 Item2I = "";
 Item3 = "";
 Item3I = "";
 Item4 = "";
 Item4I = "";
 Item5 = "";
 Item5I = "";
 Item6 = "";
 Item6I = "";
 Item7 = "";
 Item7I = "";
 Item8 = "";
 Item8I = "";
 Item9 = "";
 Item9I = "";
 Item10 = "";
 Item10I = "";
 Item11 = "";
 Item11I = "";

  if (item0_id.value != "")
    {
        Item0 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b,id:\"" + item0_id.value + "\",tag:{" + item0_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item0I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b,id:\"" + item0_id.value + "\",tag:{" + item0_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item0 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b}]} ";
        Item0I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:1b}]} ";
    }
    if (item1_id.value != "")
    {
        Item1 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b,id:\"" + item1_id.value + "\",tag:{" + item1_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item1I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b,id:\"" + item1_id.value + "\",tag:{" + item1_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item1 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b}]} ";
        Item1I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:2b}]} ";
    }
    if (item2_id.value != "")
    {
        Item2 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b,id:\"" + item2_id.value + "\",tag:{" + item2_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item2I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b,id:\"" + item2_id.value + "\",tag:{" + item2_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item2 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b}]} ";
        Item2I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:3b}]} ";
    }
    if (item3_id.value != "")
    {
        Item3 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b,id:\"" + item3_id.value + "\",tag:{" + item3_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item3I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b,id:\"" + item3_id.value + "\",tag:{" + item3_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item3 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b}]} ";
        Item3I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:10b}]} ";
    }
    if (item4_id.value != "")
    {
        Item4 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b,id:\"" + item4_id.value + "\",tag:{" + item4_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item4I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b,id:\"" + item4_id.value + "\",tag:{" + item4_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item4 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b}]} ";
        Item4I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:11b}]} ";
    }
    if (item5_id.value != "")
    {
        Item5 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b,id:\"" + item5_id.value + "\",tag:{" + item5_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item5I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b,id:\"" + item5_id.value + "\",tag:{" + item5_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item5 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b}]} ";
        Item5I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:12b}]} ";
    }
    if (item6_id.value != "")
    {
        Item6 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b,id:\"" + item6_id.value + "\",tag:{" + item6_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item6I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b,id:\"" + item6_id.value + "\",tag:{" + item6_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item6 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b}]} ";
        Item6I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:19b}]} ";
    }
    if (item7_id.value != "")
    {
        Item7 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b,id:\"" + item7_id.value + "\",tag:{" + item7_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item7I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b,id:\"" + item7_id.value + "\",tag:{" + item7_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item7 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b}]} ";
        Item7I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:20b}]} ";
    }
    if (item8_id.value != "")
    {
        Item8 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b,id:\"" + item8_id.value + "\",tag:{" + item8_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item8I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b,id:\"" + item8_id.value + "\",tag:{" + item8_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item8 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b}]} ";
        Item8I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:21b}]} ";
    }
    if (item9_id.value != "")
    {
        Item9 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b,id:\"" + item9_id.value + "\",tag:{" + item9_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item9I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b,id:\"" + item9_id.value + "\",tag:{" + item9_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item9 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b}]} ";
        Item9I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:5b}]} ";
    }
    if (item10_id.value != "")
    {
        Item10 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b,id:\"" + item10_id.value + "\",tag:{" + item10_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item10I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b,id:\"" + item10_id.value + "\",tag:{" + item10_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item10 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b}]} ";
        Item10I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:14b}]} ";
    }
    if (item11_id.value != "")
    {
        Item11 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
        Item11I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]} ";
    }
    else
    {
        Item11 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]} ";
        Item11I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]} ";
    }

    let keepItems1 = '';
    let keepItems2 = '';

    if(item0_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_0&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_0&#13;&#10;'
    }
    if(item1_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_1&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_1&#13;&#10;'
    }
    if(item2_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_2&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_2&#13;&#10;'
    }
    if(item3_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_3&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_3&#13;&#10;'
    }
    if(item4_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_4&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_4&#13;&#10;'
    }
    if(item5_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_5&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_5&#13;&#10;'
    }
    if(item6_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_6&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_6&#13;&#10;'
    }
    if(item7_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_7&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_7&#13;&#10;'
    }
    if(item8_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_8&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_8&#13;&#10;'
    }
    if(item9_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_9&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_9&#13;&#10;'
    }
    if(item10_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_10&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_10&#13;&#10;'
    }
    if(item11_keep.value === "keep") {
      keepItems1 += 'tag @s add ac_lib_keep_11&#13;&#10;'
      keepItems2 += 'tag @s remove ac_lib_keep_11&#13;&#10;'
    }

    var ItemOutNbtMain = "";
    if (itemout1_nbt.value != "")
    {
        ItemOutNbtMain = ",tag:{" + itemout1_nbt.value + "}";
    }
    var ItemOutNbtUp = "";
    if (itemout0_nbt.value != "")
    {
        ItemOutNbtUp = ",tag:{" + itemout0_nbt.value + "}";
    }
    var ItemOutNbtDown = "";
    if (itemout2_nbt.value != "")
    {
        ItemOutNbtDown = ",tag:{" + itemout2_nbt.value + "}";
    }

    var outputreplaceitemUp = "";
    var itemOutUpClearCmd = "";
    if (itemout0_id.value != "")
    {
        outputreplaceitemUp = "replaceitem block ~ ~ ~ container.7 " + itemout0_id.value + ItemOutNbtUp.replace(",tag:", "") + " " + itemout0_count.value + "&#13;&#10;";
        itemOutUpClearCmd = "replaceitem block ~ ~ ~ container.7 minecraft:air&#13;&#10;";
    }
    var outputreplaceitemMain = "";
    var itemOutMainClearCmd = "";
    if (itemout1_id.value != "")
    {
        outputreplaceitemMain = "replaceitem block ~ ~ ~ container.16 " + itemout1_id.value + ItemOutNbtMain.replace(",tag:", "") + " " + itemout1_count.value + "&#13;&#10;";
        itemOutMainClearCmd = "replaceitem block ~ ~ ~ container.16 minecraft:air&#13;&#10;";
    }
    var outputreplaceitemDown = "";
    var itemOutDownClearCmd = "";
    if (itemout2_id.value != "")
    {
        outputreplaceitemDown = "replaceitem block ~ ~ ~ container.25 " + itemout2_id.value + ItemOutNbtDown.replace(",tag:", "") + " " + itemout2_count.value + "&#13;&#10;";
        itemOutDownClearCmd = "replaceitem block ~ ~ ~ container.7 minecraft:air&#13;&#10;";
    }

    var outputUp = "";
    if(itemout0_id.value != "")
    {
        outputUp = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b,Count:" + itemout0_count.value + "b,id:\"" + itemout0_id.value + "\"" + ItemOutNbtUp.replace(/\\\"/g,"\\\\\"") + "}]}";
    }
    var outputMain = "";
    if (itemout1_id.value != "")
    {
        outputMain = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b,Count:" + itemout1_count.value + "b,id:\"" + itemout1_id.value + "\"" + ItemOutNbtMain.replace(/\\\"/g,"\\\\\"") + "}]}";
    }
    var outputDown = "";
    if (itemout2_id.value != "")
    {
        outputDown = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b,Count:" + itemout2_count.value + "b,id:\"" + itemout2_id.value + "\"" + ItemOutNbtDown.replace(/\\\"/g,"\\\\\"") + "}]}";
    }

  document.getElementById('output_mcfunction_0').innerHTML = "execute if entity @s[tag=!ac_lib_advanced_crafter_crafted] " + Item0.replace(/,tag:{}/g,"") + Item1.replace(/,tag:{}/g,"") + Item2.replace(/,tag:{}/g,"") + Item3.replace(/,tag:{}/g,"") + Item4.replace(/,tag:{}/g,"") + Item5.replace(/,tag:{}/g,"") + Item6.replace(/,tag:{}/g,"") + Item7.replace(/,tag:{}/g,"") + Item8.replace(/,tag:{}/g,"") + Item9.replace(/,tag:{}/g,"") + Item10.replace(/,tag:{}/g,"") + Item11.replace(/,tag:{}/g,"") + "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b}]} unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b}]} unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b}]} run function " + txtFunctionPath + "/1&#13;&#10;&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] " + Item0.replace(/,tag:{}/g,"") + Item1.replace(/,tag:{}/g,"") + Item2.replace(/,tag:{}/g,"") + Item3.replace(/,tag:{}/g,"") + Item4.replace(/,tag:{}/g,"") + Item5.replace(/,tag:{}/g,"") + Item6.replace(/,tag:{}/g,"") + Item7.replace(/,tag:{}/g,"") + Item8.replace(/,tag:{}/g,"") + Item9.replace(/,tag:{}/g,"") + Item10.replace(/,tag:{}/g,"") + Item11.replace(/,tag:{}/g,"") + outputUp + outputMain + outputDown + " run function " + txtFunctionPath + "/2&#13;&#10;&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item0I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item1I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item2I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item3I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item4I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item5I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item6I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item7I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item8I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item9I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item10I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3&#13;&#10;execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item11I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3";
  document.getElementById('output_mcfunction_1').innerHTML = outputreplaceitemUp + outputreplaceitemMain + outputreplaceitemDown + "#Add here what should happen when you put in the correct recipe&#13;&#10;" + commandsInit + keepItems1 + "tag @s add ac_lib_advanced_crafter_crafted&#13;&#10;tag @s add ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  document.getElementById('output_mcfunction_2').innerHTML = "function ac_lib:advanced_crafter/crafted&#13;&#10;#Add here what should happen when you take the output out&#13;&#10;" + commandsCraft + keepItems2 + "tag @s remove ac_lib_advanced_crafter_crafted&#13;&#10;tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  document.getElementById('output_mcfunction_3').innerHTML = itemOutUpClearCmd + itemOutMainClearCmd + itemOutDownClearCmd + "#Add here what should happen when you cancel the recipe&#13;&#10;" + commandsCancel + keepItems2 + "tag @s remove ac_lib_advanced_crafter_crafted&#13;&#10;tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  sendInfo('MCFunction&value2=' + JSON.stringify(recipeToJson()))
}

function sendInfo(method) {
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedAclibGenerator/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + method, true)
    sendInfo.send();
  }
}

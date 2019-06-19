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
function helpExport(){
  console.log('helpExport()');
	swal({   title: "Exporting Recipes",
    text: "When you click export, there will be a file download which contains the recipe. \nDrag & Drop the file to import.",
    type: "info",
    confirmButtonColor: "#4C36EC",
    confirmButtonText: "OK",
    closeOnConfirm: true
  });
}

function reset() {
  console.log('reset()');
  document.getElementById('item_0_id').value = "";
  document.getElementById('item_0_nbt').value = "";
  document.getElementById('item_1_id').value = "";
  document.getElementById('item_1_nbt').value = "";
  document.getElementById('item_2_id').value = "";
  document.getElementById('item_2_nbt').value = "";
  document.getElementById('item_3_id').value = "";
  document.getElementById('item_3_nbt').value = "";
  document.getElementById('item_4_id').value = "";
  document.getElementById('item_4_nbt').value = "";
  document.getElementById('item_5_id').value = "";
  document.getElementById('item_5_nbt').value = "";
  document.getElementById('item_6_id').value = "";
  document.getElementById('item_6_nbt').value = "";
  document.getElementById('item_7_id').value = "";
  document.getElementById('item_7_nbt').value = "";
  document.getElementById('item_8_id').value = "";
  document.getElementById('item_8_nbt').value = "";
  document.getElementById('item_9_id').value = "";
  document.getElementById('item_9_nbt').value = "";
  document.getElementById('item_10_id').value = "";
  document.getElementById('item_10_nbt').value = "";
  document.getElementById('item_11_id').value = "";
  document.getElementById('item_11_nbt').value = "";

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
}


function generateInit() {
  console.log('generateInit()');
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
}
function dragOver() {
  swal({   title: "Importing...",
    text: "Import a recipe",
    type: "info",
    confirmButtonColor: "#ccc",
    confirmButtonText: "cancel",
    closeOnConfirm: true});
}
function exportRecipe() {
  console.log('exportRecipe()');
  generateInit();
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

  var txtMainPath = document.getElementById("main_path").value;
  var txtFunctionPath = document.getElementById("function_path").value;
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

  var output = {txtMainPath:txtMainPath,txtFunctionPath:txtFunctionPath,txtRecipeId:txtRecipeId,item0:{id:item0_id.value,nbt:item0_nbt.value},item1:{id:item1_id.value,nbt:item1_nbt.value},item2:{id:item2_id.value,nbt:item2_nbt.value},item3:{id:item3_id.value,nbt:item3_nbt.value},item4:{id:item4_id.value,nbt:item4_nbt.value},item5:{id:item5_id.value,nbt:item5_nbt.value},item6:{id:item6_id.value,nbt:item6_nbt.value},item7:{id:item7_id.value,nbt:item7_nbt.value},item8:{id:item8_id.value,nbt:item8_nbt.value},item9:{id:item9_id.value,nbt:item9_nbt.value},item10:{id:item10_id.value,nbt:item10_nbt.value},item11:{id:item11_id.value,nbt:item11_nbt.value},output0:{id:itemout0_id.value,nbt:itemout0_nbt.value,count:itemout0_count.value},output1:{id:itemout1_id.value,nbt:itemout1_nbt.value,count:itemout1_count.value},output2:{id:itemout2_id.value,nbt:itemout2_nbt.value,count:itemout2_count.value}};

  console.log('Export output: ' + JSON.stringify(output));
  download(txtRecipeId + '-recipe_export.txt', JSON.stringify(output))
}

function overrideDefault(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

function dropFiles(ev) {
  console.log('dropFiles()');
  let droppedFiles = ev.dataTransfer.files;
  let fileInput= droppedFiles[0];
  if(droppedFiles[0].type != 'text/plain' || (/.+?\-recipe_export.txt/.test(droppedFiles[0].name) == false) && ev.shiftKey == false) {return}
  console.log(ev.dataTransfer.files[0]);
  // var reader = new FileReader();
  // reader.onload = function() {
  // console.log(reader.result)
  // }
  // reader.readAsText(fileInput)
}

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
  generateInit();
  // document.getElementById("output_mcscript").style.visibility = "visible";
  // document.getElementById("output_mcscript").style.height = "225px";
  // document.getElementById("output_mcscript").style.marginTop = "20px";
  // document.getElementById("output_mcscript").style.border = "black 2px solid";
  // document.getElementById("output_mcfunction").style.visibility = "hidden";
  // document.getElementById("output_mcfunction").style.height = "0px";
  // document.getElementById("output_mcfunction").style.marginTop = "0px";
  // document.getElementById("output_mcfunction").style.border = "none";

  document.getElementById("output_mcscript").hidden = false;
  document.getElementById("output_mcfunction").hidden = true;
  document.getElementById("output_mcfunction").style.border = "none";
  document.getElementById("output_mcfunction_0").hidden = true;
  document.getElementById("output_mcfunction_1").hidden = true;
  document.getElementById("output_mcfunction_2").hidden = true;
  document.getElementById("output_mcfunction_3").hidden = true;

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

  var txtMainPath = document.getElementById("main_path").value;
  var txtFunctionPath = document.getElementById("function_path").value;
  var txtRecipeId = document.getElementById("receipe_id").value;


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
    if (itemout0_id.value != "")
    {
        outputreplaceitemUp = "/replaceitem block ~ ~ ~ container.7 " + itemout0_id.value + ItemOutNbtUp.replace(",tag:", "") + " " + itemout0_count.value + "<br>";
    }
    var outputreplaceitemMain = "";
    if (itemout1_id.value != "")
    {
        outputreplaceitemMain = "/replaceitem block ~ ~ ~ container.16 " + itemout1_id.value + ItemOutNbtMain.replace(",tag:", "") + " " + itemout1_count.value + "<br>";
    }
    var outputreplaceitemDown = "";
    if (itemout2_id.value != "")
    {
        outputreplaceitemDown = "/replaceitem block ~ ~ ~ container.25 " + itemout2_id.value + ItemOutNbtDown.replace(",tag:", "") + " " + itemout2_count.value + "<br>";
    }

    var outputUp = "";
    if(itemout0_id.value != "")
    {
        outputUp = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b,Count:" + itemout0_count.value + "b,id:\"" + itemout0_id.value + "\"" + ItemOutNbtUp.replace(/\\\"/g,"\\\\\"") + "}]}'";
    }
    var outputMain = "";
    if (itemout1_id.value != "")
    {
        outputMain = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b,Count:" + itemout1_count.value + "b,id:\"" + itemout1_id.value + "\"" + ItemOutNbtMain.replace(/\\\"/g,"\\\\\"") + "}]}'";
    }
    var outputDown = "";
    if (itemout2_id.value != "")
    {
        outputDown = " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b,Count:" + itemout2_count.value + "b,id:\"" + itemout2_id.value + "\"" + ItemOutNbtDown.replace(/\\\"/g,"\\\\\"") + "}]}'";
    }

  document.getElementById('output_mcscript').innerHTML = "#file: " + txtMainPath + "<br><br>if('entity @s[tag=!ac_lib_advanced_crafter_crafted]' && " + Item0.replace(/,tag:{}/g,"") + " && " + Item1.replace(/,tag:{}/g,"") + " && " + Item2.replace(/,tag:{}/g,"") + " && " + Item3.replace(/,tag:{}/g,"") + " && " + Item4.replace(/,tag:{}/g,"") + " && " + Item5.replace(/,tag:{}/g,"") + " && " + Item6.replace(/,tag:{}/g,"") + " && " + Item7.replace(/,tag:{}/g,"") + " && " + Item8.replace(/,tag:{}/g,"") + " && " + Item9.replace(/,tag:{}/g,"") + " && " + Item10.replace(/,tag:{}/g,"") + " && " + Item11.replace(/,tag:{}/g,"") + " && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b}]}' && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b}]}' && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b}]}') {<br>  /function " + txtFunctionPath + "/1<br>}<br>if('entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "]' && " + Item0.replace(/,tag:{}/g,"") + " && " + Item1.replace(/,tag:{}/g,"") + " && " + Item2.replace(/,tag:{}/g,"") + " && " + Item3.replace(/,tag:{}/g,"") + " && " + Item4.replace(/,tag:{}/g,"") + " && " + Item5.replace(/,tag:{}/g,"") + " && " + Item6.replace(/,tag:{}/g,"") + " && " + Item7.replace(/,tag:{}/g,"") + " && " + Item8.replace(/,tag:{}/g,"") + " && " + Item9.replace(/,tag:{}/g,"") + " && " + Item10.replace(/,tag:{}/g,"") + " && " + Item11.replace(/,tag:{}/g,"") + outputUp + outputMain + outputDown + ") {<br>  /function " + txtFunctionPath + "/2<br>}<br>if('entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "]' && 'block ~ ~ ~ minecraft:gray_shulker_box') {<br>  if(" + Item0I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item1I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item2I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item3I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item4I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item5I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item6I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item7I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item8I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item9I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item10I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>  if(" + Item11I.replace(/,tag:{}/g,"") + ") {<br>    /function " + txtFunctionPath + "/3<br>  }<br>}<br><br>#file: " + txtMainPath + "/1<br><br>" + outputreplaceitemUp + outputreplaceitemMain + outputreplaceitemDown + "/tag @s add ac_lib_advanced_crafter_crafted<br>/tag @s add ac_lib_advanced_crafter_crafted_" + txtRecipeId + "<br><br>#file: " + txtMainPath + "/2<br><br>/function ac_lib:advanced_crafter/crafted<br>//Add replacements here<br>/tag @s remove ac_lib_advanced_crafter_crafted<br>/tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId + "<br><br>#file: " + txtMainPath + "/3<br><br>/replaceitem block ~ ~ ~ container.7 minecraft:air<br>/replaceitem block ~ ~ ~ container.16 minecraft:air<br>/replaceitem block ~ ~ ~ container.25 minecraft:air<br>/tag @s remove ac_lib_advanced_crafter_crafted<br>/tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
}

function generateMcfunction() {
  console.log('generateMcfunction()');
  generateInit();
  // document.getElementById("output_mcfunction").style.visibility = "visible";
  // document.getElementById("output_mcfunction").style.height = "225px";
  // document.getElementById("output_mcfunction").style.marginTop = "20px";
  // document.getElementById("output_mcfunction").style.border = "black 2px solid";
  // document.getElementById("output_mcscript").style.visibility = "hidden";
  // document.getElementById("output_mcscript").style.height = "0px";
  // document.getElementById("output_mcscript").style.marginTop = "0px";
  // document.getElementById("output_mcscript").style.border = "none";

  document.getElementById("output_mcfunction").hidden = false;
  document.getElementById("output_mcfunction").style.border = "black 2px solid";
  document.getElementById("output_mcfunction_0").hidden = false;
  document.getElementById("output_mcfunction_1").hidden = false;
  document.getElementById("output_mcfunction_2").hidden = false;
  document.getElementById("output_mcfunction_3").hidden = false;
  document.getElementById("output_mcscript").hidden = true;


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

  var txtFunctionPath = document.getElementById("function_path").value;
  var txtRecipeId = document.getElementById("receipe_id").value;


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
        Item11 = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}";
        Item11I = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b,id:\"" + item11_id.value + "\",tag:{" + item11_nbt.value.replace(/\\\"/g,"\\\\\"") + "}}]}";
    }
    else
    {
        Item11 = "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]}";
        Item11I = "if block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot:23b}]}";
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
    if (itemout0_id.value != "")
    {
        outputreplaceitemUp = "replaceitem block ~ ~ ~ container.7 " + itemout0_id.value + ItemOutNbtUp.replace(",tag:", "") + " " + itemout0_count.value + "<br>";
    }
    var outputreplaceitemMain = "";
    if (itemout1_id.value != "")
    {
        outputreplaceitemMain = "replaceitem block ~ ~ ~ container.16 " + itemout1_id.value + ItemOutNbtMain.replace(",tag:", "") + " " + itemout1_count.value + "<br>";
    }
    var outputreplaceitemDown = "";
    if (itemout2_id.value != "")
    {
        outputreplaceitemDown = "replaceitem block ~ ~ ~ container.25 " + itemout2_id.value + ItemOutNbtDown.replace(",tag:", "") + " " + itemout2_count.value + "<br>";
    }

    var outputUp = "";
    if(itemout0_id.value != "")
    {
        outputUp = " unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b,Count:" + itemout0_count.value + "b,id:\"" + itemout0_id.value + "\"" + ItemOutNbtUp.replace(/\\\"/g,"\\\\\"") + "}]}";
    }
    var outputMain = "";
    if (itemout1_id.value != "")
    {
        outputMain = " unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b,Count:" + itemout1_count.value + "b,id:\"" + itemout1_id.value + "\"" + ItemOutNbtMain.replace(/\\\"/g,"\\\\\"") + "}]}";
    }
    var outputDown = "";
    if (itemout2_id.value != "")
    {
        outputDown = " unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b,Count:" + itemout2_count.value + "b,id:\"" + itemout2_id.value + "\"" + ItemOutNbtDown.replace(/\\\"/g,"\\\\\"") + "}]}";
    }

  document.getElementById('output_mcfunction_0').innerHTML = "/execute if entity @s[tag=!ac_lib_advanced_crafter_crafted] " + Item0.replace(/,tag:{}/g,"") + Item1.replace(/,tag:{}/g,"") + Item2.replace(/,tag:{}/g,"") + Item3.replace(/,tag:{}/g,"") + Item4.replace(/,tag:{}/g,"") + Item5.replace(/,tag:{}/g,"") + Item6.replace(/,tag:{}/g,"") + Item7.replace(/,tag:{}/g,"") + Item8.replace(/,tag:{}/g,"") + Item9.replace(/,tag:{}/g,"") + Item10.replace(/,tag:{}/g,"") + Item11.replace(/,tag:{}/g,"") + "unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 7b}]} unless block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 16b}]}' && !'block ~ ~ ~ minecraft:gray_shulker_box{Items:[{Slot: 25b}]} run function " + txtFunctionPath + "/1<br><br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] " + Item0.replace(/,tag:{}/g,"") + Item1.replace(/,tag:{}/g,"") + Item2.replace(/,tag:{}/g,"") + Item3.replace(/,tag:{}/g,"") + Item4.replace(/,tag:{}/g,"") + Item5.replace(/,tag:{}/g,"") + Item6.replace(/,tag:{}/g,"") + Item7.replace(/,tag:{}/g,"") + Item8.replace(/,tag:{}/g,"") + Item9.replace(/,tag:{}/g,"") + Item10.replace(/,tag:{}/g,"") + Item11.replace(/,tag:{}/g,"") + outputUp + outputMain + outputDown + " run function " + txtFunctionPath + "/2<br><br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item0I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item1I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item2I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item3I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item4I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item5I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item6I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item7I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item8I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item9I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item10I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3<br>execute if entity @s[tag=ac_lib_advanced_crafter_crafted_" + txtRecipeId + "] if block ~ ~ ~ minecraft:gray_shulker_box " + Item11I.replace(/,tag:{}/g,"") + "run function " + txtFunctionPath + "/3";
  document.getElementById('output_mcfunction_1').innerHTML = outputreplaceitemUp + outputreplaceitemMain + outputreplaceitemDown + "tag @s add ac_lib_advanced_crafter_crafted<br>tag @s add ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  document.getElementById('output_mcfunction_2').innerHTML = "function ac_lib:advanced_crafter/crafted<br>#Add replacements here<br>tag @s remove ac_lib_advanced_crafter_crafted<br>tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
  document.getElementById('output_mcfunction_3').innerHTML = "replaceitem block ~ ~ ~ container.7 minecraft:air<br>replaceitem block ~ ~ ~ container.16 minecraft:air<br>replaceitem block ~ ~ ~ container.25 minecraft:air<br>tag @s remove ac_lib_advanced_crafter_crafted<br>tag @s remove ac_lib_advanced_crafter_crafted_" + txtRecipeId;
}

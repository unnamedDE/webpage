function dropFiles(ev) {
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

  var txtMainPath = document.getElementById("main_path");
  var txtFunctionPath = document.getElementById("function_path");
  var txtRecipeId = document.getElementById("receipe_id");

  let droppedFiles = ev.dataTransfer.files;
  let fileInput= droppedFiles[0];
  if(droppedFiles[0].type != 'text/plain' || (/.+?\-recipe_export.txt/.test(droppedFiles[0].name) == false) && ev.shiftKey == false) {return}
  // console.log(ev.dataTransfer.files[0]);
  var reader = new FileReader();
  reader.onload = function() {
    let input = JSON.parse(reader.result)
    // console.log(input)
    txtMainPath.value = input.txtMainPath
    txtFunctionPath.value = input.txtFunctionPath
    txtRecipeId.value = input.txtRecipeId

    item0_id.value = input.item0.id
    item0_nbt.value = input.item0.nbt
    item1_id.value = input.item1.id
    item1_nbt.value = input.item1.nbt
    item2_id.value = input.item2.id
    item2_nbt.value = input.item2.nbt
    item3_id.value = input.item3.id
    item3_nbt.value = input.item3.nbt
    item4_id.value = input.item4.id
    item4_nbt.value = input.item4.nbt
    item5_id.value = input.item5.id
    item5_nbt.value = input.item5.nbt
    item6_id.value = input.item6.id
    item6_nbt.value = input.item6.nbt
    item7_id.value = input.item7.id
    item7_nbt.value = input.item7.nbt
    item8_id.value = input.item8.id
    item8_nbt.value = input.item8.nbt
    item9_id.value = input.item9.id
    item9_nbt.value = input.item9.nbt
    item10_id.value = input.item10.id
    item10_nbt.value = input.item10.nbt
    item11_id.value = input.item11.id
    item11_nbt.value = input.item11.nbt

    itemout0_id.value = input.output0.id
    itemout0_nbt.value = input.output0.nbt
    itemout0_count.value = input.output0.count
    itemout1_id.value = input.output1.id
    itemout1_nbt.value = input.output1.nbt
    itemout1_count.value = input.output1.count
    itemout2_id.value = input.output2.id
    itemout2_nbt.value = input.output2.nbt
    itemout2_count.value = input.output2.count
  }
  reader.readAsText(fileInput)
  swal({title: "Success",
    text: "Import successfull",
    type: "success",
    confirmButtonColor: "#4CAF50",
    confirmButtonText: "OK",
    closeOnConfirm: true});
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

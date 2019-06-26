fetch('./idlist.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    return idlist = myJson;
  });

function onChangeIdTxt() {
  const input = document.getElementById('txt_input').value;
  var output = document.getElementById('txt_output');

  output.value = convertID(input)
}

function convertID(input) {
  var input_data = input.replace(/^minecraft:/,"")
  if(idlist[input_data.replace(/ 0$/,"")] == undefined) {
    if(/.+?:.+/.test(input.replace(/ 0$/,""))) {
      return input.replace(/ 0$/,"").replace(/ $/,"");
    } else if(input != "") {
      return "minecraft:" + input.replace(/ 0$/,"").replace(/ $/,"");
    } else {
      return ""
    }
  }

  var toReturn = "minecraft:" + idlist[input_data.replace(/ 0$/,"")];
  return toReturn
}

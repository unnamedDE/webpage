window.onload = function() {
  if(getParameter('id')) {
    document.getElementById('txt_input').value = getParameter('id');
    onChangeIdTxt();
  }
}

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
  var input_data = input.replace(/^minecraft:/,"").toLowerCase()
  if(idlist[input_data.replace(/ 0$/,"")] == undefined) {
    if(/.+?:.+/.test(input.replace(/ 0$/,""))) {
      sendInfo(input + '&value2=' + input.replace(/ 0$/,"").replace(/ $/,""))
      return input.replace(/ 0$/,"").replace(/ $/,"");
    } else if(input != "") {
      sendInfo(input + '&value2=' + "minecraft:" + input.replace(/ 0$/,"").replace(/ $/,""))
      return "minecraft:" + input.replace(/ 0$/,"").replace(/ $/,"");
    } else {
      return ""
    }
  }

  var toReturn = "minecraft:" + idlist[input_data.replace(/ 0$/,"")].toLowerCase();
  sendInfo(input + '&value2=' + toReturn)
  return toReturn
}

function sendInfo(info) {
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedIdConverter/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + info, true)
    sendInfo.send();
  }
}

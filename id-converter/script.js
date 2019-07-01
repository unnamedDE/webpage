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
fetch('./idlist-num.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    return idlist_num = myJson;
  });

function onChangeIdTxt() {
  const input = document.getElementById('txt_input').value;
  var output = document.getElementById('txt_output');
  if(!(/^\d+?(:\d+?)?$/.test(input))) {
    output.value = convertID(input)
    return
  } else {
    output.value = convertNumIDtxt(input)
    return
  }

}

function convertID(input) {
  let input_data = input.replace(/^minecraft:/,"").toLowerCase()
  if(idlist[input_data.replace(/ 0$/,"")] == undefined) {
    if(/.+?:.+/.test(input.replace(/ 0$/,""))) {
      sendInfo(encodeURIComponent(input) + '&value2=' + encodeURIComponent(input.replace(/ 0$/,"").replace(/ $/,"")))
      return input.replace(/ 0$/,"").replace(/ $/,"");
    } else if(input != "") {
      sendInfo(encodeURIComponent(input) + '&value2=' + encodeURIComponent("minecraft:" + input.replace(/ 0$/,"").replace(/ $/,"")))
      return "minecraft:" + input.replace(/ 0$/,"").replace(/ $/,"");
    } else {
      return ""
    }
  }

  let toReturn = "minecraft:" + idlist[input_data.replace(/ 0$/,"")].toLowerCase();
  sendInfo(encodeURIComponent(input) + '&value2=' + encodeURIComponent(toReturn))
  return toReturn
}

function convertNumIDtxt(input) {
  let input_data = input.split(':');
  if(!(input_data[1])) {
    input_data[1] = 0;
  }
  for(i in idlist_num) {
    if(idlist_num[i].id_num == input_data[0] && idlist_num[i].meta == input_data[1]) {
      return convertNumID(idlist_num[i].id + " " + input_data[1], input)
    }
  }
}

function convertNumID(input, input_raw) {
  let input_data = input.replace(/^minecraft:/,"").toLowerCase()

  let toReturn = "minecraft:" + idlist[input_data.replace(/ 0$/,"")].toLowerCase();
  console.log(encodeURIComponent(input_raw) + '&value2=' + encodeURIComponent(toReturn));
  sendInfo(input_raw + '&value2=' + toReturn)
  return toReturn
}



function sendInfo(info) {
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedIdConverter/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + info, true)
    sendInfo.send();
  }
}

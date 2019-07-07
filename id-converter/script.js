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

  output.value = convertID(input);

}

function convertID(input_raw) {
  let input = input_raw.replace(/^minecraft:/, "").replace(/ 0$/, "").toLowerCase();
  if(/^\d+$/.test(input)) {
    for (var i = 0; i < idlist_num.length; i++) {
      if(idlist_num[i].id_num == input && idlist_num[i].meta == 0) {
        return "minecraft:" + idlist_num[i].id;
      }
    }
    swal({   title: "Error",
      text: "Can't find that ID",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return input_raw
  } else if(/^\d+? \d+$/.test(input)) {
    let input_tokens = input.split(' ');
    for (var i = 0; i < idlist_num.length; i++) {
      if(idlist_num[i].id_num == input_tokens[0] && idlist[idlist_num[i].id + " " + input_tokens[1]]) {
        if(/:/.test(input_tokens[0]))
          return idlist[idlist_num[i].id + " " + input_tokens[1]];
        else
          return "minecraft:" + idlist[idlist_num[i].id + " " + input_tokens[1]];
      }
    }
    swal({   title: "Error",
      text: "Can't find that ID\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return input_raw;
  } else if(/^\d+?:\d+$/.test(input)) {
    let input_tokens = input.split(':');
    for (var i = 0; i < idlist_num.length; i++) {
      if(idlist_num[i].id_num == input_tokens[0] && idlist[idlist_num[i].id + " " + input_tokens[1]]) {
        return "minecraft:" + idlist[idlist_num[i].id + " " + input_tokens[1]];
      }
    }
    swal({   title: "Error",
      text: "Can't find that ID\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return input_raw;
  } else if(/^\w+? \d+$/.test(input)) {
    if(idlist[input])
      return "minecraft:" + idlist[input];
    swal({   title: "Error",
      text: "Can't find that ID\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return input_raw;
  } else if(/^\w+?:\d+$/.test(input)) {
    if(idlist[input.replace(/:/, " ")])
      return "minecraft:" + idlist[input.replace(/:/, " ")];
    swal({   title: "Error",
      text: "Can't find that ID\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
      type: "error",
      confirmButtonColor: "#E12F2F",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return input_raw;
  } else if(/^\w+$/.test(input)) {
    return "minecraft:" + input.toLowerCase();
  } else
    return input_raw;
}



function sendInfo(info) {
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedIdConverter/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + info, true)
    sendInfo.send();
  }
}

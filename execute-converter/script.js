function convert(pos, tokens) {
  var converted = "execute as ";

  converted += tokens[pos + 0] + " at @s positioned " + tokens[pos + 1] + " " + tokens[pos + 2] + " " + tokens[pos + 3] + " ";

  var detect_value = 0;
  if(tokens[pos + 4] == "detect") {
    detect_value = 6
    converted += "if block " + tokens[pos + 5] + " " + tokens[pos + 6] + " " + tokens[pos + 7] + " " + tokens[pos + 8] + " ";
    if(!(/^-?\d+?$/.test(tokens[pos + 9])) && tokens[pos + 9] != "*") {
      detect_value--;
    } else if((!(tokens[pos + 9] == "0" || tokens[pos + 9] == "*" || tokens[pos + 9] == "-1"))) { //&& !(/\d*?/.test(tokens[pos + 9]))
      converted += tokens[pos + 9] + " ";
    }
  }
  converted += "run"

  tokens[pos + 4 +detect_value] = tokens[pos + 4+detect_value].replace(/^\//, "")

  if(tokens[pos+ 4 + detect_value] == "execute") {
    converted += " " + convert(pos + 5 + detect_value, tokens)
  } else {
    for(let i = pos + 4 +detect_value; i < tokens.length; i++) {
      converted += " " + tokens[i]
    }
  }
  // output.value += converted.replace(/positioned ~ ~ ~ /g, "").replace(/as @s at @s /g, "")
  // .replace(/ $/, "")

  if(detect_value == 6 && !(tokens[pos + 9] == "0" || tokens[pos + 9] == "*" || tokens[pos + 9] == "-1") && /\d*?/.test(tokens[pos + 9])) {
    var newId = convertID(tokens[pos + 8] + " " + tokens[pos + 9])
    converted = converted.replace(tokens[pos + 8] + " " + tokens[pos + 9], newId)
    /*swal({   title: "Convert block ID to 1.13 format",
      text: "Please change \"" + tokens[pos + 8] + " " + tokens[pos + 9] + "\" to the corresponding 1.13 block ID",
      type: "info",
      confirmButtonColor: "#4C36EC",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });*/
  }
  if(detect_value > 1) {
    return converted.replace(/run execute /, "").replace(tokens[pos + 8], convertID(tokens[pos + 8]));
  } else {
    return converted.replace(/run execute /, "");
  }



}



function onChangeTxt() {
  var input = document.getElementById('txt_input').value;
  var output = document.getElementById('txt_output');

  if(!(/^\/?execute/i.test(input)) && input != "") {
    swal({   title: "No execute command detected",
      text: "Please input an execute command",
      type: "error",
      confirmButtonColor: "#4C36EC",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
    return
  }

  if(/^\//.test(input)) {
    output.value = "/";
  } else {
    output.value = "";
  }

  var tokens = input.split(' ');
  tokens.splice(0, 1)


  output.value += convert(0, tokens).replace(/positioned ~ ~ ~ /g, "").replace(/as @s at @s /g, "")
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedExecuteConverter/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + encodeURIComponent(input) + '&value2=' + encodeURIComponent(convert(0, tokens).replace(/positioned ~ ~ ~ /g, "").replace(/as @s at @s /g, "")), true)
    sendInfo.send();
  }
}

fetch('../id-converter/idlist.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    return idlist = myJson;
  });
fetch('../id-converter/idlist-num.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    return idlist_num = myJson;
  });

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
      text: "Can't find the ID '" + input_raw + "'!\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
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
      text: "Can't find the ID '" + input_raw + "'!\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
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
      text: "Can't find the ID '" + input_raw + "'!\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
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
      text: "Can't find the ID '" + input_raw + "'!\nIf you're sure that '" + input_raw + "' is a valid ID please contact me",
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

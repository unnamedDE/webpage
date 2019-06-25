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

  tokens[pos + 4+detect_value] = tokens[pos + 4+detect_value].replace(/^\//, "")

  if(tokens[pos+ 4 + detect_value] == "execute") {
    converted += " " + convert(pos + 5 + detect_value, tokens)
  } else {
    for(let i = pos + 4+detect_value; i < tokens.length; i++) {
      converted += " " + tokens[i]
    }
  }
  // output.value += converted.replace(/positioned ~ ~ ~ /g, "").replace(/as @s at @s /g, "")
  // .replace(/ $/, "")

  if(detect_value == 6 && !(tokens[pos + 9] == "0" || tokens[pos + 9] == "*" || tokens[pos + 9] == "-1") && /\d*?/.test(tokens[pos + 9])) {
    swal({   title: "Convert block ID to 1.13 format",
      text: "Please change \"" + tokens[pos + 8] + " " + tokens[pos + 9] + "\" to the corresponding 1.13 block ID",
      type: "info",
      confirmButtonColor: "#4C36EC",
      confirmButtonText: "OK",
      closeOnConfirm: true
    });
  }

  return converted.replace(/run execute /, "");

}



function onChangeTxt() {
  var input = document.getElementById('txt_input').value;
  var output = document.getElementById('txt_output');

  if(!(/^\/?execute/.test(input)) && input != "") {
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
}

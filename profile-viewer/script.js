window.onload = function() {
  if(getParameter('player')) {
    document.getElementById('txt_input').value = getParameter('player');
    document.getElementById('update').click();
  }
}

function update() {
  document.getElementById('txt_input').value = document.getElementById('txt_input').value.replace(/ /,"_");
  var input = document.getElementById('txt_input').value.replace(/-/g,"");

  var request = new XMLHttpRequest();
  if(input != "") {
    request.open('GET', 'https://api.minetools.eu/uuid/' + input, true)
  } else {
    request.open('GET', 'https://api.minetools.eu/uuid/Steve', true)
  }


  request.onload = function() {
    var data = JSON.parse(this.response)
    if(data.id) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.minetools.eu/profile/' + data.id, true)
      xhr.onload = function() {
        var data_profile = JSON.parse(this.response)
        getInfo(data_profile)
      }
      xhr.send();
    } else {
      swal({   title: "Error",
        text: "Can't find that player you're searching for\nPlease enter a valid Username or UUID",
        type: "error",
        confirmButtonColor: "#E12F2F",
        confirmButtonText: "OK",
        closeOnConfirm: true});
    }
  }
  request.send();
  setTimeout(function() {
    if(input == "") {
      document.getElementById('name_txt').value = "";
      document.getElementById('uuid_full_txt').value = "";
      document.getElementById('uuid_txt').value = "";
      document.getElementById('skin_img').src = "http://textures.minecraft.net/texture/dc1c77ce8e54925ab58125446ec53b0cdd3d0ca3db273eb908d5482787ef4016" ;
      document.getElementById('face_img').src = "https://minotar.net/helm/Steve/256.png"
      document.getElementById('front_img').src = "https://minotar.net/armor/body/Steve/128.png";
    }
  },10)
  setTimeout(function() {
    if(input == "") {
      document.getElementById('name_txt').value = "";
      document.getElementById('uuid_full_txt').value = "";
      document.getElementById('uuid_txt').value = "";
      document.getElementById('skin_img').src = "http://textures.minecraft.net/texture/dc1c77ce8e54925ab58125446ec53b0cdd3d0ca3db273eb908d5482787ef4016" ;
      document.getElementById('face_img').src = "https://minotar.net/helm/Steve/256.png"
      document.getElementById('front_img').src = "https://minotar.net/armor/body/Steve/128.png";
    }
  },20)
}

function getInfo(data) {
  var fullUUID_split = data.decoded.profileId.split('')
  var fullUUID = fullUUID_split[0] + fullUUID_split[1] + fullUUID_split[2] + fullUUID_split[3] + fullUUID_split[4] + fullUUID_split[5] + fullUUID_split[6] + fullUUID_split[7] + '-' + fullUUID_split[8] + fullUUID_split[9] + fullUUID_split[10] + fullUUID_split[11] + '-' + fullUUID_split[12] + fullUUID_split[13] + fullUUID_split[14] + fullUUID_split[15] + '-' + fullUUID_split[16] + fullUUID_split[17] + fullUUID_split[18] + fullUUID_split[19] + '-' + fullUUID_split[20] + fullUUID_split[21] + fullUUID_split[22] + fullUUID_split[23] + fullUUID_split[24] + fullUUID_split[25] + fullUUID_split[26] + fullUUID_split[27] + fullUUID_split[28] + fullUUID_split[29] + fullUUID_split[30] + fullUUID_split[31]
  document.getElementById('name_txt').value = data.decoded.profileName;
  document.getElementById('uuid_full_txt').value = fullUUID;
  document.getElementById('uuid_txt').value = data.decoded.profileId;
  document.getElementById('skin_img').src = data.decoded.textures.SKIN.url ;
  // document.getElementById('face_img').src = "https://minotar.net/helm/" + data.decoded.profileId + "/256.png"
  // document.getElementById('front_img').src = "https://minotar.net/armor/body/" + data.decoded.profileId + "/128.png";
  document.getElementById('face_img').src = "https://crafatar.com/avatars/" + data.decoded.profileId + "?size=256&overlay&default=MHF_Steve"
  document.getElementById('front_img').src = "https://minotar.net/armor/body/" + data.decoded.profileId + "/128.png";
  if(!getParameter('notracking')) {
    var sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedProfileViewer/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + data.decoded.profileName + '&value2=' + data.decoded.profileId, true)
    sendInfo.send();
  }
}

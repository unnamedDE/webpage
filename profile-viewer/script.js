window.onload = function() {
  if(getParameter('player')) {
    document.getElementById('txt_input').value = getParameter('player');
    document.getElementById('update').click();
  }
}

function update() {
  document.getElementById('txt_input').value = document.getElementById('txt_input').value.replace(/ /,"_")
  var input = document.getElementById('txt_input').value.replace(/-/g,"");

  var request = new XMLHttpRequest();

  request.open('GET', 'https://api.minetools.eu/uuid/' + input, true)

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

}

function getInfo(data) {
  var fullUUID_split = data.decoded.profileId.split('')
  var fullUUID = fullUUID_split[0] + fullUUID_split[1] + fullUUID_split[2] + fullUUID_split[3] + fullUUID_split[4] + fullUUID_split[5] + fullUUID_split[6] + fullUUID_split[7] + '-' + fullUUID_split[8] + fullUUID_split[9] + fullUUID_split[10] + fullUUID_split[11] + '-' + fullUUID_split[12] + fullUUID_split[13] + fullUUID_split[14] + fullUUID_split[15] + '-' + fullUUID_split[16] + fullUUID_split[17] + fullUUID_split[18] + fullUUID_split[19] + '-' + fullUUID_split[20] + fullUUID_split[21] + fullUUID_split[22] + fullUUID_split[23] + fullUUID_split[24] + fullUUID_split[25] + fullUUID_split[26] + fullUUID_split[27] + fullUUID_split[28] + fullUUID_split[29] + fullUUID_split[30] + fullUUID_split[31]
  document.getElementById('name_txt').value = data.decoded.profileName;
  document.getElementById('uuid_full_txt').value = fullUUID;
  document.getElementById('uuid_txt').value = data.decoded.profileId;
  document.getElementById('skin_img').src = data.decoded.textures.SKIN.url ;
  document.getElementById('face_img').src = "https://minotar.net/helm/" + data.decoded.profileId + "/256.png"
  document.getElementById('front_img').src = "https://minotar.net/armor/body/" + data.decoded.profileId + "/128.png";
  var sendInfo = new XMLHttpRequest();
  sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedProfileViewer/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + data.decoded.profileName + '&value2=' + data.decoded.profileId, true)
  sendInfo.send();
}

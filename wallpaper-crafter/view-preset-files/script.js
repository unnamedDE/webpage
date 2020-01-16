function getParameter(key) {
  var query = window.location.search.substring(1);
  var pairs = query.split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair[0] == key) {
      if (pair[1]) {
        if (pair[1].length > 0) {
          return decodeURI(pair[1]);
        }
      } else {
        return true
      }
    }
  }
  return undefined;
};

const presetName = getParameter('preset');
const imgContainer = document.querySelector('#imgContainer');

const background = document.createElement('img');
background.src = "../presets/" + presetName + "/background.png";
imgContainer.appendChild(background);
const players = document.createElement('img');
players.src = "../presets/" + presetName + "/players.png";
imgContainer.appendChild(players);
const mask_player = document.createElement('img');
mask_player.src = "../presets/" + presetName + "/mask_player.png";
imgContainer.appendChild(mask_player);
const shading_players = document.createElement('img');
shading_players.src = "../presets/" + presetName + "/shading_players.png";
imgContainer.appendChild(shading_players);
const players_armor = document.createElement('img');
players_armor.src = "../presets/" + presetName + "/players_armor.png";
imgContainer.appendChild(players_armor);
const mask_armor = document.createElement('img');
mask_armor.src = "../presets/" + presetName + "/mask_armor.png";
imgContainer.appendChild(mask_armor);
const shading_armor = document.createElement('img');
shading_armor.src = "../presets/" + presetName + "/shading_armor.png";
imgContainer.appendChild(shading_armor);
const foreground = document.createElement('img');
foreground.src = "../presets/" + presetName + "/foreground.png";
imgContainer.appendChild(foreground);
const preview = document.createElement('img');
preview.src = "../presets/" + presetName + "/preview.png";
imgContainer.appendChild(preview);

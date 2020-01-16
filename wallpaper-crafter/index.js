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

const skinSelecter = document.querySelector('#inputSkin');
const btnClear = document.querySelector('#btnClear');
const reader = new FileReader();
const imgOutput = document.querySelector('#imgOutput');
const btnDownload = document.querySelector('#btnDownload');
const imgContainer = document.querySelector('#imgContainer');
const openSkinSelect = document.querySelector('#openSkinSelect');
const skinSelectOverlay = document.querySelector('#skinSelectOverlay');

openSkinSelect.addEventListener('click', () => {
  skinSelectOverlay.classList.add('active');
});
skinSelectOverlay.addEventListener('click', e => {
  if(e.target != skinSelectOverlay) return;
  skinSelectOverlay.classList.remove('active');
});
document.querySelector('#skinSelectOverlay > div > .close').addEventListener('click', () => skinSelectOverlay.classList.remove('active'));
btnDownload.addEventListener('click', () => {
  if(!getParameter('notracking')) {
    const sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedWallpaperCrafter/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=download&value2=' + presetName, true)
    sendInfo.send();
  }
})

const imgBackground = document.createElement('img');
imgBackground.src = './presets/' + presetName + '/background.png';
imgContainer.appendChild(imgBackground);
const imgPlayers = document.createElement('img');
imgPlayers.src = './presets/' + presetName + '/players.png';
imgContainer.appendChild(imgPlayers);
const imgPlayerMask = document.createElement('img');
imgPlayerMask.src = './presets/' + presetName + '/mask_player.png';
imgContainer.appendChild(imgPlayerMask);
const imgPlayerShading = document.createElement('img');
imgPlayerShading.src = './presets/' + presetName + '/shading_players.png';
imgContainer.appendChild(imgPlayerShading);
const imgArmor = document.createElement('img');
imgArmor.src = './presets/' + presetName + '/players_armor.png';
imgContainer.appendChild(imgArmor);
const imgArmorMask = document.createElement('img');
imgArmorMask.src = './presets/' + presetName + '/mask_armor.png';
imgContainer.appendChild(imgArmorMask);
const imgArmorShading = document.createElement('img');
imgArmorShading.src = './presets/' + presetName + '/shading_armor.png';
imgContainer.appendChild(imgArmorShading);
const imgForeground = document.createElement('img');
imgForeground.src = './presets/' + presetName + '/foreground.png';
imgContainer.appendChild(imgForeground);

skinSelecter.addEventListener('change', generate);
// window.addEventListener('load', generate(undefined, './skins/steve.png'));
window.addEventListener('load', () => {
  imgOutput.src = './presets/' + presetName + '/preview.png';
  const img = document.createElement('img');
  img.src = './presets/' + presetName + '/preview.png';
  img.onload = () => {
    document.querySelector('#resolution').innerText = `${img.width}x${img.height}`;
  }
  btnDownload.href = './presets/' + presetName + '/preview.png';
  fetch('./list.json')
    .then(res => res.json())
    .then(list => {
      const name = list.find(e => e.id == presetName).name;
      document.querySelector('span#presetName').innerText = name;
      btnDownload.download = name + ' - unnamedDE wallpaper crafter.png';
    });
});
imgOutput.addEventListener('error', e => {
  if (!getParameter('nopreview')) {
    if (presetName == undefined || presetName == true) window.location.href = "gallery";
    else {
      window.location.href = 'error/?preset=' + presetName;
    }
  }
});
imgOutput.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy"
});
imgOutput.addEventListener('drop', e => {
  if (e.dataTransfer.files[0].type !== "image/png") return true;
  e.preventDefault();
  reader.onload = e => {
    generate(undefined, e.target.result);
  }
  reader.readAsDataURL(e.dataTransfer.files[0]);
});
btnClear.addEventListener('click', () => {
  generate(undefined, './skins/blank.png')
});

for (let img of document.querySelector('#dummy-skins').children) {
  img.addEventListener('click', e => {
    e.preventDefault();
    generate(undefined, img.src);
  });
}

function generate(e, selSkin) {

  skinSelectOverlay.classList.remove('active');

  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');


  const background = getImageData(imgBackground);
  let modified = new ImageData(new Uint8ClampedArray(background.data), background.width);

  const mask_player = getImageData(imgPlayerMask);
  if (modified.data.length != mask_player.data.length) return alert('Image resolution don\'t matches: mask_player.png');

  const layer_players = getImageData(imgPlayers);
  if (modified.data.length != layer_players.data.length) return alert('Image resolution don\'t matches: players.png');

  const shading_players = getImageData(imgPlayerShading);
  if (modified.data.length != layer_players.data.length) return alert('Image resolution don\'t matches: shading_players.png');

  const mask_armor = getImageData(imgArmorMask);
  if (modified.data.length != mask_armor.data.length) return alert('Image resolution don\'t matches: mask_armor.png');

  const layer_armor = getImageData(imgArmor);
  if (modified.data.length != layer_armor.data.length) return alert('Image resolution don\'t matches: layer_armor.png');

  const shading_armor = getImageData(imgArmorShading);
  if (modified.data.length != layer_armor.data.length) return alert('Image resolution don\'t matches: shading_armor.png');

  reader.onload = e => {
    if (selSkin === undefined) {
      img.src = e.target.result;
    } else {
      img.src = selSkin;
    }
    img.onload = () => {
      const skin = getImageData(img);
      if (skin.data.length != 16384) return alert('Image resolution don\'t matches: skin.png');

      let skin_layer_data = [];

      for (let i = 0; i < modified.data.length; i += 4) {
        const mask = (mask_player.data[i] + mask_player.data[i + 1] + mask_player.data[i]) / 765;
        if (mask < 0.1) {
          continue;
        };
        const b = {
          r: modified.data[i] / 255,
          g: modified.data[i + 1] / 255,
          b: modified.data[i + 2] / 255,
          a: modified.data[i + 3] / 255
        };
        const skinIdx = ((skin.width * Math.round(layer_players.data[i + 2] / 4) + Math.round(layer_players.data[i] / 4))) * 4
        const t = {
          r: skin.data[skinIdx] / 255,
          g: skin.data[skinIdx + 1] / 255,
          b: skin.data[skinIdx + 2] / 255,
          a: skin.data[skinIdx + 3] / 255
        };
        const s = {
          r: shading_players.data[i] / 255,
          g: shading_players.data[i + 1] / 255,
          b: shading_players.data[i + 2] / 255,
          a: shading_players.data[i + 3] / 255
        };
        const n = {
          r: Math.round(((t.r * (s.r * s.a)) * (t.a * mask) + (b.r * b.a) * (1 - (t.a * mask))) * 255),
          g: Math.round(((t.g * (s.g * s.a)) * (t.a * mask) + (b.g * b.a) * (1 - (t.a * mask))) * 255),
          b: Math.round(((t.b * (s.b * s.a)) * (t.a * mask) + (b.b * b.a) * (1 - (t.a * mask))) * 255),
          a: Math.round((b.a + (t.a * mask) * b.a) * 255)
        };
        modified.data[i] = n.r;
        modified.data[i + 1] = n.g;
        modified.data[i + 2] = n.b;
        modified.data[i + 3] = n.a;
      }

      for (let i = 0; i < modified.data.length; i += 4) {
        const mask = (mask_armor.data[i] + mask_armor.data[i + 1] + mask_armor.data[i]) / 765;
        if (mask < 0.1) continue;
        const b = {
          r: modified.data[i] / 255,
          g: modified.data[i + 1] / 255,
          b: modified.data[i + 2] / 255,
          a: modified.data[i + 3] / 255
        };
        const skinIdx = ((skin.width * Math.round(layer_armor.data[i + 2] / 4) + Math.round(layer_armor.data[i] / 4))) * 4
        const t = {
          r: skin.data[skinIdx] / 255,
          g: skin.data[skinIdx + 1] / 255,
          b: skin.data[skinIdx + 2] / 255,
          a: skin.data[skinIdx + 3] / 255
        };
        const s = {
          r: shading_armor.data[i] / 255,
          g: shading_armor.data[i + 1] / 255,
          b: shading_armor.data[i + 2] / 255,
          a: shading_armor.data[i + 3] / 255
        };
        const n = {
          r: Math.round(((t.r * (s.r * s.a)) * (t.a * mask) + (b.r * b.a) * (1 - (t.a * mask))) * 255),
          g: Math.round(((t.g * (s.g * s.a)) * (t.a * mask) + (b.g * b.a) * (1 - (t.a * mask))) * 255),
          b: Math.round(((t.b * (s.b * s.a)) * (t.a * mask) + (b.b * b.a) * (1 - (t.a * mask))) * 255),
          a: Math.round((b.a + (t.a * mask) * b.a) * 255)
        };
        modified.data[i] = n.r;
        modified.data[i + 1] = n.g;
        modified.data[i + 2] = n.b;
        modified.data[i + 3] = n.a;
      }


      const foreground = getImageData(imgForeground);
      modified = overlayPixelData(modified, foreground);


      if (!getParameter('nowatermark')) {
        canvas.width = modified.width;
        canvas.height = modified.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const textHeight = canvas.height / 25;
        const textBorder = (canvas.height + canvas.width) / 300;
        const text = document.createElement('span');
        text.innerText = "unnamedDE.tk";
        text.style.fontFamily = "sans-serif";
        text.style.fontSize = textHeight + "px";
        text.style.position = "absolute";
        text.style.visibility = "hidden";
        document.body.appendChild(text);
        const textWidth = text.offsetWidth;
        document.body.removeChild(text);
        ctx.fillStyle = "rgba(50, 50, 50, 150)";
        ctx.filter = "blur(" + textBorder * 2 + "px)";
        ctx.fillRect(canvas.width - (textBorder * 6) - textWidth, canvas.height - (textHeight + textBorder * 3), canvas.width, canvas.height);
        ctx.filter = "none";
        ctx.font = textHeight + "px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "right";
        ctx.fillText("unnamedDE.tk", canvas.width - textBorder, canvas.height - textBorder);
        modified = overlayPixelData(modified, ctx.getImageData(0, 0, canvas.width, canvas.height));
      }

      finished();
    };
  }
  if (selSkin) {
    reader.onload();
  } else {
    reader.readAsDataURL(skinSelecter.files[0]);
  }
  function finished() {
    canvas.width = modified.width;
    canvas.height = modified.height;
    ctx.putImageData(modified, 0, 0);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      imgOutput.src = url;
      btnDownload.href = url;
    })
  }
  function getImageData(img) {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function overlayPixelData(bottom, top, c = 1) {
    for (let i = 0; i < bottom.data.length; i += 4) {
      const b = {
        r: bottom.data[i] / 255,
        g: bottom.data[i + 1] / 255,
        b: bottom.data[i + 2] / 255,
        a: bottom.data[i + 3] / 255
      };
      const t = {
        r: top.data[i] / 255,
        g: top.data[i + 1] / 255,
        b: top.data[i + 2] / 255,
        a: top.data[i + 3] / 255
      };
      const n = {
        r: Math.round((t.r * (t.a * c) + (b.r * b.a) * (1 - (t.a * c))) * 255),
        g: Math.round((t.g * (t.a * c) + (b.g * b.a) * (1 - (t.a * c))) * 255),
        b: Math.round((t.b * (t.a * c) + (b.b * b.a) * (1 - (t.a * c))) * 255),
        a: Math.round((b.a + (t.a * c) * b.a) * 255)
      };
      bottom.data[i] = n.r;
      bottom.data[i + 1] = n.g;
      bottom.data[i + 2] = n.b;
      bottom.data[i + 3] = n.a;
    }
    return bottom;
  }
};



const playername = document.querySelector('#playername');
playername.addEventListener('change', e => {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://api.minetools.eu/uuid/' + encodeURIComponent(playername.value), true);

  request.onload = function() {
    const data = JSON.parse(this.response);
    if(data.id) {
      const image = document.createElement('img');
      image.crossOrigin = "Anonymous";
      image.src = 'https://crafatar.com/skins/' + encodeURIComponent(data.id);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      image.addEventListener('load', () => {
        canvas.height = image.height;
        canvas.width = image.width;
        ctx.drawImage(image, 0, 0);
        playername.value = "";
        generate(undefined, canvas.toDataURL());
      });
    }
  }
  request.send();
})

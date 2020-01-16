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

const skinSelecter = document.querySelector('#inputSkin');
const presetFiles = document.querySelector('#inputPresetFiles');
const btnClear = document.querySelector('#btnClear');
const reader = new FileReader();
const imgOutput = document.querySelector('#imgOutput');
const errorContainer = document.querySelector('#errorsInsert');


skinSelecter.addEventListener('change', generate);
presetFiles.addEventListener('change', () => {
  if(presetFiles.files.length > 0)
  generate(undefined, "../skins/steve.png");
});
imgOutput.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy"
});
imgOutput.addEventListener('drop', e => {
  if(e.dataTransfer.files[0].type !== "image/png") return true;
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
  const errors = []
  if(presetFiles.files.length == 0) return alert('No files selected!')
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');


  reader.onload = e => {
    img.onload = () => {
      const background = getImageData(img);
      let modified = new ImageData(new Uint8ClampedArray(background.data), background.width);

      reader.onload = e => {
        img.onload = () => {
          let mask_player;
          if(e.target.result) mask_player = getImageData(img);
          else {
            errors.push('mask_player.png is missing (include a black image)');
            const array = new Uint8ClampedArray(background.height * background.width * 4).fill(null);
            for(let i = 0; i < array.length; i+=4) {
              array[i] = 0;
              array[i+1] = 0;
              array[i+2] = 0;
              array[i+3] = 255;
            }
            mask_player = new ImageData(array, background.width);
          }
          if (modified.data.length != mask_player.data.length) return errors.push('Image resolution don\'t matches: mask_player.png');

          reader.onload = e => {
            img.onload = () => {
              if(e.target.result) layer_players = getImageData(img);
              else {
                errors.push('players.png is missing (advised to include together with mask_player.png)');
                const array = new Uint8ClampedArray(background.height * background.width * 4).fill(null);
                for(let i = 0; i < array.length; i+=4) {
                  array[i] = 0;
                  array[i+1] = 0;
                  array[i+2] = 0;
                  array[i+3] = 255;
                }
                layer_players = new ImageData(array, background.width);
              }
              if (modified.data.length != layer_players.data.length) return errors.push('Image resolution don\'t matches: players.png');

              reader.onload = e => {
                img.onload = () => {
                  let shading_players;
                  if(e.target.result) shading_players = getImageData(img);
                  else {
                    errors.push('shading_players.png is missing (include a white image)');
                    shading_players = new ImageData(new Uint8ClampedArray(background.height * background.width * 4).fill(255), background.width);
                  }
                  if (modified.data.length != layer_players.data.length) return errors.push('Image resolution don\'t matches: shading_players.png');

                  reader.onload = e => {
                    img.onload = () => {
                      let mask_armor;
                      if(e.target.result) mask_armor = getImageData(img);
                      else {
                        errors.push('mask_armor.png is missing (include a black image)');
                        const array = new Uint8ClampedArray(background.height * background.width * 4).fill(null);
                        for(let i = 0; i < array.length; i+=4) {
                          array[i] = 0;
                          array[i+1] = 0;
                          array[i+2] = 0;
                          array[i+3] = 255;
                        }
                        mask_armor = new ImageData(array, background.width);
                      }
                      if (modified.data.length != mask_armor.data.length) return errors.push('Image resolution don\'t matches: mask_armor.png');

                      reader.onload = e => {
                        img.onload = () => {
                          if(e.target.result) layer_armor = getImageData(img);
                          else {
                            errors.push('players_armor.png is missing (advised to include together with mask_armor.png)');
                            const array = new Uint8ClampedArray(background.height * background.width * 4).fill(null);
                            for(let i = 0; i < array.length; i+=4) {
                              array[i] = 0;
                              array[i+1] = 0;
                              array[i+2] = 0;
                              array[i+3] = 255;
                            }
                            layer_armor = new ImageData(array, background.width);
                          }
                          if (modified.data.length != layer_armor.data.length) return errors.push('Image resolution don\'t matches: layer_armor.png');

                          reader.onload = e => {
                            img.onload = () => {
                              let shading_armor;
                              if(e.target.result) shading_armor = getImageData(img);
                              else {
                                errors.push('shading_armor.png is missing (include a white image)');
                                shading_armor = new ImageData(new Uint8ClampedArray(background.height * background.width * 4).fill(255), background.width);
                              }
                              if (modified.data.length != layer_armor.data.length) return errors.push('Image resolution don\'t matches: shading_armor.png');

                              reader.onload = e => {
                                if (selSkin === undefined) {
                                  img.src = e.target.result;
                                } else {
                                  img.src = selSkin;
                                }
                                img.onload = () => {
                                  const skin = getImageData(img);
                                  if (skin.data.length == 8192) return alert('64x32px (pre 1.8) skins are not supported!');
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
                                    if(layer_players.data[i] == 0 && layer_players.data[i+1] == 0 && layer_players.data[i+2] == 0 && layer_players.data[i+3] == 255) {
                                      modified.data[i] = 255;
                                      modified.data[i + 1] = 0;
                                      modified.data[i + 2] = 0;
                                      modified.data[i + 3] = 255;
                                    }
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
                                    if(layer_armor.data[i] == 0 && layer_armor.data[i+1] == 0 && layer_armor.data[i+2] == 0 && layer_armor.data[i+3] == 255) {
                                      modified.data[i] = 255;
                                      modified.data[i + 1] = 0;
                                      modified.data[i + 2] = 255;
                                      modified.data[i + 3] = 255;
                                    }
                                  }

                                  reader.onload = e => {

                                    img.onload = () => {

                                      let foreground;
                                      if(e.target.result) foreground = getImageData(img);
                                      else {
                                        errors.push('foreground.png is missing (include a transparent image)');
                                        foreground = new ImageData(new Uint8ClampedArray(background.height * background.width * 4).fill(0), background.width);
                                      }
                                      modified = overlayPixelData(modified, foreground);


                                        if(!getParameter('nowatermark')) {
                                        canvas.width = modified.width;
                                        canvas.height = modified.height;
                                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                                        const textHeight = canvas.height/25;
                                        const textBorder = (canvas.height+canvas.width)/300;
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
                                        ctx.filter = "blur(" + textBorder*2 + "px)";
                                        ctx.fillRect(canvas.width-(textBorder*6)-textWidth, canvas.height - (textHeight+textBorder*3), canvas.width, canvas.height);
                                        ctx.filter = "none";
                                        ctx.font = textHeight + "px sans-serif";
                                        ctx.fillStyle = "#fff";
                                        ctx.textAlign = "right";
                                        ctx.fillText("unnamedDE.tk", canvas.width-textBorder, canvas.height-textBorder);
                                        modified = overlayPixelData(modified, ctx.getImageData(0, 0, canvas.width, canvas.height));
                                      }


                                      finished();
                                    };
                                    if(e.target.result) img.src = e.target.result;
                                    else img.onload();
                                  }
                                  const foregroundImage = Array.from(presetFiles.files).find(e => e.name == "foreground.png");
                                  if(foregroundImage) reader.readAsDataURL(foregroundImage);
                                  else reader.onload({target: {}});

                                }
                              };
                              if (selSkin) {
                                reader.onload();
                              } else {
                                reader.readAsDataURL(skinSelecter.files[0]);
                              }
                            };
                            if(e.target.result) img.src = e.target.result;
                            else img.onload();
                          }
                          const shadingArmorImage = Array.from(presetFiles.files).find(e => e.name == "shading_armor.png");
                          if(shadingArmorImage) reader.readAsDataURL(shadingArmorImage);
                          else reader.onload({target: {}});
                        };
                        if(e.target.result) img.src = e.target.result;
                        else img.onload();
                      }
                      const playersArmorImage = Array.from(presetFiles.files).find(e => e.name == "players_armor.png");
                      if(playersArmorImage) reader.readAsDataURL(playersArmorImage);
                      else reader.onload({target: {}});
                    };
                    if(e.target.result) img.src = e.target.result;
                    else img.onload();
                  }
                  const maskArmorImage = Array.from(presetFiles.files).find(e => e.name == "mask_armor.png");
                  if(maskArmorImage) reader.readAsDataURL(maskArmorImage);
                  else reader.onload({target: {}});
                };
                if(e.target.result) img.src = e.target.result;
                else img.onload();
              }
              const shadingPlayersImage = Array.from(presetFiles.files).find(e => e.name == "shading_players.png");
              if(shadingPlayersImage) reader.readAsDataURL(shadingPlayersImage);
              else reader.onload({target: {}});
            };
            if(e.target.result) img.src = e.target.result;
            else img.onload();
          }
          const playersImage = Array.from(presetFiles.files).find(e => e.name == "players.png");
          if(playersImage) reader.readAsDataURL(playersImage);
          else reader.onload({target: {}});
        };
        if(e.target.result) img.src = e.target.result;
        else img.onload();
      };
      const maskPlayerImage = Array.from(presetFiles.files).find(e => e.name == "mask_player.png");
      if(maskPlayerImage) reader.readAsDataURL(maskPlayerImage);
      else reader.onload({target: {}});



      function finished() {
        canvas.width = modified.width;
        canvas.height = modified.height;
        ctx.putImageData(modified, 0, 0);
        errorContainer.innerHTML = "";
        errors.forEach(e => {
          const div = document.createElement('div');
          div.innerText = e;
          errorContainer.appendChild(div);
        })
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          imgOutput.src = url;
        });
      };
    };
    img.src = e.target.result;
  }
  reader.readAsDataURL(Array.from(presetFiles.files).find(e => e.name == "background.png"));





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

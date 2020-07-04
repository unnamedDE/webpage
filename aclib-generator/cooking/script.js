
document.querySelector('#backButton').href = (new URL(window.location)).searchParams.get('back') ? (new URL(window.location)).searchParams.get('back') : ((new URL(window.location)).searchParams.get('notracking') != null ? '../?notracking' : '..');
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

fetch('../idlist.json').then(res => res.json()).then(idlist => {
  const detailsContainerContent = document.querySelector('#detailsContainer div.content');
  const recipeInterface = document.querySelector('#recipeContainer > .recipeInterface');
  const exportContainer = document.querySelector('#exportContainer')
  const detailsCloseButton = detailsContainer.querySelector('.closeButton');
  const exportRecipeBtn = detailsContainerContent.querySelector('.btn.export');
  const input = recipeInterface.querySelector('span.input');
  const output = recipeInterface.querySelector('span.output');
  const fuelSlot = recipeInterface.querySelector('span.fuel');
  const showJSONBtn = exportContainer.querySelector('button.export.showJSON');
  const downloadPackBtn = exportContainer.querySelector('button.export.downloadPack');


  const recipePath = detailsContainerContent.querySelector('.default .recipePath');
  const recipeXP = detailsContainerContent.querySelector('.default .experience');
  const recipeGroup = detailsContainerContent.querySelector('.default .recipeGroup');
  const btnReset = detailsContainerContent.querySelector('.default .btn.reset');
  const craftingModes = document.querySelectorAll('div.craftingMode > div.custom-control > input');
  let activeItem = '';
  let oldActiveItem = '';
  let projects;
  const projectId = (new URL(window.location)).searchParams.get('projectId');
  const projectRecipeId = (new URL(window.location)).searchParams.get('recipeId');
  let recipe;
  if(projectId && projectRecipeId) {
    projects = JSON.parse(localStorage.getItem('aclib-projects'));
    recipe = projects.find(e => e.id == projectId).recipes.find(e => e.id == projectRecipeId).data;
  }
  else {
    if(!localStorage.getItem('aclib-current')) localStorage.setItem('aclib-current', '{"cooking":{}}')
    if(!JSON.parse(localStorage.getItem('aclib-current')).cooking) localStorage.setItem('aclib-current', JSON.stringify({...JSON.parse(localStorage.getItem('aclib-current')), cooking: {}}));
    recipe = JSON.parse(localStorage.getItem('aclib-current')).cooking;
  }

  const idInput = detailsContainerContent.querySelector('.input input.id');


  const idOutput = detailsContainerContent.querySelector('.output input.id');
  const cookingTime = detailsContainerContent.querySelector('.fuel #cookingTime');

  updateLocalStorage();
  reloadRecipe();

  refreshDetails();


  input.addEventListener('click', ev => {
    // if(ev.ctrlKey) return;
    activeItem = input.dataset.item;
    [input, output, fuelSlot].forEach(e => e.classList.remove('active'));
    input.classList.add('active');
    refreshDetails();
  });
  output.addEventListener('click', ev => {
    // if(ev.ctrlKey) return;
    activeItem = output.dataset.item;
    [input, output, fuelSlot].forEach(e => e.classList.remove('active'));
    output.classList.add('active');
    refreshDetails();
  });
  fuelSlot.addEventListener('click', ev => {
    // if(ev.ctrlKey) return;
    activeItem = fuelSlot.dataset.item;
    [input, output, fuelSlot].forEach(e => e.classList.remove('active'));
    fuelSlot.classList.add('active');
    refreshDetails();
  });
  const fuelImageLinks = [{link: 'https://minecraftitemids.com/item/64/coal.png', item: true}, {link: 'https://minecraftitemids.com/item/64/charcoal.png', item: true}, {link: 'https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/c/cc/Block_of_Coal_JE3_BE2.png/150px-Block_of_Coal_JE3_BE2.png?version=ceaa2364b07adb83f5b06f6f3bed4df1'}]
  setInterval(() => {
    const fuelSlotImg = fuelSlot.querySelector('img.display');
    fuelSlotImg.classList.remove('pixelated');
    let index = fuelImageLinks.indexOf(fuelImageLinks.find(e => e.link == fuelSlotImg.src))+1;
    if(index >= fuelImageLinks.length) index = 0;
    fuelSlotImg.src = fuelImageLinks[index].link;
    if(fuelImageLinks[index].item) fuelSlotImg.classList.add('pixelated');
  }, 3000);
  craftingModes.forEach(cm => {
    cm.addEventListener('change', () => {
      if(!recipe.craftingMode) recipe.craftingMode = {furnace: true};
      recipe.craftingMode[cm.dataset.mode] = Boolean(cm.checked);
      checkAdaptCookingTime();
      updateLocalStorage();
    });
  });

  detailsContainerContent.querySelector('.input .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.input input.id').value = '';
    input.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    delete recipe[activeItem];
  });
  detailsContainerContent.querySelector('.output .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.output input.id').value = '';
    output.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    // console.log(recipe);
    delete recipe[activeItem];
    // console.log(recipe);
  });
  exportRecipeBtn.addEventListener('click', () => {
    console.log(recipe);
    download(`recipeexport-${Date.now()}.json`, JSON.stringify(recipe, undefined, '\t'));
  });

  detailsCloseButton.addEventListener('click', () => {
    activeItem = '';
    [input, output, fuelSlot].forEach(e => e.classList.remove('active'));
    refreshDetails();
  });

  showJSONBtn.addEventListener('click', () => {
    const modal = document.querySelector('div#showJSON.modal');
    const outputs = modal.querySelectorAll('textarea.output');
    const json = cookingGenerate(recipe);
    if(json == false) return;
    console.log(json);
    if(json[4]) {
      if(json[4].craftingMode.furnace) modal.querySelector('textarea.output[data-mode="furnace"]').classList.remove('hidden');
      else modal.querySelector('textarea.output[data-mode="furnace"]').classList.add('hidden');
      if(json[4].craftingMode.blast_furnace) modal.querySelector('textarea.output[data-mode="blast_furnace"]').classList.remove('hidden');
      else modal.querySelector('textarea.output[data-mode="blast_furnace"]').classList.add('hidden');
      if(json[4].craftingMode.smoker) modal.querySelector('textarea.output[data-mode="smoker"]').classList.remove('hidden');
      else modal.querySelector('textarea.output[data-mode="smoker"]').classList.add('hidden');
      if(json[4].craftingMode.campfire) modal.querySelector('textarea.output[data-mode="campfire"]').classList.remove('hidden');
      else modal.querySelector('textarea.output[data-mode="campfire"]').classList.add('hidden');
    }
    for(let i = 0; i < 4; i++) {
      outputs[i].value = JSON.stringify(json[i], undefined, '\t');
    }
    output.value = JSON.stringify(json[0], undefined, '\t');
    modal.querySelector('.downloadBtn').onclick = () => {

        console.log(json[0]);

        const zip = new JSZip();
        if(json[4].craftingMode.furnace) zip.file(`${/\//.test(json[4].recipePath) ? json[4].recipePath.split('/').pop() : json[4].recipePath.split(':').pop()}-smelting.mcfuntion`, JSON.stringify(json[0], undefined, '\t'));
        if(json[4].craftingMode.blast_furnace) zip.file(`${/\//.test(json[4].recipePath) ? json[4].recipePath.split('/').pop() : json[4].recipePath.split(':').pop()}-blasting.mcfuntion`, JSON.stringify(json[1], undefined, '\t'));
        if(json[4].craftingMode.smoker) zip.file(`${/\//.test(json[4].recipePath) ? json[4].recipePath.split('/').pop() : json[4].recipePath.split(':').pop()}-smoking.mcfuntion`, JSON.stringify(json[2], undefined, '\t'));
        if(json[4].craftingMode.campfire) zip.file(`${/\//.test(json[4].recipePath) ? json[4].recipePath.split('/').pop() : json[4].recipePath.split(':').pop()}-campfire_cooking.mcfuntion`, JSON.stringify(json[3], undefined, '\t'));

        zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
          .then((content) => {
            const el = document.createElement('a');
            el.href = "data:application/zip;base64,"+content;
            el.download = `recipe-${Date.now()}.zip`
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
          });
    }


    $('div#showJSON.modal').modal();
  });
  downloadPackBtn.addEventListener('click', () => {
    const json = cookingGenerate(recipe, true);
    if(json == false) return;

    const zip = new JSZip();
    zip
      .file('pack.mcmeta', '{"pack": {"pack_format": 5,"description": "Datapack generated by ac-lib generator (unnamedDE.tk)"}}');
    if(json[4].craftingMode.furnace) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-smelting.json', JSON.stringify(json[0], undefined, '\t'));
    if(json[4].craftingMode.blast_furnace) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-blasting.json', JSON.stringify(json[1], undefined, '\t'));
    if(json[4].craftingMode.smoker) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-smoking.json', JSON.stringify(json[2], undefined, '\t'));
    if(json[4].craftingMode.campfire) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-campfire_cooking.json', JSON.stringify(json[3], undefined, '\t'));


    JSZipUtils.getBinaryContent("../imgs/pack-icons/smelting.png", function (err, data) {
      if(err) {
        throw err; // or handle the error
      }
      zip.file("pack.png", data, {binary:true});

      zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
        .then((content) => {
          const el = document.createElement('a');
          el.href = "data:application/zip;base64,"+content;
          const splitPath1 = json[4].recipePath.split(':');
          const splitPath2 = splitPath1[splitPath1.length-1].split('/');
          el.download = `recipe-${splitPath2[splitPath2.length-1]}.zip`
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        });
      });
  });


  recipePath.addEventListener('input', () => {
    recipe.recipePath = recipePath.value;
    updateLocalStorage();
  });
  recipeXP.addEventListener('input', () => {
    recipe.experience = recipeXP.value;
    updateLocalStorage();
  });
  recipeGroup.addEventListener('input', () => {
    recipe.group = recipeGroup.value;
    if(recipeGroup.value == '') delete recipe.group
    updateLocalStorage();
  });
  btnReset.addEventListener('click', () => {
    sweetalert({
      title: "Are you sure?",
      text: "You will not be able to recover the current recipe",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "cancel",
      closeOnConfirm: true,
      closeOnCancel: true
    },
    (isConfirm) => {
      if (isConfirm) {
        recipe = {};
        updateLocalStorage();
        reloadRecipe();
      }
    });
  });

  [input, output].forEach(e => {
    e.addEventListener('dragstart', ev => {
      ev.target.classList.add('dragging');
    });
    e.addEventListener('dragend', ev => {
      ev.target.classList.remove('dragging');
    });
    e.addEventListener('dragenter', ev => {
      ev.target.classList.add('dragover');
    });
    e.addEventListener('dragleave', ev => {
      ev.target.classList.remove('dragover');
    });
    e.addEventListener('dragover', ev => {
      ev.preventDefault();
    });
    e.addEventListener('drop', ev => {
      saveInputs(activeItem);
      ev.target.classList.remove('dragover');
      const from = [input, output].find(e => /dragging/.test(e.classList));
      const to = ev.target;
      detailsCloseButton.click();
      if(ev.ctrlKey) {
        if(recipe[from.dataset.item]) {
          recipe[to.dataset.item] = recipe[from.dataset.item];
        }
      } else {
        if(recipe[to.dataset.item] && recipe[from.dataset.item]) {
          const temp = recipe[to.dataset.item];
          recipe[to.dataset.item] = recipe[from.dataset.item];
          recipe[from.dataset.item] = temp;
        } else if(recipe[to.dataset.item]) {
          recipe[from.dataset.item] = recipe[to.dataset.item];
          delete recipe[to.dataset.item];
        } else if(recipe[from.dataset.item]) {
          recipe[to.dataset.item] = recipe[from.dataset.item];
          delete recipe[from.dataset.item];
        }
      }


      to.click();
      reloadRecipe();
    });
  });


  window.addEventListener('keydown', ev => {
    if(ev.target.localName == 'input' || ev.target.localName == 'textarea') return;
    if(ev.key == 'Backspace' || ev.key == 'Delete') {
      ev.preventDefault();
      if(activeItem != '') {
        if(activeItem == 'in') detailsContainerContent.querySelector('.input .delete').click();
        if(activeItem == 'out') detailsContainerContent.querySelector('.output .delete').click();
        // if(activeItem == 'craftingMode') craftingModeSelect.value = 'default';
        detailsCloseButton.click();
      }
    }
  });






  [idInput, idOutput, cookingTime].forEach(e => e.addEventListener('input', () => {
    refreshItem();
    saveInputs(activeItem);
    updateLocalStorage();
  }));

  idInput.addEventListener('blur', () => {
    if(!idInput.value) delete recipe[activeItem];
  });
  idOutput.addEventListener('blur', () => {
    if(!idOutput.value) delete recipe[activeItem];
  });




  function refreshItem() {
    if(activeItem == 'in') {
      if(idInput.value == '') {
        detailsContainerContent.querySelector('.input .itemName').innerText = 'None';
        input.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        return;
      }
      const item = /^#/.test(idInput.value) ? {name: 'Item Tag', link: '../imgs/item_tag.png'} : getItemById(/:/.test(idInput.value) ? idInput.value.replace(/ /g, '_') : `minecraft:${idInput.value.replace(/ /g, '_')}`);
      detailsContainerContent.querySelector('.input .itemName').innerText = item.name;
      const img = input.querySelector('img.display')
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');

    } else if(activeItem == 'out') {

      if(idOutput.value == '') {
        detailsContainerContent.querySelector('.output .itemName').innerText = 'None';
        output.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        return;
      }
      const item = getItemById(/:/.test(idOutput.value) ? idOutput.value.replace(/ /g, '_') : `minecraft:${idOutput.value.replace(/ /g, '_')}`);
      detailsContainerContent.querySelector('.output .itemName').innerText = item.name;
      const img = output.querySelector('img.display');
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');
    }

  }

  function saveInputs(active) {
    if(active == 'in') {
      if(detailsContainerContent.querySelector('.input input.id').value) {
        recipe[active] = {
          id: detailsContainerContent.querySelector('.input input.id').value,
        }
      } else delete recipe[active]
      updateLocalStorage();
    } else if(active == 'out') {
      if(detailsContainerContent.querySelector('.output input.id').value) {
        recipe[active] = {
          id: detailsContainerContent.querySelector('.output input.id').value,
        }
      } else delete recipe[active]
      updateLocalStorage();
    } else if(active == 'fuel') {
      if(detailsContainerContent.querySelector('.fuel #cookingTime').value) {
        recipe.cookingTime = detailsContainerContent.querySelector('.fuel #cookingTime').value;
      } else recipe.cookingTime = 200;
      updateLocalStorage();
    }
  }



  function refreshDetails() {
    detailsCloseButton.classList.add('hidden');
    detailsContainerContent.querySelectorAll('#detailsContainer > div.content > div').forEach(e => e.classList.add('hidden'));
    if(oldActiveItem == '') {

    } else if(oldActiveItem == 'in') {
      saveInputs(oldActiveItem);
    } else if(oldActiveItem == 'out') {
      saveInputs(oldActiveItem);
    } else if(oldActiveItem == 'fuel') {
      saveInputs(oldActiveItem);
    }
    if(activeItem == '') {

      detailsContainerContent.querySelector('.default').classList.remove('hidden');

    } else if(activeItem == 'in') {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.input').classList.remove('hidden');
      idInput.value = recipe[activeItem] && recipe[activeItem].id ? recipe[activeItem].id.replace(/ /g, '_') : '';

      refreshItem();

    } else if(activeItem == 'out') {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.output').classList.remove('hidden');
      idOutput.value = recipe[activeItem] && recipe[activeItem].id ? recipe[activeItem].id.replace(/ /g, '_') : '';

      refreshItem();

    } else if(activeItem == 'fuel') {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.fuel').classList.remove('hidden');
      cookingTime.value = recipe.cookingTime || '200';

      refreshItem();

    }

    // console.log(recipe);
    oldActiveItem = activeItem;
  }

  function getItemById(id) {
    const item = idlist.find(e => e.id.toLowerCase() == id.toLowerCase());
    if(item == undefined) return {
      name: 'Custom Item',
      id: id,
      link: '../imgs/custom_item.png',
      custom: true,
    }
    return item;
  }
  function reloadRecipe() {
    // console.log(recipe);
    detailsContainerContent.querySelector('.default .recipePath').value = recipe.recipePath ? recipe.recipePath : '';
    detailsContainerContent.querySelector('.default .experience').value = recipe.experience ? recipe.experience : '';
    detailsContainerContent.querySelector('.default .recipeGroup').value = recipe.group ? recipe.group : '';
    [input, output].forEach(e => {
      if(recipe[e.dataset.item]) {
        const item = /^#/.test(recipe[e.dataset.item].id) && e.dataset.item == 'in' ? {name: 'Item Tag', link: '../imgs/item_tag.png'} : (getItemById(/:/.test(recipe[e.dataset.item].id) ? recipe[e.dataset.item].id.replace(/ /g, '_') : `minecraft:${recipe[e.dataset.item].id.replace(/ /g, '_')}`));
        const img = e.querySelector('img.display');
        img.src = item.link;
        img.classList.remove('pixelated');
        if(item.type == 'item') img.classList.add('pixelated');
        if(!recipe[e.dataset.item].id) delete recipe[e.dataset.item];
        updateLocalStorage();
      } else {
        e.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
    });
    // if(recipe.craftingMode) document.querySelector(`input#${recipe.craftingMode}[name="recipeType"]`).checked = true;
    checkAdaptCookingTime();
    if(activeItem == 'in') {
      detailsContainerContent.querySelector('.input .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.input .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
    } else if(activeItem == 'out') {
    detailsContainerContent.querySelector('.output .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.output .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
    }
  }
  function checkAdaptCookingTime() {
    if(recipe.craftingMode) {
      let adaptCookingTime = false;
      if(recipe.craftingMode.furnace) document.querySelector(`input#smelting`).checked = true;
      else document.querySelector(`input#smelting`).checked = false;
      if(recipe.craftingMode.blast_furnace) {
        document.querySelector(`input#blasting`).checked = true;
        adaptCookingTime = true;
      } else document.querySelector(`input#blasting`).checked = false;
      if(recipe.craftingMode.smoker) {
        document.querySelector(`input#smoking`).checked = true;
        adaptCookingTime = true;
      } else document.querySelector(`input#smoking`).checked = false;
      if(recipe.craftingMode.campfire) {
        document.querySelector(`input#campfire`).checked = true;
        adaptCookingTime = true;
      } else document.querySelector(`input#campfire`).checked = false;
      if(adaptCookingTime == true) document.querySelector(`input#adaptCookingTime`).disabled = false;
      else document.querySelector(`input#adaptCookingTime`).disabled = true;
      if(recipe.craftingMode.adapt || recipe.craftingMode.adapt == false) {
        document.querySelector(`input#adaptCookingTime`).checked = recipe.craftingMode.adapt;
      } else {
        if(recipe.craftingMode.furnace) document.querySelector(`input#adaptCookingTime`).checked = true;
        else document.querySelector(`input#adaptCookingTime`).checked = false;
      }
    }
  }
  function updateLocalStorage() {
    if(projectId && projectRecipeId) {
      localStorage.setItem('aclib-projects', JSON.stringify(projects));
    }
    else localStorage.setItem('aclib-current', JSON.stringify({...JSON.parse(localStorage.getItem('aclib-current')), cooking: recipe}));
  }



});

function download(filename,text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename)
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function sweetalert(...args) {
  const ret = swal(...args);
  document.body.classList.remove('stop-scrolling');
  return ret;
}

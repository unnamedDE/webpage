
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
  const showJSONBtn = exportContainer.querySelector('button.export.showJSON');
  const downloadPackBtn = exportContainer.querySelector('button.export.downloadPack');


  const recipePath = detailsContainerContent.querySelector('.default .recipePath');
  const recipeGroup = detailsContainerContent.querySelector('.default .recipeGroup');
  const btnReset = detailsContainerContent.querySelector('.default .btn.reset');
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
    if(!localStorage.getItem('aclib-current')) localStorage.setItem('aclib-current', '{"stonecutter":{}}')
    if(!JSON.parse(localStorage.getItem('aclib-current')).stonecutter) localStorage.setItem('aclib-current', JSON.stringify({...JSON.parse(localStorage.getItem('aclib-current')), stonecutter: {}}));
    recipe = JSON.parse(localStorage.getItem('aclib-current')).stonecutter;
  }

  const idInput = detailsContainerContent.querySelector('.input input.id');


  const idOutput = detailsContainerContent.querySelector('.output input.id');
  const amountOutput = detailsContainerContent.querySelector('.output .amount');

  updateLocalStorage();
  reloadRecipe();

  refreshDetails();


  input.addEventListener('click', ev => {
    // if(ev.ctrlKey) return;
    activeItem = input.dataset.item;
    [input, output].forEach(e => e.classList.remove('active'));
    input.classList.add('active');
    refreshDetails();
  });
  output.addEventListener('click', ev => {
    // if(ev.ctrlKey) return;
    activeItem = output.dataset.item;
    [input, output].forEach(e => e.classList.remove('active'));
    output.classList.add('active');
    refreshDetails();
  });

  detailsContainerContent.querySelector('.input .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.input input.id').value = '';
    input.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    delete recipe[activeItem];
  });
  detailsContainerContent.querySelector('.output .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.output input.id').value = '';
    detailsContainerContent.querySelector('.output input.amount').value = 1;
    detailsContainerContent.querySelector('.output .amount-display').innerText = 1;
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
    [input, output].forEach(e => e.classList.remove('active'));
    refreshDetails();
  });

  showJSONBtn.addEventListener('click', () => {
    // const mcfunctions = generateMcfunctions();
    // if(mcfunctions == false) return;
    const modal = document.querySelector('div#showJSON.modal');
    const output = modal.querySelector('textarea.output');
    // const instructions = modal.querySelector('.instructions');
    // instructions.querySelectorAll('.path').forEach(e => e.innerText = mcfunctions[5].funcPath);
    // instructions.querySelectorAll('.foldername').forEach(e => e.innerText = /\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop());
    //
    //
    const json = stonecutterGenerate(recipe);
    if(json == false) return;
    output.value = JSON.stringify(json[0], undefined, '\t');
    modal.querySelector('.downloadBtn').onclick = () => {
        download(`recipe-${Date.now()}.json`, JSON.stringify(json[0], undefined, '\t'))
    }


    $('div#showJSON.modal').modal();
  });
  downloadPackBtn.addEventListener('click', () => {
    const json = stonecutterGenerate(recipe, true);
    if(json == false) return;

    const zip = new JSZip();
    zip
      .file('pack.mcmeta', '{"pack": {"pack_format": 5,"description": "Datapack generated by ac-lib generator (unnamedDE.tk)"}}')
      .file('data/' + (/:/.test(json[1].recipePath) ? json[1].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[1].recipePath) + '.json', JSON.stringify(json[0], undefined, '\t'));


      zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
        .then((content) => {
          const el = document.createElement('a');
          el.href = "data:application/zip;base64,"+content;
          const splitPath1 = json[1].recipePath.split(':');
          const splitPath2 = splitPath1[splitPath1.length-1].split('/');
          el.download = `recipe-${splitPath2[splitPath2.length-1]}.zip`
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        });
  });


  recipePath.addEventListener('input', () => {
    recipe.recipePath = recipePath.value;
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






  [idInput, idOutput, amountOutput].forEach(e => e.addEventListener('input', () => {
    refreshItem();
    saveInputs(activeItem);
    updateLocalStorage();
  }));

  idInput.addEventListener('blur', () => {
    if(!idInput.value) delete recipe[activeItem];
  });
  idOutput.addEventListener('blur', () => {
    if(!idOutput.value && amountOutput.value == 1) delete recipe[activeItem];
  });
  amountOutput.addEventListener('change', () => {
    if(!idOutput.value && amountOutput.value == 1) delete recipe[activeItem];
  });
  amountOutput.addEventListener('input', () => detailsContainerContent.querySelector('.output .amount-display').innerText = amountOutput.value);




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
        output.querySelector('span.amount').innerText = '';
        return;
      }
      const item = getItemById(/:/.test(idOutput.value) ? idOutput.value.replace(/ /g, '_') : `minecraft:${idOutput.value.replace(/ /g, '_')}`);
      detailsContainerContent.querySelector('.output .itemName').innerText = item.name;
      const img = output.querySelector('img.display');
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');
      if(amountOutput.value != 1) {
        output.querySelector('span.amount').innerText = amountOutput.value;
      } else {
        output.querySelector('span.amount').innerText = '';
      }
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
      if(detailsContainerContent.querySelector('.output input.id').value || detailsContainerContent.querySelector('.output .amount').value != 1) {
        recipe[active] = {
          id: detailsContainerContent.querySelector('.output input.id').value,
          amount: detailsContainerContent.querySelector('.output input.amount').value,
        }
      } else delete recipe[active]
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
      amountOutput.value = recipe[activeItem] && recipe[activeItem].amount ? recipe[activeItem].amount : 1;
      detailsContainerContent.querySelector('.output .amount-display').innerText = amountOutput.value;

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
    detailsContainerContent.querySelector('.default .recipeGroup').value = recipe.group ? recipe.group : '';
    [input, output].forEach(e => {
      if(recipe[e.dataset.item]) {
        const item = /^#/.test(recipe[e.dataset.item].id) && e.dataset.item == 'in' ? {name: 'Item Tag', link: '../imgs/item_tag.png'} : (getItemById(/:/.test(recipe[e.dataset.item].id) ? recipe[e.dataset.item].id.replace(/ /g, '_') : `minecraft:${recipe[e.dataset.item].id.replace(/ /g, '_')}`));
        const img = e.querySelector('img.display');
        img.src = item.link;
        img.classList.remove('pixelated');
        if(item.type == 'item') img.classList.add('pixelated');
        if(!recipe[e.dataset.item].id) delete recipe[e.dataset.item];
        if(e.dataset.item == 'out') {
          if(!recipe[e.dataset.item].amount) recipe[e.dataset.item].amount = 1;
          if(recipe[e.dataset.item].amount == 1) e.querySelector('.amount').innerText = '';
          else e.querySelector('.amount').innerText = recipe[e.dataset.item].amount;
        }
        updateLocalStorage();
      } else {
        e.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
    });
    if(recipe.craftingMode) document.querySelector(`input#${recipe.craftingMode}[name="recipeType"]`).checked = true;
    if(activeItem == 'in') {
      detailsContainerContent.querySelector('.input .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.input .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
    } else if(activeItem == 'out') {
    detailsContainerContent.querySelector('.output .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.output .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
      detailsContainerContent.querySelector('.output .inputs .amount-display').innerText = recipe[activeItem] ? recipe[activeItem].amount : 1;
      detailsContainerContent.querySelector('.output .inputs .amount').value = recipe[activeItem] ? recipe[activeItem].amount : 1;
    }
  }
  function updateLocalStorage() {
    if(projectId && projectRecipeId) {
      localStorage.setItem('aclib-projects', JSON.stringify(projects));
    }
    else localStorage.setItem('aclib-current', JSON.stringify({...JSON.parse(localStorage.getItem('aclib-current')), stonecutter: recipe}));
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

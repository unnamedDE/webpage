
document.querySelector('#backButton').href = (new URL(window.location)).searchParams.get('back') ? (new URL(window.location)).searchParams.get('back') : ((new URL(window.location)).searchParams.get('notracking') != null ? '../?notracking' : '..');
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})


fetch('../idlist.json').then(res => res.json()).then(idlist => {
  const detailsContainerContent = document.querySelector('#detailsContainer div.content');
  const recipeInterface = document.querySelector('#recipeContainer > .recipeInterface');
  const exportContainer = document.querySelector('#exportContainer')
  const detailsCloseButton = detailsContainer.querySelector('.closeButton');
  const craftingMode = recipeInterface.querySelector('.craftingMode');
  const inputs = recipeInterface.querySelectorAll('.baseInput > span, .augmentInput > span');
  const outputs = recipeInterface.querySelectorAll('.output > span');
  const showFunctionBtn = exportContainer.querySelector('button.export.showFunction');
  const downloadPackBtn = exportContainer.querySelector('button.export.downloadPack');


  const recipeId = detailsContainerContent.querySelector('.default .id');
  const funcPath = detailsContainerContent.querySelector('.default .funcPath');
  const btnReset = detailsContainerContent.querySelector('.default .btn.reset');
  const btnShowAdvanced = detailsContainerContent.querySelector('.default .btn.showAdvanced');
  const advancedContainer = detailsContainerContent.querySelector('.default div.advanced');
  const mccodePath = detailsContainerContent.querySelector('.default div.advanced .mccodePath');
  const enableMccode = detailsContainerContent.querySelector('.default div.advanced #enableMccode');
  const enableMcscript = detailsContainerContent.querySelector('.default div.advanced #enableMcscript');
  const commandInputs = {
    init: detailsContainerContent.querySelector('.default div.advanced .commands .commandsInit'),
    craft: detailsContainerContent.querySelector('.default div.advanced .commands .commandsCraft'),
    cancel: detailsContainerContent.querySelector('.default div.advanced .commands .commandsCancel'),
  }
  const exportRecipeBtn = advancedContainer.querySelector('.btn.export');
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
    if(!localStorage.getItem('aclib-current')) localStorage.setItem('aclib-current', '{"advancedCrafter":{}}')
    if(!JSON.parse(localStorage.getItem('aclib-current')).advancedCrafter) localStorage.setItem('aclib-current', JSON.stringify({advancedCrafter: {}, ...JSON.parse(localStorage.getItem('aclib-current'))}));
    recipe = JSON.parse(localStorage.getItem('aclib-current')).advancedCrafter;
  }

  const idInput = detailsContainerContent.querySelector('.input input.id');
  const nbtInput = detailsContainerContent.querySelector('.input textarea.nbt');
  const keepSwitch = detailsContainerContent.querySelector('.input .keepSwitch > input[type="checkbox"]');


  const idOutput = detailsContainerContent.querySelector('.output input.id');
  const amountOutput = detailsContainerContent.querySelector('.output .amount');
  const nbtOutput = detailsContainerContent.querySelector('.output textarea.nbt');

  const craftingModeSelect = detailsContainerContent.querySelector('.craftingMode select.craftingModeSelect');
  const craftingModeId = detailsContainerContent.querySelector('.craftingMode .id');
  const craftingModeNbt = detailsContainerContent.querySelector('.craftingMode .nbt');

  updateLocalStorage();
  reloadRecipe();

  refreshDetails();


  inputs.forEach(input => input.addEventListener('click', () => {
    activeItem = input.dataset.item;
    [...inputs, ...outputs, craftingMode].forEach(e => e.classList.remove('active'));
    input.classList.add('active');
    refreshDetails();
  }));
  outputs.forEach(output => output.addEventListener('click', () => {
    activeItem = output.dataset.item;
    [...inputs, ...outputs, craftingMode].forEach(e => e.classList.remove('active'));
    output.classList.add('active');
    refreshDetails();
  }));
  craftingMode.addEventListener('click', () => {
    activeItem = 'craftingMode';
    [...inputs, ...outputs, craftingMode].forEach(e => e.classList.remove('active'));
    craftingMode.classList.add('active');
    refreshDetails();
  });

  detailsContainerContent.querySelector('.input .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.input input.id').value = '';
    detailsContainerContent.querySelector('.input textarea.nbt').value = '';
    detailsContainerContent.querySelector('.input .keepSwitch > input[type="checkbox"]').checked = false;
    [...inputs].find(e => e.dataset.item == activeItem).querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    delete recipe[activeItem];
  });
  detailsContainerContent.querySelector('.output .delete').addEventListener('click', () => {
    detailsContainerContent.querySelector('.output input.id').value = '';
    detailsContainerContent.querySelector('.output input.amount').value = 1;
    detailsContainerContent.querySelector('.output .amount-display').innerText = 1;
    detailsContainerContent.querySelector('.output textarea.nbt').value = '';
    [...outputs].find(e => e.dataset.item == activeItem).querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    // console.log(recipe);
    delete recipe[activeItem];
    // console.log(recipe);
  });
  exportRecipeBtn.addEventListener('click', () => {
    console.log(recipe);
    download(`recipeexport-${recipe.id}.json`, JSON.stringify(recipe, undefined, '\t'));
  });

  detailsCloseButton.addEventListener('click', () => {
    activeItem = '';
    [...inputs, ...outputs, craftingMode].forEach(e => e.classList.remove('active'));
    refreshDetails();
  });

  showFunctionBtn.addEventListener('click', () => {
    const mcfunctions = generateMcfunctions();
    if(mcfunctions == false) return;
    const modal = document.querySelector('div#showMcfunction.modal');
    const outputs = modal.querySelectorAll('.outputs textarea.output');
    const instructions = modal.querySelector('.instructions');
    instructions.querySelectorAll('.path').forEach(e => e.innerText = mcfunctions[5].funcPath);
    instructions.querySelectorAll('.foldername').forEach(e => e.innerText = /\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop());


    [...outputs].forEach((e, i) => {
      e.value = mcfunctions[i];
    });
    modal.querySelector('.downloadBtn').onclick = () => {
      // download(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}.mcfuntion`, mcfunctions[0]);
      // download('1.mcfunction', mcfunctions[1]);
      // download('2.mcfunction', mcfunctions[2]);
      // download('3.mcfunction', mcfunctions[3]);
      // console.log('download');
      const zip = new JSZip();
      zip
        .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}.mcfuntion`, mcfunctions[0])
        .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/1.mcfuntion`, mcfunctions[1])
        .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/2.mcfuntion`, mcfunctions[2])
        .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/3.mcfuntion`, mcfunctions[3])
        .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/4.mcfuntion`, mcfunctions[4])

      zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
        .then((content) => {
          const el = document.createElement('a');
          el.href = "data:application/zip;base64,"+content;
          el.download = `recipe-${mcfunctions[5].id}.zip`
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        });
    }


    $('div#showMcfunction.modal').modal();
  });
  downloadPackBtn.addEventListener('click', () => {
    const mcfunctions = generateMcfunctions();
    if(mcfunctions == false) return;

    const zip = new JSZip();
    zip
      .file('pack.mcmeta', '{"pack": {"pack_format": 5,"description": "Datapack generated by ac-lib generator (unnamedDE.tk)"}}')
      // .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}.mcfuntion`, mcfunctions[0])
      // .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/1.mcfuntion`, mcfunctions[1])
      // .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/2.mcfuntion`, mcfunctions[2])
      // .file(`${/\//.test(mcfunctions[5].funcPath) ? mcfunctions[5].funcPath.split('/').pop() : mcfunctions[5].funcPath.split(':').pop()}/3.mcfuntion`, mcfunctions[3])
      .folder('data')
      .file('ac_lib/tags/functions/advanced_crafter_recipes.json', `{"values":["${mcfunctions[5].funcPath}"]}`)
      .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '.mcfunction', mcfunctions[0])
      .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/1.mcfunction', mcfunctions[1])
      .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/2.mcfunction', mcfunctions[2])
      .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/3.mcfunction', mcfunctions[3])
      .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/4.mcfunction', mcfunctions[4]);

      JSZipUtils.getBinaryContent("../imgs/pack-icons/advanced_crafter.png", function (err, data) {
      if(err) {
        throw err; // or handle the error
      }
      zip.file("pack.png", data, {binary:true});


        zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
          .then((content) => {
            const el = document.createElement('a');
            el.href = "data:application/zip;base64,"+content;
            el.download = `recipe-${mcfunctions[5].id}.zip`
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
          });
        });
  });


  recipeId.addEventListener('input', e => {
    recipe.id = recipeId.value;
    updateLocalStorage();
  });
  funcPath.addEventListener('input', () => {
    recipe.funcPath = funcPath.value;
    updateLocalStorage();
  });
  mccodePath.addEventListener('input', () => {
    recipe.mccodePath = mccodePath.value;
    updateLocalStorage();
  });
  for(let [cmd, obj] of Object.entries(commandInputs)) {
    obj.addEventListener('input', () => {
      if(!recipe.commands) recipe.commands = {};
      recipe.commands[cmd] = obj.value.split('\n');
      updateLocalStorage();
    });
  }
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
  btnShowAdvanced.addEventListener('click', () => {
    if(/\bhidden\b/.test(advancedContainer.classList)) {
      advancedContainer.classList.remove('hidden');
      btnShowAdvanced.querySelector('i.fas').classList.remove('fa-caret-down');
      btnShowAdvanced.querySelector('i.fas').classList.add('fa-caret-up');
    } else {
      advancedContainer.classList.add('hidden');
      btnShowAdvanced.querySelector('i.fas').classList.remove('fa-caret-up');
      btnShowAdvanced.querySelector('i.fas').classList.add('fa-caret-down');
    }
  });
  enableMccode.addEventListener('change', () => {
    if([enableMccode, enableMcscript].some(e => e.checked)) mccodePath.disabled = false;
    else mccodePath.disabled = true;
    if(enableMccode.checked) btnShowMccode.classList.remove('hidden');
    else btnShowMccode.classList.add('hidden');
  });
  enableMcscript.addEventListener('change', () => {
    if([enableMcscript, enableMcscript].some(e => e.checked)) mccodePath.disabled = false;
    else mccodePath.disabled = true;
    if(enableMcscript.checked) btnShowMcscript.classList.remove('hidden');
    else btnShowMcscript.classList.add('hidden');
  });

  [...inputs, ...outputs].forEach(e => {
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
      const from = [...inputs, ...outputs].find(e => /dragging/.test(e.classList));
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
        if(/^in\d{1,2}$/.test(activeItem)) detailsContainerContent.querySelector('.input .delete').click();
        if(/^out\d$/.test(activeItem)) detailsContainerContent.querySelector('.output .delete').click();
        // if(activeItem == 'craftingMode') craftingModeSelect.value = 'default';
        detailsCloseButton.click();
      }
    }
  })


  const btnShowMccode = exportContainer.querySelector('.btn.export.showMccode');
  const btnShowMcscript = exportContainer.querySelector('.btn.export.showMcscript');

  btnShowMcscript.addEventListener('click', () => {
    saveInputs(activeItem);
    const mcscript = generateMcscript();
    if(!mcscript) return;
    const fixedRecipe = correctAdvancedCrafterRecipe(recipe);
    if(!fixedRecipe) return;
    const modal = document.querySelector('div#showMccode.modal');
    [...modal.querySelectorAll('span.type')].forEach(e => e.innerText = 'MCscript');
    [...modal.querySelectorAll('span.path')].forEach(e => e.innerText = fixedRecipe.funcPath);

    modal.querySelector('textarea.output').value = mcscript;

    modal.querySelector('.downloadBtn').onclick = () => download(`${fixedRecipe.id}.mcscript`, mcscript);

    $('div#showMccode.modal').modal();
  });

  btnShowMccode.addEventListener('click', () => {
    saveInputs(activeItem);
    const mccode = generateMccode();
    if(!mccode) return;
    const fixedRecipe = correctAdvancedCrafterRecipe(recipe);
    if(!fixedRecipe) return;
    const modal = document.querySelector('div#showMccode.modal');
    [...modal.querySelectorAll('span.type')].forEach(e => e.innerText = 'MCcode');
    [...modal.querySelectorAll('span.path')].forEach(e => e.innerText = fixedRecipe.funcPath);

    modal.querySelector('textarea.output').value = mccode;

    modal.querySelector('.downloadBtn').onclick = () => download(`${fixedRecipe.id}.mccode`, mccode);

    $('div#showMccode.modal').modal();
  });





  [idInput, nbtInput, keepSwitch, idOutput, amountOutput, nbtOutput].forEach(e => e.addEventListener('input', () => {
    refreshItem();
    saveInputs(activeItem);
    updateLocalStorage();
  }));

  [idInput, nbtInput].forEach(e => {
    e.addEventListener('blur', () => {
      if(!idInput.value && !nbtInput.value && !keepSwitch.checked) delete recipe[activeItem];
    });
  });
  keepSwitch.addEventListener('change', () => {
    if(!idInput.value && !nbtInput.value && !keepSwitch.checked) delete recipe[activeItem];
  });
  [idOutput, nbtOutput].forEach(e => {
    e.addEventListener('blur', () => {
      if(!idOutput.value && !nbtOutput.value && amountOutput.value == 1) delete recipe[activeItem];
    });
  });
  amountOutput.addEventListener('change', () => {
    if(!idOutput.value && !nbtInput.value && amountOutput.value == 1) delete recipe[activeItem];
  });
  amountOutput.addEventListener('input', () => detailsContainerContent.querySelector('.output .amount-display').innerText = amountOutput.value);
  craftingModeSelect.addEventListener('change', () => {
    const img = craftingMode.querySelector('img.display');
    img.classList.remove('pixelated');
    craftingMode.querySelector('.nbt').classList.add('hidden');
    if(craftingModeSelect.value == 'custom') {
      craftingModeId.disabled = false;
      craftingModeNbt.disabled = false;
      recipe.craftingMode = {
        mode: 'custom',
        id: craftingModeId.value,
        nbt: craftingModeNbt.value,
      }
      const item = getItemById(/:/.test(craftingModeId.value) ? craftingModeId.value.replace(/ /g, '_') : `minecraft:${craftingModeId.value.replace(/ /g, '_')}`);
      const img = craftingMode.querySelector('img.display');
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');
    } else {
      craftingModeId.disabled = true;
      craftingModeNbt.disabled = true;
      if(craftingModeSelect.value == 'default') {
        recipe.craftingMode = {
          mode: 'default',
          id: 'minecraft:crafting_table',
          nbt: '{ac_lib:{craftingMode:"default"}}'
        }
        img.src = getItemById('minecraft:crafting_table').link;
      }
    }
    updateLocalStorage();
  });
  craftingModeId.addEventListener('input', () => {
    if(craftingModeId.value == '') {
      craftingMode.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      craftingMode.querySelector('.nbt').classList.add('hidden');
    } else {
      const item = getItemById(/:/.test(craftingModeId.value) ? craftingModeId.value.replace(/ /g, '_') : `minecraft:${craftingModeId.value.replace(/ /g, '_')}`);
      const img = craftingMode.querySelector('img.display');
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');
    }
    recipe.craftingMode.id = craftingModeId.value;
    updateLocalStorage();
  });
  craftingModeNbt.addEventListener('input', () => {
    if(craftingModeNbt.value == '') {
      craftingMode.querySelector('.nbt').classList.add('hidden');
    } else {
      craftingMode.querySelector('.nbt').classList.remove('hidden');
    }
    recipe.craftingMode.nbt = craftingModeNbt.value;
    updateLocalStorage();
  });




  function refreshItem() {
    if(/^in\d{1,2}$/.test(activeItem)) {
      if(idInput.value == '') {
        detailsContainerContent.querySelector('.input .itemName').innerText = 'None';
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.add('hidden');
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.keep').classList.add('hidden');
        return;
      }
      const item = getItemById(/:/.test(idInput.value) ? idInput.value.replace(/ /g, '_') : `minecraft:${idInput.value.replace(/ /g, '_')}`);
      detailsContainerContent.querySelector('.input .itemName').innerText = item.name;
      const img = [...inputs].find(e => e.dataset.item == activeItem).querySelector('img.display')
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');

      if(nbtInput.value == '') {
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.add('hidden');
      } else {
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.remove('hidden');
      }
      if(keepSwitch.checked) {
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.keep').classList.remove('hidden');
      } else {
        [...inputs].find(e => e.dataset.item == activeItem).querySelector('.keep').classList.add('hidden');
      }

    } else if(/^out\d$/.test(activeItem)) {

      if(idOutput.value == '') {
        detailsContainerContent.querySelector('.output .itemName').innerText = 'None';
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('span.amount').innerText = '';
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.add('hidden');
        return;
      }
      const item = getItemById(/:/.test(idOutput.value) ? idOutput.value.replace(/ /g, '_') : `minecraft:${idOutput.value.replace(/ /g, '_')}`);
      detailsContainerContent.querySelector('.output .itemName').innerText = item.name;
      const img = [...outputs].find(e => e.dataset.item == activeItem).querySelector('img.display');
      img.src = item.link;
      img.classList.remove('pixelated');
      if(item.type == 'item') img.classList.add('pixelated');
      if(amountOutput.value != 1) {
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('span.amount').innerText = amountOutput.value;
      } else {
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('span.amount').innerText = '';
      }
      if(nbtOutput.value == '') {
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.add('hidden');
      } else {
        [...outputs].find(e => e.dataset.item == activeItem).querySelector('.nbt').classList.remove('hidden');
      }
    }

  }

  function saveInputs(active) {
    if(/^in\d{1,2}$/.test(active)) {
      if(detailsContainerContent.querySelector('.input input.id').value || detailsContainerContent.querySelector('.input textarea.nbt').value || detailsContainerContent.querySelector('.input .keepSwitch > input[type="checkbox"]').checked) {
        recipe[active] = {
          id: detailsContainerContent.querySelector('.input input.id').value,
          nbt: detailsContainerContent.querySelector('.input textarea.nbt').value,
          keep: detailsContainerContent.querySelector('.input .keepSwitch > input[type="checkbox"]').checked,
        }
      } else delete recipe[active]
      updateLocalStorage();
    } else if(/^out\d{1,2}$/.test(active)) {
      if(detailsContainerContent.querySelector('.output input.id').value || detailsContainerContent.querySelector('.output textarea.nbt').value || detailsContainerContent.querySelector('.output .amount').value != 1) {
        recipe[active] = {
          id: detailsContainerContent.querySelector('.output input.id').value,
          amount: detailsContainerContent.querySelector('.output input.amount').value,
          nbt: detailsContainerContent.querySelector('.output textarea.nbt').value,
        }
      } else delete recipe[active]
      updateLocalStorage();
    }
  }



  function refreshDetails() {
    detailsCloseButton.classList.add('hidden');
    detailsContainerContent.querySelectorAll('#detailsContainer > div.content > div').forEach(e => e.classList.add('hidden'));
    if(oldActiveItem == '') {

    } else if(/^in\d{1,2}$/.test(oldActiveItem)) {
      saveInputs(oldActiveItem);
    } else if(/^out\d{1,2}$/.test(oldActiveItem)) {
      saveInputs(oldActiveItem);
    }
    if(activeItem == '') {

      detailsContainerContent.querySelector('.default').classList.remove('hidden');

    } else if(/^in\d{1,2}$/.test(activeItem)) {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.input').classList.remove('hidden');
      idInput.value = recipe[activeItem] && recipe[activeItem].id ? recipe[activeItem].id.replace(/ /g, '_') : '';
      nbtInput.value = recipe[activeItem] && recipe[activeItem].nbt ? recipe[activeItem].nbt : '';
      keepSwitch.checked = recipe[activeItem] && recipe[activeItem].keep ? recipe[activeItem].keep : false;

      refreshItem();

    } else if(/^out\d$/.test(activeItem)) {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.output').classList.remove('hidden');
      idOutput.value = recipe[activeItem] && recipe[activeItem].id ? recipe[activeItem].id.replace(/ /g, '_') : '';
      amountOutput.value = recipe[activeItem] && recipe[activeItem].amount ? recipe[activeItem].amount : 1;
      detailsContainerContent.querySelector('.output .amount-display').innerText = amountOutput.value;
      nbtOutput.value = recipe[activeItem] && recipe[activeItem].nbt ? recipe[activeItem].nbt : '';

      refreshItem();

    } else if(activeItem == 'craftingMode') {

      detailsCloseButton.classList.remove('hidden');
      detailsContainerContent.querySelector('.craftingMode').classList.remove('hidden');

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
    detailsContainerContent.querySelector('.default .id').value = recipe.id ? recipe.id : '';
    detailsContainerContent.querySelector('.default .funcPath').value = recipe.funcPath ? recipe.funcPath : '';
    detailsContainerContent.querySelector('.default .mccodePath').value = recipe.mccodePath ? recipe.mccodePath : '';
    craftingModeSelect.value = recipe.craftingMode ? (recipe.craftingMode.mode ? recipe.craftingMode.mode : 'custom') : 'default';
    craftingModeId.value = recipe.craftingMode && recipe.craftingMode.mode == 'custom' ? recipe.craftingMode.id : '';
    craftingModeNbt.value = recipe.craftingMode && recipe.craftingMode.mode == 'custom' ? recipe.craftingMode.nbt : '';
    if(recipe.craftingMode && recipe.craftingMode.mode == 'custom') {
      craftingModeId.disabled = false;
      craftingModeNbt.disabled = false;
    }
    const craftingModeItem = recipe.craftingMode ? getItemById(/:/.test(recipe.craftingMode.id) ? recipe.craftingMode.id.replace(/ /g, '_') : `minecraft:${recipe.craftingMode.id.replace(/ /g, '_')}`) : getItemById('minecraft:crafting_table');
    const craftingModeImg = craftingMode.querySelector('img.display');
    craftingModeImg.src = craftingModeItem.link;
    craftingModeImg.classList.remove('pixelated');
    if(craftingModeItem.type == 'item') craftingModeImg.classList.add('pixelated');
    for(let [cmd, obj] of Object.entries(commandInputs)) {
      obj.value = recipe.commands && recipe.commands[cmd] ? recipe.commands[cmd].join('\n') : '';
    }
    [...inputs, ...outputs].forEach(e => {
      if(recipe[e.dataset.item]) {
        const item = getItemById(/:/.test(recipe[e.dataset.item].id) ? recipe[e.dataset.item].id.replace(/ /g, '_') : `minecraft:${recipe[e.dataset.item].id.replace(/ /g, '_')}`);
        const img = e.querySelector('img.display');
        img.src = item.link;
        img.classList.remove('pixelated');
        if(item.type == 'item') img.classList.add('pixelated');
        if(!recipe[e.dataset.item].id) delete recipe[e.dataset.item];
        if(!recipe[e.dataset.item].nbt) recipe[e.dataset.item].nbt = '';
        if(/^in\d{1,2}$/.test(e.dataset.item)) {
          if(!recipe[e.dataset.item].keep) recipe[e.dataset.item].keep = false;
          if(recipe[e.dataset.item].keep) e.querySelector('.keep').classList.remove('hidden');
          else e.querySelector('.keep').classList.add('hidden')
        }
        if(/^out\d$/.test(e.dataset.item)) {
          if(!recipe[e.dataset.item].amount) recipe[e.dataset.item].amount = 1;
          if(recipe[e.dataset.item].amount == 1) e.querySelector('.amount').innerText = '';
          else e.querySelector('.amount').innerText = recipe[e.dataset.item].amount;
        }
        if(recipe[e.dataset.item].nbt != '' && recipe[e.dataset.item].nbt != '{}') e.querySelector('.nbt').classList.remove('hidden');
        else e.querySelector('.nbt').classList.add('hidden');
        updateLocalStorage();
      } else {
        e.querySelector('img.display').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      }
    });
    if(/^in\d{1,2}$/.test(activeItem)) {
      detailsContainerContent.querySelector('.input .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.input .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
      detailsContainerContent.querySelector('.input .inputs .nbt').value = recipe[activeItem] ? recipe[activeItem].nbt : '';
      detailsContainerContent.querySelector('.input .inputs .keepSwitch input').checked = recipe[activeItem] ? recipe[activeItem].keep : false;
    } else if(/^out\d$/.test(activeItem)) {
    detailsContainerContent.querySelector('.output .itemName').innerText = recipe[activeItem] ? getItemById(/:/.test(recipe[activeItem].id) ? recipe[activeItem].id : `minecraft:${recipe[activeItem].id}`).name : 'None';
      detailsContainerContent.querySelector('.output .inputs .id').value = recipe[activeItem] ? recipe[activeItem].id : '';
      detailsContainerContent.querySelector('.output .inputs .amount-display').innerText = recipe[activeItem] ? recipe[activeItem].amount : 1;
      detailsContainerContent.querySelector('.output .inputs .amount').value = recipe[activeItem] ? recipe[activeItem].amount : 1;
      detailsContainerContent.querySelector('.output .inputs .nbt').value = recipe[activeItem] ? recipe[activeItem].nbt : '';
    }
  }
  function updateLocalStorage() {
    if(projectId && projectRecipeId) {
      localStorage.setItem('aclib-projects', JSON.stringify(projects));
    }
    else localStorage.setItem('aclib-current', JSON.stringify({...JSON.parse(localStorage.getItem('aclib-current')), advancedCrafter: recipe}));
  }


  function generateMcfunctions() {
    saveInputs(activeItem);
    const fixedRecipe = correctAdvancedCrafterRecipe(recipe);
    const returns = advancedCrafterGenerateMcfunction(fixedRecipe, [...inputs].map(e => e.dataset.item), [...outputs].map(e => e.dataset.item));
    if(returns) sendInfo(`advancedCrafter&value2=mcfunction&value3=${encodeURIComponent(JSON.stringify(fixedRecipe))}`);
    return returns;
  }

  function generateMcscript() {
    saveInputs(activeItem);
    if(mccodePath.value == '') {
      sweetalert({
        title: "MCcode/MCscript path not set",
        text: "You have to set the MCcode/MCscript path to continue",
        type: "error"
      });
      return
    }
    if(funcPath.value == '') {
      sweetalert({
        title: "Function path not set",
        text: "You have to set the function path to continue",
        type: "error"
      });
      return
    }
    const fixedRecipe = correctAdvancedCrafterRecipe(recipe);
    sendInfo(`advanced-crafter&value2=mcscript&value3=${encodeURIComponent(JSON.stringify(fixedRecipe))}`);
    const slotNumbers = [1, 2, 3, 10, 11, 12, 19, 20, 21, 5, 14, 23, 7, 16, 25];
    const pieces = {
      setKeep: [],
      clearKeep: [],
    };
    [...inputs].map(e => e.dataset.item).forEach((e, i) => {
      if(fixedRecipe[e]) {
        pieces[e] = {
          normal: `'block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt.replace(/'/g, '\\\'')}}]}'${fixedRecipe[e].nbt != '{}' ? '' : ` && !'data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag'`}`.replace(/,tag:\{\}/, ''),
          inverted: `!'block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt.replace(/'/g, '\\\'')}}]}'`.replace(/,tag:\{\}/, ''),
          invertedNbt: fixedRecipe[e].nbt != '{}' ? '' : ` || 'data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag'`,
        }
        if(fixedRecipe[e].keep) {
          pieces.setKeep.push(`/tag @s add ac_lib_keep_${i}`);
          pieces.clearKeep.push(`/tag @s remove ac_lib_keep_${i}`);
        }
      } else {
        pieces[e] = {
          normal: `!'block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]}'`,
          inverted: `'block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]}'`,
          invertedNbt: ``,
        }
      }
    });
    [...outputs].map(e => e.dataset.item).forEach((e, i) => {
      if(fixedRecipe[e]) {
        pieces[e] = {
          clearItem: `/replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} minecraft:air`,
          nbt: `,tag:${fixedRecipe[e].nbt}}`.replace(/,tag:\{\}/, '').replace(/'/g, '\\\''),
        }
        pieces[e].main = ` && !'block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i+12]}b,Count:${fixedRecipe[e].amount}b,id:"${fixedRecipe[e].id}"${pieces[e].nbt}]}'`;
        pieces[e].setItem = `/replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} ${fixedRecipe[e].id + fixedRecipe[e].nbt.replace(/^\{\}$/, '')} ${fixedRecipe[e].amount}`;
        pieces[e].killItem = `/kill @e[type=minecraft:item,limit=1,sort=nearest,nbt={Item:{id:"${fixedRecipe[e].id}",Count:${fixedRecipe[e].amount}b,tag:${fixedRecipe[e].nbt}}}]`.replace(',tag:{}', '');
      } else {
        pieces[e] = {
          main: ``,
          setItem: ``,
          clearItem: ``,
          nbt: ``,
          killItem: ``,
        }
      }
    });

    return (
`#file: ${fixedRecipe.mccodePath}
if('entity @s[tag=!ac_lib_advanced_crafter_crafted]' && 'block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]}' && ${pieces.in0.normal.replace(/,tag:{}/g,"")} && ${pieces.in1.normal.replace(/,tag:{}/g,"")} && ${pieces.in2.normal.replace(/,tag:{}/g,"")} && ${pieces.in3.normal.replace(/,tag:{}/g,"")} && ${pieces.in4.normal.replace(/,tag:{}/g,"")} && ${pieces.in5.normal.replace(/,tag:{}/g,"")} && ${pieces.in6.normal.replace(/,tag:{}/g,"")} && ${pieces.in7.normal.replace(/,tag:{}/g,"")} && ${pieces.in8.normal.replace(/,tag:{}/g,"")} && ${pieces.in9.normal.replace(/,tag:{}/g,"")} && ${pieces.in10.normal.replace(/,tag:{}/g,"")} && ${pieces.in11.normal.replace(/,tag:{}/g,"")} && !'block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[12]}b}]}' && !'block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[13]}b}]}' && !'block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[14]}b}]}') {
  /function ${fixedRecipe.funcPath}/1
}
if('entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}]' && ${pieces.in0.normal.replace(/,tag:{}/g,"")} && ${pieces.in1.normal.replace(/,tag:{}/g,"")} && ${pieces.in2.normal.replace(/,tag:{}/g,"")} && ${pieces.in3.normal.replace(/,tag:{}/g,"")} && ${pieces.in4.normal.replace(/,tag:{}/g,"")} && ${pieces.in5.normal.replace(/,tag:{}/g,"")} && ${pieces.in6.normal.replace(/,tag:{}/g,"")} && ${pieces.in7.normal.replace(/,tag:{}/g,"")} && ${pieces.in8.normal.replace(/,tag:{}/g,"")} && ${pieces.in9.normal.replace(/,tag:{}/g,"")} && ${pieces.in10.normal.replace(/,tag:{}/g,"")} && ${pieces.in11.normal.replace(/,tag:{}/g,"") + pieces.out0.main + pieces.out1.main + pieces.out2.main}) {
  /function ${fixedRecipe.funcPath}/2
}
if('entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}]' && 'block ~ ~ ~ minecraft:barrel') {
  if(!'block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]}') {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in0.inverted.replace(/,tag:{}/g,"") + pieces.in0.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in1.inverted.replace(/,tag:{}/g,"") + pieces.in1.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in2.inverted.replace(/,tag:{}/g,"") + pieces.in2.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in3.inverted.replace(/,tag:{}/g,"") + pieces.in3.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in4.inverted.replace(/,tag:{}/g,"") + pieces.in4.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in5.inverted.replace(/,tag:{}/g,"") + pieces.in5.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in6.inverted.replace(/,tag:{}/g,"") + pieces.in6.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in7.inverted.replace(/,tag:{}/g,"") + pieces.in7.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in8.inverted.replace(/,tag:{}/g,"") + pieces.in8.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in9.inverted.replace(/,tag:{}/g,"") + pieces.in9.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in10.inverted.replace(/,tag:{}/g,"") + pieces.in10.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in11.inverted.replace(/,tag:{}/g,"") + pieces.in11.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
}

if('entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id},tag=ac_lib_advanced_crafter_destroy]') {
  /function ${fixedRecipe.funcPath}/4
}

#file: ${fixedRecipe.mccodePath}/1

${[pieces.out0.setItem, pieces.out1.setItem, pieces.out2.setItem].filter(e => e != '').join('\n')}${(fixedRecipe.commands && fixedRecipe.commands.init && fixedRecipe.commands.init.length > 0 ? '\n' + fixedRecipe.commands.init.join('\n') : '')}${(pieces.setKeep.length > 0 ? '\n' : '') + pieces.setKeep.join('\n')}
/tag @s add ac_lib_advanced_crafter_crafted
/tag @s add ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

#file: ${fixedRecipe.mccodePath}/2

/function ac_lib:advanced_crafter/crafted${(fixedRecipe.commands && fixedRecipe.commands.craft && fixedRecipe.commands.craft.length > 0 ? '\n' + fixedRecipe.commands.craft.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
/tag @s remove ac_lib_advanced_crafter_crafted
/tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

#file: ${fixedRecipe.mccodePath}/3

${[pieces.out0.clearItem, pieces.out1.clearItem, pieces.out2.clearItem].filter(e => e != '').join('\n')}${(fixedRecipe.commands && fixedRecipe.commands.cancel && fixedRecipe.commands.cancel.length > 0 ? '\n' + fixedRecipe.commands.cancel.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
/tag @s remove ac_lib_advanced_crafter_crafted
/tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

#file: ${fixedRecipe.mccodePath}/4

${[pieces.out0.killItem, pieces.out1.killItem, pieces.out2.killItem].filter(e => e != '').join('\n')}`
    )
  }

  function generateMccode() {
    saveInputs(activeItem);
    if(mccodePath.value == '') {
      sweetalert({
        title: "MCcode/MCscript path not set",
        text: "You have to set the MCcode/MCscript path to continue",
        type: "error"
      });
      return
    }
    if(funcPath.value == '') {
      sweetalert({
        title: "Function path not set",
        text: "You have to set the function path to continue",
        type: "error"
      });
      return
    }
    const fixedRecipe = correctAdvancedCrafterRecipe(recipe);
    sendInfo(`advanced-crafter&value2=mccode&value3=${encodeURIComponent(JSON.stringify(fixedRecipe))}`);
    const slotNumbers = [1, 2, 3, 10, 11, 12, 19, 20, 21, 5, 14, 23, 7, 16, 25];
    const pieces = {
      setKeep: [],
      clearKeep: [],
    };
    [...inputs].map(e => e.dataset.item).forEach((e, i) => {
      if(fixedRecipe[e]) {
        pieces[e] = {
          normal: `block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt}}]}${fixedRecipe[e].nbt != '{}' ? '' : ` && !data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag`}`.replace(/,tag:\{\}/g, ''),
          inverted: `!block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt}}]}`.replace(/,tag:\{\}/g, ''),
          invertedNbt: fixedRecipe[e].nbt != '{}' ? '' : ` || data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag`,
        }
        if(fixedRecipe[e].keep) {
          pieces.setKeep.push(`/tag @s add ac_lib_keep_${i}`);
          pieces.clearKeep.push(`/tag @s remove ac_lib_keep_${i}`);
        }
      } else {
        pieces[e] = {
          normal: `!block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]}`,
          inverted: `block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]}`,
          invertedNbt: ``,
        }
      }
    });
    [...outputs].map(e => e.dataset.item).forEach((e, i) => {
      if(fixedRecipe[e]) {
        pieces[e] = {
          clearItem: `/replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} minecraft:air`,
          nbt: `,tag:${fixedRecipe[e].nbt}}`.replace(/,tag:\{\}/, ''),
        }
        pieces[e].main = ` && !block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i+12]}b,Count:${fixedRecipe[e].amount}b,id:"${fixedRecipe[e].id}"${pieces[e].nbt}]}`;
        pieces[e].setItem = `/replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} ${fixedRecipe[e].id + fixedRecipe[e].nbt.replace(/^\{\}$/, '')} ${fixedRecipe[e].amount}`;
        pieces[e].killItem = `/kill @e[type=minecraft:item,limit=1,sort=nearest,nbt={Item:{id:"${fixedRecipe[e].id}",Count:${fixedRecipe[e].amount}b,tag:${fixedRecipe[e].nbt}}}]`.replace(',tag:{}', '');
      } else {
        pieces[e] = {
          main: ``,
          setItem: ``,
          clearItem: ``,
          nbt: ``,
          killItem: ``,
        }
      }
    });

    return (
`!file: ${fixedRecipe.mccodePath}
if(entity @s[tag=!ac_lib_advanced_crafter_crafted] && block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]} && ${pieces.in0.normal.replace(/,tag:{}/g,"")} && ${pieces.in1.normal.replace(/,tag:{}/g,"")} && ${pieces.in2.normal.replace(/,tag:{}/g,"")} && ${pieces.in3.normal.replace(/,tag:{}/g,"")} && ${pieces.in4.normal.replace(/,tag:{}/g,"")} && ${pieces.in5.normal.replace(/,tag:{}/g,"")} && ${pieces.in6.normal.replace(/,tag:{}/g,"")} && ${pieces.in7.normal.replace(/,tag:{}/g,"")} && ${pieces.in8.normal.replace(/,tag:{}/g,"")} && ${pieces.in9.normal.replace(/,tag:{}/g,"")} && ${pieces.in10.normal.replace(/,tag:{}/g,"")} && ${pieces.in11.normal.replace(/,tag:{}/g,"")} && !block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[12]}b}]} && !block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[13]}b}]} && !block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[14]}b}]}) {
  /function ${fixedRecipe.funcPath}/1
}
if(entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] && ${pieces.in0.normal.replace(/,tag:{}/g,"")} && ${pieces.in1.normal.replace(/,tag:{}/g,"")} && ${pieces.in2.normal.replace(/,tag:{}/g,"")} && ${pieces.in3.normal.replace(/,tag:{}/g,"")} && ${pieces.in4.normal.replace(/,tag:{}/g,"")} && ${pieces.in5.normal.replace(/,tag:{}/g,"")} && ${pieces.in6.normal.replace(/,tag:{}/g,"")} && ${pieces.in7.normal.replace(/,tag:{}/g,"")} && ${pieces.in8.normal.replace(/,tag:{}/g,"")} && ${pieces.in9.normal.replace(/,tag:{}/g,"")} && ${pieces.in10.normal.replace(/,tag:{}/g,"")} && ${pieces.in11.normal.replace(/,tag:{}/g,"") + pieces.out0.main + pieces.out1.main + pieces.out2.main}) {
  /function ${fixedRecipe.funcPath}/2
}
if(entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] && block ~ ~ ~ minecraft:barrel) {
  if(!block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in0.inverted.replace(/,tag:{}/g,"") + pieces.in0.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in1.inverted.replace(/,tag:{}/g,"") + pieces.in1.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in2.inverted.replace(/,tag:{}/g,"") + pieces.in2.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in3.inverted.replace(/,tag:{}/g,"") + pieces.in3.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in4.inverted.replace(/,tag:{}/g,"") + pieces.in4.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in5.inverted.replace(/,tag:{}/g,"") + pieces.in5.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in6.inverted.replace(/,tag:{}/g,"") + pieces.in6.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in7.inverted.replace(/,tag:{}/g,"") + pieces.in7.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in8.inverted.replace(/,tag:{}/g,"") + pieces.in8.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in9.inverted.replace(/,tag:{}/g,"") + pieces.in9.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in10.inverted.replace(/,tag:{}/g,"") + pieces.in10.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
  if(${pieces.in11.inverted.replace(/,tag:{}/g,"") + pieces.in11.invertedNbt}) {
    /function ${fixedRecipe.funcPath}/3
  }
}

if('entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id},tag=ac_lib_advanced_crafter_destroy]') {
  /function ${fixedRecipe.funcPath}/4
}

!file: ${fixedRecipe.mccodePath}/1

${[pieces.out0.setItem, pieces.out1.setItem, pieces.out2.setItem].filter(e => e != '').join('\n')}${(fixedRecipe.commands && fixedRecipe.commands.init && fixedRecipe.commands.init.length > 0 ? '\n' + fixedRecipe.commands.init.join('\n') : '')}${(pieces.setKeep.length > 0 ? '\n' : '') + pieces.setKeep.join('\n')}
/tag @s add ac_lib_advanced_crafter_crafted
/tag @s add ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

!file: ${fixedRecipe.mccodePath}/2

/function ac_lib:advanced_crafter/crafted${(fixedRecipe.commands && fixedRecipe.commands.init && fixedRecipe.commands.init.length > 0 ? '\n' + fixedRecipe.commands.init.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
/tag @s remove ac_lib_advanced_crafter_crafted
/tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

!file: ${fixedRecipe.mccodePath}/3

${[pieces.out0.clearItem, pieces.out1.clearItem, pieces.out2.clearItem].filter(e => e != '').join('\n')}${(fixedRecipe.commands && fixedRecipe.commands.init && fixedRecipe.commands.init.length > 0 ? '\n' + fixedRecipe.commands.init.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
/tag @s remove ac_lib_advanced_crafter_crafted
/tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}

#file: ${fixedRecipe.mccodePath}/4

${[pieces.out0.killItem, pieces.out1.killItem, pieces.out2.killItem].filter(e => e != '').join('\n')}`
    )
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

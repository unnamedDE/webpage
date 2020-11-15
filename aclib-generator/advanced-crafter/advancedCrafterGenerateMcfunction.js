function correctAdvancedCrafterRecipe(recipe) {
  const fixedRecipe = JSON.parse(JSON.stringify(recipe));
  for(let [key, value] of Object.entries(fixedRecipe)) {
    if(/^(?:in\d{1,2})|(?:out\d)$/.test(key)) {
      if(!value.id && !value.ignore) {
        delete fixedRecipe[key];
        continue;
      }
      if(!/:/.test(value.id)) value.id = `minecraft:${value.id}`;
      if(!/\{.*\}/.test(value.nbt)) value.nbt = `{${value.nbt}}`;
      value.id = value.id.replace(/ /g, '_');
    }
  }
  if(!fixedRecipe.id) return sweetalert({
    title: "ID not set",
    text: "You have to set the recipe ID to continue",
    type: "error"
  });
  else if(fixedRecipe.id.split('').some(e => !/[-_+.A-Za-z0-9]/.test(e))) return sweetalert({
    title: "Invalid ID",
    text: 'The recipe ID can only consist of "-_+.A-Za-z0-9"',
    type: "error"
  });
  if(!fixedRecipe.funcPath) fixedRecipe.funcPath = `aclib-recipes:${fixedRecipe.id}`;
  else if(!/:/.test(fixedRecipe.funcPath)) fixedRecipe.funcPath = `aclib-recipes:${fixedRecipe.funcPath}`;
  const countInputs = Object.entries(fixedRecipe).reduce((a, c) => /^in\d{1,2}$/.test(c[0]) ? a+1 : a, 0);
  const countOutputs = Object.entries(fixedRecipe).reduce((a, c) => /^out\d$/.test(c[0]) ? a+1 : a, 0);
  if(countInputs < 1 || countOutputs < 1) {
    sweetalert({
      title: "Missing input/output",
      text: 'Recipes need to have at least one input and one output',
      type: "error"
    });
    return false;
  }
  if(fixedRecipe.commands) for(let [key, value] of Object.entries(fixedRecipe.commands)) {
    fixedRecipe.commands[key] = value.map(e => /^\//.test(e) ? e.replace(/^\//, '') : e);
  }
  if(fixedRecipe.craftingMode) {
    if(!/:/.test(fixedRecipe.craftingMode.id)) fixedRecipe.craftingMode.id = `minecraft:${fixedRecipe.craftingMode.id}`;
    if(!/^\{.*\}$/.test(fixedRecipe.craftingMode.nbt)) fixedRecipe.craftingMode.nbt = `{${fixedRecipe.craftingMode.nbt}}`
  } else {
    fixedRecipe.craftingMode = {
      mode: 'default',
      id: 'minecraft:crafting_table',
      nbt: '{ac_lib:{craftingMode:"default"}}'
    }
  }
  fixedRecipe.funcPath = fixedRecipe.funcPath.toLowerCase();


  return fixedRecipe;
}

function advancedCrafterGenerateMcfunction(recipe, inputs, outputs) {
  function isTool(id) {
    if([
      'minecraft:flint_and_steel',
      'minecraft:fishing_rod',
      'minecraft:shears',
      'minecraft:shield',
      'minecraft:potion'
    ].indexOf(id) != -1) return true;
    if([
      '_sword',
      '_hoe',
      '_axe',
      '_pickaxe',
      '_shovel',
      '_helmet',
      '_chestplate',
      '_leggings',
      '_boots'
    ].find(e => new RegExp(e + '$').test(id))) return true;
    return false;
  }
  const fixedRecipe = correctAdvancedCrafterRecipe(recipe);

  if(!fixedRecipe) return false;
  let mcfunctionMain = '';
  let mcfunction1 = '';
  let mcfunction2 = '';
  let mcfunction3 = '';
  let mcfunction4 = '';
  const pieces = {
    setKeep: [],
    clearKeep: [],
  };


  const slotNumbers = [1, 2, 3, 10, 11, 12, 19, 20, 21, 5, 14, 23, 7, 16, 25];
  inputs.forEach((e, i) => {
    if(fixedRecipe[e]) {
      pieces[e] = {
        normal: `if block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt}}]} ${fixedRecipe[e].nbt != '{}' || isTool(fixedRecipe[e].id) ? '' : `unless data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag `}`.replace(/,tag:\{\}/g, ''),
        inverted: `unless block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b,id:"${fixedRecipe[e].id}",tag:${fixedRecipe[e].nbt}}]}`.replace(/,tag:\{\}/g, ''),
        invertedNbt: fixedRecipe[e].nbt != '{}' || isTool(fixedRecipe[e].id) ? '' : `\nexecute if entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] if block ~ ~ ~ minecraft:barrel if data block ~ ~ ~ Items[{Slot:${slotNumbers[i]}b}].tag run function ${fixedRecipe.funcPath}/3`,
      }
      pieces[e].cond3 = `\nexecute if entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] if block ~ ~ ~ minecraft:barrel ${pieces[e].inverted} run function ${fixedRecipe.funcPath}/3${pieces[e].invertedNbt}`;
      if(fixedRecipe[e].ignore) {
        pieces[e] = {
          normal: ``,
          inverted: ``,
          invertedNbt: ``,
          cond3: ``,
        }
      }
      if(fixedRecipe[e].keep) {
        pieces.setKeep.push(`tag @s add ac_lib_keep_${i}`);
        pieces.clearKeep.push(`tag @s remove ac_lib_keep_${i}`);
      }
    } else pieces[e] = {
      normal: `unless block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]} `,
      inverted: `if block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i]}b}]}`,
      invertedNbt: ``,
      cond3: ``,
    }
  });
  outputs.forEach((e, i) => {
    if(fixedRecipe[e] && !fixedRecipe[e].ignore) {
      pieces[e] = {
        clearItem: `replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} minecraft:air`,
        nbt: fixedRecipe[e].nbt != '{}' ? `,tag:${fixedRecipe[e].nbt}` : ``,
        notBlocked: `unless block ~ ~ ~ minecraft:barrel{Items:[{Slot: ${slotNumbers[i+12]}b}]} `
      }
      pieces[e].setItem = `replaceitem block ~ ~ ~ container.${slotNumbers[i+12]} ${fixedRecipe[e].id + pieces[e].nbt.replace(",tag:", "")} ${fixedRecipe[e].amount}`;
      pieces[e].check = `unless block ~ ~ ~ minecraft:barrel{Items:[{Slot:${slotNumbers[i+12]}b,Count:${fixedRecipe[e].amount}b,id:"${fixedRecipe[e].id}"${pieces[e].nbt}}]}`;
      pieces[e].killItem = `kill @e[type=minecraft:item,limit=1,sort=nearest,nbt={Item:{id:"${fixedRecipe[e].id}",Count:${fixedRecipe[e].amount}b,tag:${fixedRecipe[e].nbt}}}]`.replace(',tag:{}', '');
    } else pieces[e] = {
      setItem: ``,
      check: ``,
      clearItem: ``,
      nbt: ``,
      killItem: ``,
      notBlocked: ``,
    }
  });
  mcfunctionMain =
`execute if entity @s[tag=!ac_lib_advanced_crafter_crafted] if block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]} ${pieces.in0.normal + pieces.in1.normal + pieces.in2.normal + pieces.in3.normal + pieces.in4.normal + pieces.in5.normal + pieces.in6.normal + pieces.in7.normal + pieces.in8.normal + pieces.in9.normal + pieces.in10.normal + pieces.in11.normal + pieces.out0.notBlocked + pieces.out1.notBlocked + pieces.out2.notBlocked}run function ${fixedRecipe.funcPath}/1

execute if entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] ${pieces.in0.normal + pieces.in1.normal + pieces.in2.normal + pieces.in3.normal + pieces.in4.normal + pieces.in5.normal + pieces.in6.normal + pieces.in7.normal + pieces.in8.normal + pieces.in9.normal + pieces.in10.normal + pieces.in11.normal + pieces.out0.check + pieces.out1.check + pieces.out2.check} run function ${fixedRecipe.funcPath}/2

execute if entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id}] if block ~ ~ ~ minecraft:barrel unless block ~ ~ ~ minecraft:barrel{Items:[{Slot:9b,id:"${fixedRecipe.craftingMode.id}"${`,tag:${fixedRecipe.craftingMode.nbt}`.replace(',tag:{}', '')}}]} run function ${fixedRecipe.funcPath}/3${pieces.in0.invertedNbt}
${pieces.in0.cond3 + pieces.in1.cond3 + pieces.in2.cond3 + pieces.in3.cond3 + pieces.in4.cond3 + pieces.in5.cond3 + pieces.in6.cond3 + pieces.in7.cond3 + pieces.in8.cond3 + pieces.in9.cond3 + pieces.in10.cond3 + pieces.in11.cond3}

execute if entity @s[tag=ac_lib_advanced_crafter_crafted_${fixedRecipe.id},tag=ac_lib_advanced_crafter_destroy] run function ${fixedRecipe.funcPath}/4`;

mcfunction1 =
`${[pieces.out0.setItem, pieces.out1.setItem, pieces.out2.setItem].filter(e => e != '').join('\n')}${fixedRecipe.commands && fixedRecipe.commands.init && fixedRecipe.commands.init.length > 0 ? '\n' + fixedRecipe.commands.init.join('\n') : ''}${(pieces.setKeep.length > 0 ? '\n' : '') + pieces.setKeep.join('\n')}
tag @s add ac_lib_advanced_crafter_crafted
tag @s add ac_lib_advanced_crafter_crafted_${fixedRecipe.id}`;

mcfunction2 =
`function ac_lib:advanced_crafter/crafted${(fixedRecipe.commands && fixedRecipe.commands.craft && fixedRecipe.commands.craft.length > 0 ? '\n' + fixedRecipe.commands.craft.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
tag @s remove ac_lib_advanced_crafter_crafted
tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}`;

mcfunction3 =
`${pieces.out0.clearItem + pieces.out1.clearItem + pieces.out2.clearItem}${(fixedRecipe.commands && fixedRecipe.commands.cancel && fixedRecipe.commands.cancel.length > 0 ? '\n' + fixedRecipe.commands.cancel.join('\n') : '')}${(pieces.clearKeep.length > 0 ? '\n' : '') + pieces.clearKeep.join('\n')}
tag @s remove ac_lib_advanced_crafter_crafted
tag @s remove ac_lib_advanced_crafter_crafted_${fixedRecipe.id}`;

mcfunction4 = [pieces.out0.killItem + pieces.out1.killItem + pieces.out2.killItem].filter(e => e != '').join('\n');



  return [mcfunctionMain, mcfunction1, mcfunction2, mcfunction3, mcfunction4, fixedRecipe];
}

function sendInfo(info) {
  if((new URL(window.location)).searchParams.get('notracking') == null) {
    const sendInfo = new XMLHttpRequest();
    sendInfo.open('GET', 'https://maker.ifttt.com/trigger/usedAclibGenerator/with/key/dAUX3HMXPTv0Mbt0-Yvpim?value1=' + info, true)
    sendInfo.send();
  }
}

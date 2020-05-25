function craftingTableGenerate(recipe, requirePath) {
  const fixedRecipe = JSON.parse(JSON.stringify(recipe));
  for(let [key, value] of Object.entries(fixedRecipe)) {
    if(/^(?:in\d)|(?:out)$/.test(key)) {
      if(!value.id) {
        delete fixedRecipe[key];
        continue;
      }
      if(/^#/.test(value.id)) {
        value.tag = true;
        value.id = value.id.replace(/^#/, '');
      }
      if(!/:/.test(value.id)) value.id = `minecraft:${value.id}`;
      value.id = value.id.replace(/ /g, '_');
    }
  }
  if(!fixedRecipe.recipePath) {
    if(requirePath) {
      sweetalert({
        title: "Path not set",
        text: "You have to set the recipe path to continue",
        type: "error"
      });
      return false;
    } else {
      fixedRecipe.recipePath = 'aclib-recipes:recipe'
    }
  } else if(!/:/.test(fixedRecipe.recipePath)) fixedRecipe.recipePath = `aclib-recipes:${fixedRecipe.recipePath}`;
  if(fixedRecipe.recipePath) fixedRecipe.recipePath = fixedRecipe.recipePath.toLowerCase();
  const countInputs = Object.entries(fixedRecipe).reduce((a, c) => /^in\d$/.test(c[0]) ? a+1 : a, 0);
  if(countInputs < 1 || !fixedRecipe.out) {
    sweetalert({
      title: "Missing input/output",
      text: 'Recipes need to have at least one input and one output',
      type: "error"
    });
    return false;
  }
  if(!fixedRecipe.craftingMode) fixedRecipe.craftingMode = 'shaped';

  if(fixedRecipe.craftingMode == 'shapeless') {
    return [{
      type: 'minecraft:crafting_shapeless',
      group: fixedRecipe.group,
      ingredients: Object.entries(fixedRecipe).filter(e => /^in\d$/.test(e[0])).map(e => e[1].tag ? {tag: e[1].id} : {item: e[1].id}),
      result: {
        item: fixedRecipe.out.id,
        count: fixedRecipe.out.amount == 1 ? undefined : Number(fixedRecipe.out.amount),
      },
    }, fixedRecipe]
  } else {
    const keySymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let keys = Object.entries(fixedRecipe).filter(e => /^in\d$/.test(e[0])).map(e => ({...e[1], key: keySymbols[Number(e[0].replace(/^in(\d)$/, '$1'))]})).sort((a, b) => {
      if(a.key < b.key) return -1;
      if(a.key > b.key) return 1;
      return 0;
    });
    keys = keys.filter((e, i) => i == keys.indexOf(keys.find(ee => ee.id == e.id && ee.tag == e.tag)));
    let pattern = [[' ', ' ', ' '],
                               [' ', ' ', ' '],
                               [' ', ' ', ' ']];
    for(let i = 0; i < 9; i++) {
      const el = fixedRecipe[`in${i}`];
      if(el) pattern[Math.floor(i/3)][i%3] = keys.find(e => e.id == el.id && e.tag == el.tag).key;
    }
    const outputKey = {};
    keys.forEach(e => {
      if(e.tag) outputKey[e.key] = {tag: e.id};
      else outputKey[e.key] = {item: e.id};
    });
    // console.log(keys, pattern);
    if(fixedRecipe.craftingMode == 'shaped') {
      const columnsToRemove = [];
      for(let i = 0; i < 3; i++) {
        if([pattern[0][i], pattern[1][i], pattern[2][i]].every(e => e == ' ')) {
          columnsToRemove.push(i);
        }
      }
      columnsToRemove.reverse().forEach(e => {
        pattern[0].splice(e, 1);
        pattern[1].splice(e, 1);
        pattern[2].splice(e, 1);
      });
      // pattern = pattern.filter(e => !e.every(ee => ee == ' '));
    }
    const output = {
      type: 'minecraft:crafting_shaped',
      group: fixedRecipe.group,
      pattern: pattern.map(e => e.join('')),
      key: outputKey,
      result: {
        item: fixedRecipe.out.id,
        count: fixedRecipe.out.amount == 1 ? undefined : Number(fixedRecipe.out.amount),
      }
    }
    return [output, fixedRecipe];
  }

  return false;
}

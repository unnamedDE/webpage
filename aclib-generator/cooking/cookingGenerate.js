function cookingGenerate(recipe, requirePath) {
  const fixedRecipe = JSON.parse(JSON.stringify(recipe));
  for(let [key, value] of Object.entries(fixedRecipe)) {
    if(/^(?:in)|(?:out)$/.test(key)) {
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
    if(requirePath) sweetalert({
      title: "Path not set",
      text: "You have to set the recipe path to continue",
      type: "error"
    });
    return false;
  } else if(!/:/.test(fixedRecipe.recipePath)) fixedRecipe.recipePath = `aclib-recipes:${fixedRecipe.recipePath}`;
  if(fixedRecipe.recipePath) fixedRecipe.recipePath = fixedRecipe.recipePath.toLowerCase();
  if(!fixedRecipe.in || !fixedRecipe.out) {
    sweetalert({
      title: "Missing input/output",
      text: 'Recipes need to have at least one input and one output',
      type: "error"
    });
    return false;
  }
  if(!fixedRecipe.cookingTime) fixedRecipe.cookingTime = 200;
  fixedRecipe.cookingSpeed = {
    normal: Number(fixedRecipe.cookingTime),
    fast: Math.round(fixedRecipe.cookingTime/2),
    slow: fixedRecipe.cookingTime*3,
  }
  fixedRecipe.experience = Number(recipe.experience)
  // console.log(recipe);
  // console.log(fixedRecipe);
  const defaultRecipe = {
    type: 'minecraft:smelting',
    group: fixedRecipe.group,
    ingredient: {
      tag: fixedRecipe.in.tag ? fixedRecipe.in.id : undefined,
      item: !fixedRecipe.in.tag ? fixedRecipe.in.id : undefined,
    },
    result: fixedRecipe.out.id,
    experience: fixedRecipe.experience,
    cookingtime: fixedRecipe.cookingSpeed.normal,
  };
  return [fixedRecipe.craftingMode.furnace ? defaultRecipe : null, fixedRecipe.craftingMode.blast_furnace ? {...defaultRecipe, type: 'minecraft:blasting', cookingtime: fixedRecipe.craftingMode.adapt ? fixedRecipe.cookingSpeed.fast : fixedRecipe.cookingSpeed.normal} : null,  fixedRecipe.craftingMode.smoker ? {...defaultRecipe, type: 'minecraft:smoking', cookingtime: fixedRecipe.craftingMode.adapt ? fixedRecipe.cookingSpeed.fast : fixedRecipe.cookingSpeed.normal} : null, fixedRecipe.craftingMode.campfire ? {...defaultRecipe, type: 'minecraft:campfire_cooking', cookingtime: fixedRecipe.craftingMode.adapt ? fixedRecipe.cookingSpeed.slow : fixedRecipe.cookingSpeed.normal} : null, fixedRecipe]

}

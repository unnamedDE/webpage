let projects;
let project;

const notracking = (new URL(window.location)).searchParams.get('notracking') != null;
if(notracking) document.querySelector("#backButton").href = '../?notracking';

const recipeList = document.querySelector('#projectList');
const createRecipeBtn = document.querySelector('#createRecipe');
const createRecipeName = document.querySelector('#createRecipeName');
const createRecipeType = document.querySelector('#createRecipeType');
const downloadPackBtn = document.querySelector('button.btn#downloadPack');

function updateLocalStorage() {
  localStorage.setItem('aclib-projects', JSON.stringify(projects));
}


reloadRecipes();

function reloadRecipes() {
  projects = JSON.parse(localStorage.getItem('aclib-projects'));
  project = projects.find(e => e.id == (new URL(window.location)).searchParams.get('projectId'));
  if(project == undefined) document.body.innerText = 'An error occured!\nPlease go back and try again';

  document.querySelectorAll('span.projectName').forEach(e => e.innerText = project.name);

  Array.from(recipeList.children).forEach(e => {
    if(/\brecipeElement\b/.test(e.classList.value)) recipeList.removeChild(e);
  });
  if(!project.recipes) project.recipes = [];
  if(!project.recipeIdIndex) project.recipeIdIndex = 0;

  for(let i = 0; i < project.recipes.length; i++) {
    const recipeElement = document.createElement('span');
    recipeElement.classList = "list-group-item list-group-item-action recipeElement";
    recipeElement.dataset.id = project.recipes[i].id

    const nameElement = document.createElement('span');
    nameElement.classList.add("nameElement");
    nameElement.innerText = project.recipes[i].name;
    nameElement.addEventListener('click', () => {
      const link = document.createElement('a');
      if(project.recipes[i].type == 'advanced-crafter') link.href = `../advanced-crafter/?projectId=${project.id}&recipeId=${project.recipes[i].id}&back=..%2Fprojects%2F%3FprojectId%3D${project.id}${notracking ? '%26notracking&notracking' : ''}`;
      else if(project.recipes[i].type == 'crafting-table') link.href = `../crafting-table/?projectId=${project.id}&recipeId=${project.recipes[i].id}&back=..%2Fprojects%2F%3FprojectId%3D${project.id}${notracking ? '%26notracking&notracking' : ''}`;
      else if(project.recipes[i].type == 'cooking') link.href = `../cooking/?projectId=${project.id}&recipeId=${project.recipes[i].id}&back=..%2Fprojects%2F%3FprojectId%3D${project.id}${notracking ? '%26notracking&notracking' : ''}`;
      else if(project.recipes[i].type == 'stonecutter') link.href = `../stonecutter/?projectId=${project.id}&recipeId=${project.recipes[i].id}&back=..%2Fprojects%2F%3FprojectId%3D${project.id}${notracking ? '%26notracking&notracking' : ''}`;
      link.click();
    });
    recipeElement.appendChild(nameElement);
    const typeElement = document.createElement('span');
    typeElement.classList.add("typeElement");
    typeElement.innerText = project.recipes[i].type;
    recipeElement.appendChild(typeElement);
    const buttonElement = document.createElement('span');
    buttonElement.innerHTML =
    `<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
      <button type="button" class="btn btn-warning btn-rename">Rename</button>
      <div class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
          <button class="dropdown-item btn-delete">Delete recipe</button>
        </div>
      </div>
    </div>`;

    buttonElement.querySelector('.btn-rename').addEventListener('click', () => {
      // const project = project.recipes.find(e => (e.id || e.id==0) && e.id == project.recipes[i].id);
      const tooltip = document.createElement('input');
      tooltip.placeholder = 'New name';
      tooltip.classList.add('form-control');
      tooltip.style.width = '20vw';
      tooltip.style.zIndex = 10;
      buttonElement.appendChild(tooltip);
      const popper = Popper.createPopper(buttonElement.querySelector('.btn-rename'), tooltip);
      tooltip.focus();
      tooltip.addEventListener('keypress', e => {
        if(e.key != 'Enter') return;

        if(tooltip.value != "") {
          project.recipes.find(e => (e.id || e.id==0) && e.id == project.recipes[i].id).name = tooltip.value;
          updateLocalStorage();
          // localStorage.setItem('aclib-projects', JSON.stringify(project.recipes));
          reloadRecipes();
        }

        popper.destroy();
      });
      tooltip.addEventListener('blur', () => {
        popper.destroy();
        buttonElement.removeChild(tooltip);
      });
    });
    buttonElement.querySelector('.btn-delete').addEventListener('click', () => {
      console.log('delete');
      const recipe = project.recipes.find(e => e.id == project.recipes[i].id);
      project.recipes.splice(project.recipes.indexOf(recipe), 1);
      updateLocalStorage();
      // localStorage.setItem('aclib-projects', JSON.stringify(projects));
      reloadRecipes();
    });
    buttonElement.classList.add('recipeButton');
    recipeElement.appendChild(buttonElement);
    recipeList.insertBefore(recipeElement, Array.from(recipeList.childNodes).find(e => e.classList && /\bcreateRecipe\b/.test(e.classList.value)));
  }
}

createRecipeBtn.addEventListener('click', () => {
  const name = createRecipeName.value;
  if(!name) {
    const tooltip = document.createElement('span');
    tooltip.innerText = 'Name cannot be empty!';
    document.body.appendChild(tooltip)
    const popper = Popper.createPopper(createProjectName, tooltip);
    setTimeout(() => {
      popper.destroy();
      document.body.removeChild(tooltip);
    }, 2500)
    return;
  }
  const newRecipe = {
    id: project.recipeIdIndex++,
    name: name,
    type: createRecipeType.value,
    data: {},
  }
  project.recipes.push(newRecipe);
  updateLocalStorage();
  // localStorage.setItem('aclib-projects', JSON.stringify(projects));
  reloadRecipes();
});

downloadPackBtn.addEventListener('click', () => {
  sendInfo(`project&value2=downloadPack&value3=${encodeURIComponent(JSON.stringify(project))}`);
  const zip = new JSZip();
  zip
    .file('pack.mcmeta', '{"pack": {"pack_format": 5,"description": "Datapack generated by ac-lib generator (unnamedDE.tk)"}}')
    .folder('data');
  const advancedCrafterRecipes = [];
  let error = false;

  project.recipes.forEach(r => {
    if(r.type == 'advanced-crafter') {
      const mcfunctions = advancedCrafterGenerateMcfunction(correctAdvancedCrafterRecipe(r.data), ['in0','in1','in2','in3','in4','in5','in6','in7','in8','in9','in10','in11'], ['out0','out1','out2']);
      if(mcfunctions) {
        advancedCrafterRecipes.push(mcfunctions[5].funcPath);
        zip.folder('data')
        .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '.mcfunction', mcfunctions[0])
        .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/1.mcfunction', mcfunctions[1])
        .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/2.mcfunction', mcfunctions[2])
        .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/3.mcfunction', mcfunctions[3])
        .file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/4.mcfunction', mcfunctions[4]);
      }
    } else if(r.type == 'cooking') {
      const json = cookingGenerate(r.data);
      console.log(json);
      if(json) {
        if(json[4].craftingMode.furnace) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-smelting.json', JSON.stringify(json[0], undefined, '\t'));
        if(json[4].craftingMode.blast_furnace) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-blasting.json', JSON.stringify(json[1], undefined, '\t'));
        if(json[4].craftingMode.smoker) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-smoking.json', JSON.stringify(json[2], undefined, '\t'));
        if(json[4].craftingMode.campfire) zip.file('data/' + (/:/.test(json[4].recipePath) ? json[4].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[4].recipePath) + '-campfire_cooking.json', JSON.stringify(json[3], undefined, '\t'));
      }
    } else if(r.type == 'crafting-table') {
      const json = craftingTableGenerate(r.data, true);
      if(!json) return error = true;
      zip.file('data/' + (/:/.test(json[1].recipePath) ? json[1].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[1].recipePath) + '.json', JSON.stringify(json[0], undefined, '\t'));
    } else if(r.type == 'stonecutter') {
      const json = stonecutterGenerate(r.data, true);
      if(!json) return error = true;
      zip.file('data/' + (/:/.test(json[1].recipePath) ? json[1].recipePath.replace(':', '/recipes/') : 'aclib-recipe/recipes/' + json[1].recipePath) + '.json', JSON.stringify(json[0], undefined, '\t'));
    }
  });

  zip.folder('data').file('ac_lib/tags/functions/advanced_crafter_recipes.json', `{"values":${JSON.stringify(advancedCrafterRecipes)}}`);

  if(error) return;
  zip.generateAsync({type:"base64", comment: "Generated with ac-lib generator (unnamedDE.tk)"})
    .then((content) => {
      const el = document.createElement('a');
      el.href = "data:application/zip;base64,"+content;
      el.download = `project-${project.name}.zip`
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    });
});

/*
.file('ac_lib/tags/functions/advanced_crafter_recipes.json', `{"values":["${mcfunctions[5].funcPath}"]}`)
.file(mcfunctions[5].funcPath.replace(':', '/functions/') + '.mcfunction', mcfunctions[0])
.file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/1.mcfunction', mcfunctions[1])
.file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/2.mcfunction', mcfunctions[2])
.file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/3.mcfunction', mcfunctions[3])
.file(mcfunctions[5].funcPath.replace(':', '/functions/') + '/4.mcfunction', mcfunctions[4]);
*/


/*
`<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
  <button type="button" class="btn btn-warning btn-rename">Rename</button>
  <div class="btn-group" role="group">
    <button id="btnGroupDrop1" type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
    <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
      <button class="dropdown-item btn-delete">Delete project</button>
    </div>
  </div>
</div>`;
*/

function sweetalert(...args) {
  const ret = swal(...args);
  document.body.classList.remove('stop-scrolling');
  return ret;
}


if(localStorage.getItem('aclib-projects') == null) localStorage.setItem('aclib-projects', JSON.stringify([0]));

const projectList = document.querySelector('#projectList');
const createProjectBtn = document.querySelector('#createProject');
const createProjectName = document.querySelector('#createProjectName');
let projects = JSON.parse(localStorage.getItem('aclib-projects'));

const visitCraftingTableBtn = document.querySelector('#visitCraftingTable');
const visitStonecutterBtn = document.querySelector('#visitStonecutter');
const visitAdvancedCrafterBtn = document.querySelector('#visitAdvancedCrafter');
if((new URL(window.location)).searchParams.get('notracking') != null) {
  visitCraftingTableBtn.href += '?notracking';
  visitStonecutterBtn.href += '?notracking';
  visitAdvancedCrafterBtn.href += '?notracking';
}
const imgsAnimated = document.querySelectorAll('span.imgAnimated');
imgsAnimated.forEach(imgAnimated => {
  Array.from(imgAnimated.children).forEach(c => c.classList.add('hidden'));
  Array.from(imgAnimated.children)[0].classList.remove('hidden');
  let index = 1;
  setInterval(() => {
    Array.from(imgAnimated.children).forEach(c => c.classList.add('hidden'));
    Array.from(imgAnimated.children)[index++].classList.remove('hidden');
    if(index >= Array.from(imgAnimated.children).length) index = 0;
  }, 3000)
});

reloadProjects();

function reloadProjects() {
  projects = JSON.parse(localStorage.getItem('aclib-projects'));

  Array.from(projectList.children).forEach(e => {
    if(/\bprojectElement\b/.test(e.classList.value)) projectList.removeChild(e);
  });

  for(let i = 1; i < projects.length; i++) {
    const projectElement = document.createElement('span');
    projectElement.classList = "list-group-item list-group-item-action projectElement";
    projectElement.dataset.id = projects[i].id

    const nameElement = document.createElement('span');
    nameElement.classList.add("nameElement");
    nameElement.innerText = projects[i].name;
    nameElement.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = './projects/?projectId=' + projects[i].id + ((new URL(window.location)).searchParams.get('notracking') != null ? '&notracking' : '');
      link.click();
    });
    projectElement.appendChild(nameElement);
    const buttonElement = document.createElement('span');
    buttonElement.innerHTML = `<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
      <button type="button" class="btn btn-warning btn-rename">Rename</button>
      <div class="btn-group" role="group">
        <button id="btnGroupDrop1" type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
          <button class="dropdown-item btn-delete">Delete project</button>
        </div>
      </div>
    </div>`;
    buttonElement.querySelector('.btn-rename').addEventListener('click', () => {
      // const project = projects.find(e => (e.id || e.id==0) && e.id == projects[i].id);
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
          projects.find(e => (e.id || e.id==0) && e.id == projects[i].id).name = tooltip.value;
          localStorage.setItem('aclib-projects', JSON.stringify(projects));
          reloadProjects();
        }

        popper.destroy();
      });
      tooltip.addEventListener('blur', () => {
        popper.destroy();
        buttonElement.removeChild(tooltip);
      });
    });
    buttonElement.querySelector('.btn-delete').addEventListener('click', () => {
      const project = projects.find(e => (e.id || e.id==0) && e.id == projects[i].id);
      projects.splice(projects.indexOf(project), 1);
      localStorage.setItem('aclib-projects', JSON.stringify(projects));
      reloadProjects();
    });
    buttonElement.classList.add('projectButton');
    projectElement.appendChild(buttonElement);

    projectList.insertBefore(projectElement, Array.from(projectList.childNodes).find(e => e.children && e.children[1] && e.children[1].id == "createProject"))
  }
}

createProjectBtn.addEventListener('click', () => {
  const name = createProjectName.value;
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
  const newProject = {
    id: projects[0]++,
    name: name
  }
  projects.push(newProject);
  localStorage.setItem('aclib-projects', JSON.stringify(projects));
  reloadProjects();
})

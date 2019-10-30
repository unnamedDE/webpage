const sltType = document.querySelector('#type');
const sltName = document.querySelector('#name');
const sltVersion = document.querySelector('#version');
const btnDownload = document.querySelector('#btnDownload');
let downloadInfo = { };
let parameterInfo = {download: false};

sltTypeChange();
sltType.addEventListener('change', sltTypeChange);

sltType.addEventListener('change', changedInput);
sltName.addEventListener('change', changedInput);
sltVersion.addEventListener('change', changedInput);

function sltTypeChange() {
  if(sltType.value === 'datapack') {
    type('datapacks')
  } else if(sltType.value === 'resourcepack') {
    type('resourcepacks')
  } else {
    sltName.innerHTML = `<option selected disabled hidden value="none">Choose type first</option>`;
    sltName.disabled = true;
    sltVersion.innerHTML = `<option selected disabled hidden value="none">Choose name first</option>`;
    sltVersion.disabled = true;
    changedInput();
  }
}

btnDownload.addEventListener('click', () => {
  downloadFile(downloadInfo.download);
})

function changedInput() {
  if(sltType.value != 'none' && sltName.value != 'none' && sltVersion.value != 'none') {
    btnDownload.disabled = false;
  } else {
    btnDownload.disabled = true;
  }
}

async function type(type) {
  fetch('/' + type + '/list.json')
    .then(res => res.json())
    .then(packList => {
      sltName.innerHTML = `<option selected disabled hidden value="none">Choose pack name...</option>`;
      sltName.disabled = false;
      packList.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
      packList.forEach(e => {
        const el = document.createElement('option');
        el.innerHTML = e.name;
        el.value = e.id;
        sltName.appendChild(el);
      });
      sltName.addEventListener('change', () => {
        fetch(`/${type}/${packList.find(e => e.id === sltName.value).path}info.json`)
          .then(res => res.json())
          .then(packInfo => {
            console.log(packInfo);
            sltVersion.innerHTML = `<option selected disabled hidden value="none">Choose pack version...</option>`;
            sltVersion.disabled = false;
            packInfo.list.reverse().forEach(e => {
              const el = document.createElement('option');
              el.innerHTML = e.version;
              el.value = e.version;
              sltVersion.appendChild(el);
            });
            sltVersion.addEventListener('change', () => {
              downloadInfo = packInfo.list.find(e => e.version === sltVersion.value);
            });
          });
      });
    });
}

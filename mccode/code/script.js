const compile = require('./import/mccode/compileOnline.js');

const editor = ace.edit("editor");
const cbSaveLocal = document.querySelector('#cbSaveLocal');
const cbAutoCompile = document.querySelector('#cbAutoCompile');
const slcTheme = document.querySelector('#slcTheme');
const numFontSize = document.querySelector('#spFontSize input');

const btnCompile = document.querySelector('#btnCompile');
const inputFileDisplay = document.querySelector('#inputFile');
let outputFilesContainer = document.querySelector('#outputFiles');
let outputFileDisplays = [];

let inputFile = "";
const outputFiles = {};
let saveLocal = JSON.parse(localStorage.getItem('mccode-saveLocal'));
saveLocal = saveLocal == null ? true : saveLocal;
let editorInput = true;
let autoCompile = JSON.parse(localStorage.getItem('mccode-autoCompile'));
autoCompile = autoCompile == null ? false : autoCompile;
if(autoCompile) setTimeout(clickCompile, 100);

let fontSize = JSON.parse(localStorage.getItem('mccode-fontSize'));
fontSize = fontSize == null ? 12 : fontSize;
numFontSize.value = fontSize;
document.querySelector('#editor').style["font-size"] = fontSize + "px";

editor.setShowPrintMargin(false);
editor.setBehavioursEnabled(true);
editor.session.setUseSoftTabs(false);
editor.session.setMode("ace/mode/mccode");

if(!localStorage.getItem('mccode-saveLocal')) localStorage.setItem('mccode-saveLocal', "true")
else cbSaveLocal.checked = saveLocal;

if(!localStorage.getItem('mccode-autoCompile')) localStorage.setItem('mccode-autoCompile', "false")
else cbAutoCompile.checked = JSON.parse(localStorage.getItem('mccode-autoCompile'));

if(!localStorage.getItem('mccode-theme')) localStorage.setItem('mccode-theme', "monokai")
editor.setTheme("ace/theme/" + localStorage.getItem('mccode-theme'));

if(localStorage.getItem('mccode-saved') && saveLocal) {
  const savedValue = localStorage.getItem('mccode-saved');
  editor.session.setValue(savedValue);
  inputFile = savedValue;
}



cbSaveLocal.addEventListener('change', () => {
  localStorage.setItem('mccode-saveLocal', JSON.stringify(cbSaveLocal.checked));
  saveLocal = cbSaveLocal.checked;
});
cbAutoCompile.addEventListener('change', () => {
  localStorage.setItem('mccode-autoCompile', JSON.stringify(cbAutoCompile.checked));
  autoCompile = cbAutoCompile.checked;
});
slcTheme.addEventListener('change', () => {
  editor.setTheme("ace/theme/" + slcTheme.value);
});

editor.addEventListener('change', () => {
  const editorValue = editor.session.getValue();
  if(editorInput) inputFile = editorValue;
  if(saveLocal && editorInput) {
    localStorage.setItem('mccode-saved', editorValue);
  }
  if(autoCompile && editorInput) {
    clickCompile();
  }
});

numFontSize.addEventListener('change', () => {
  document.querySelector('#editor').style["font-size"] = numFontSize.value + "px";
  localStorage.setItem('mccode-fontSize', numFontSize.value.toString());
})

btnCompile.addEventListener('click', clickCompile);

inputFileDisplay.addEventListener('click', (e) => {
  if(!inputFileDisplay.classList.contains('active')) {
    editor.setReadOnly(false);
    editor.session.setMode("ace/mode/mccode");
    let activeDoc = document.querySelector('#outputFiles span.active');
    outputFiles[activeDoc.innerText] = editor.session.getValue();
    activeDoc.classList.remove('active');
    inputFileDisplay.classList.add('active');
    editor.session.setValue(inputFile);
    editorInput = true;
  }
});

function clickCompile() {

  let files = compile(inputFile);
  outputFilesContainer.innerHTML = "";
  for(let i in files) {
    const e = document.createElement('span');
    e.innerText = files[i].path;
    if(!Array.from(outputFilesContainer.children).some(ee => ee.innerText == files[i].path)) outputFilesContainer.appendChild(e);
    outputFiles[files[i].path] = files[i].content;
  }

  outputFileDisplays = document.querySelectorAll('#outputFiles span');

  for(let outputFileDisplay of outputFileDisplays) {
    outputFileDisplay.addEventListener('click', () => {
      editorInput = false;
      if(!outputFileDisplay.classList.contains('active')) {
        editor.setReadOnly(true);
        editor.session.setMode("ace/mode/mcfunction");
        let activeDoc = document.querySelector('#outputFiles span.active') || document.querySelector('#inputFile.active');
        if(activeDoc.id == "inputFile") {
          inputFile = editor.session.getValue();
        } else {
          outputFiles[activeDoc.innerText] = editor.session.getValue();
        }
        activeDoc.classList.remove('active');
        outputFileDisplay.classList.add('active');
        editor.session.setValue(outputFiles[outputFileDisplay.innerText] || "");
      }
    });
  }

}

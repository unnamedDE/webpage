var md = new Remarkable({
    breaks: true,
});

function convert() {
  var input = document.getElementById('txt_input').value;
  var output = md.render(input);
  document.getElementById('txt_output').value = output;
}

function credit() {
  let element = document.createElement('a');
  element.setAttribute('href', 'https://ourcodeworld.com/articles/read/396/how-to-convert-markdown-to-html-in-javascript-using-remarkable');
  element.setAttribute('target', '_blank')
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

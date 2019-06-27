var md = new Remarkable({
    breaks: true,
});

function convert() {
  var input = document.getElementById('txt_input').value;
  var output = md.render(input);
  document.getElementById('txt_output').value = output;
}

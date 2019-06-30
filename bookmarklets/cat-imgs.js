var imgs = document.getElementsByTagName('img');
for(let i = 0; i < imgs.length; i++) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.thecatapi.com/v1/images/search', true)
  xhr.onload = function() {
    imgs[i].src = JSON.parse(this.response)[0].url;
  }
  xhr.send();
}

window.addEventListener('load', () => {
  let style = document.createElement('link');
  style.rel = "stylesheet";
  style.href = "../import/style.css";
  document.querySelector('head').appendChild(style)
  document.querySelector('body').innerHTML = `
  <a id="button_back" href=".." title="Go to Home"><i class="fas fa-chevron-left"></i></a>
  <div class="contact-button animated flash" onclick="click_contact();" title="expand contact options"></div>
  <div class="social-button animated flash" onclick="click_social();" title="expand social options"></div>

  <div id="header">
    <h1 class="animated fadeInDown">Custom Loot - Datapack</h1>
  </div>
  <div id="container">
    <div class="container-item">
      <span>Name</span>
      <span>Version</span>
      <span>Description / Changelog</span>
      <span><i class="fas fa-arrow-circle-down"></i></span>
    </div>
    <div id="latest-version-container">
      <a id="wiki" href="./wiki" title="Visit the wiki"><i class="fab fa-wikipedia-w"></i></a>
      <a id="latest-version" href="#" title="Click to download">Download the latest Version</a>
      <a id="pmc" href="#" title="Visit the pack on Planetminecraft"><img src="/import/global/img/planetminecraft.png" alt="PMC" style="height: 45px;"></a>
    </div>
  </div>`
  addButtons();
  fetch('./info.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      // console.log(JSON.stringify(myJson));
      let info = myJson;
      for(let i = 0; i < info.list.length; i++) {
        let pack = document.createElement('div');
        document.querySelector('a#latest-version').href = info.list[info.list.length - 1].download;
        document.querySelector('a#latest-version').download = info.list[i].id + ".zip";
        document.querySelector('a#pmc').href = info.pmc;
        pack.classList.add('container-item');
        pack.innerHTML = `<span>` + info.list[i].name + `</span>
        <span>` + info.list[i].version + `</span>
        <span>` + info.list[i].description + `</span>
        <span title="Click to download"><a href="` + info.list[i].download + `" download="` + info.list[i].id +  `.zip"><i class="fas fa-arrow-circle-down download"></i></a></span>`
      // insertAfter(pack, document.querySelector('.container-item'))
      insertAfter(pack, document.querySelector('#latest-version-container'));
      }
      document.querySelector('#latest-version').href = info.list[info.list.length - 1].download;
      document.querySelector('#latest-version').download = info.list[info.list.length - 1].id + ".zip";
      return info = myJson;
  });
});

function addButtons() {
  if(document.querySelector('.contact-button'))
    document.querySelector('.contact-button').innerHTML = "<i class=\"fas fa-comment-alt\" id=\"contact-icon\"></i><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/discord\" target=\"_blank\" rel=\"nofollow\" title=\"Discord\"><i class=\"fab fa-discord\"></i></a><a hidden class=\"contact-point\" href=\"mailto:admin@unnamedDE.tk?subject=Contact\" title=\"Email\"><i class=\"fas fa-envelope\"></i></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/curseforge\" target=\"_blank\" rel=\"nofollow\" title=\"Curseforge\"><div></div></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/planetminecraft\" target=\"_blank\" rel=\"nofollow\" title=\"Planetminecraft\"><div></div></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/github\" target=\"_blank\" rel=\"nofollow\" title=\"GitHub\"><i class=\"fab fa-github\"></i></a>";
  if(document.querySelector('.social-button'))
    document.querySelector('.social-button').innerHTML = "<i class=\"fas fa-share-alt\" id=\"social-icon\"></i><a hidden class=\"social-point\" href=\"https://wa.me/?text=" + encodeURIComponent('Check out these cool minecraft online tools made by unnamedDE.\nClick on ' + window.location.href + ' to check out these tools!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Whatsapp\"><i class=\"fab fa-whatsapp\"></i></a><a hidden class=\"social-point\" href=\"mailto:?subject=" + encodeURIComponent('Check out these cool minecraft tools I found online!') + "&amp;body=" + encodeURIComponent('Check out these tools made by unnamedDE\nClick on ' + window.location.href) + "\" title=\"Email\"><i class=\"fas fa-envelope\"></i></a><a hidden class=\"social-point\" href=\"https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent('Check out these cool minecraft tools I found online') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Twitter\"><i class=\"fab fa-twitter\"></i></a><a hidden class=\"social-point\" href=\"sms:?body=" + encodeURIComponent('Check out these cool minecraft tools I found online. Click ' + window.location.href + ' to visit the website!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"SMS\"><i class=\"fas fa-sms\"></i></a><a hidden class=\"social-point\" href=\"https://www.facebook.com/sharer.php?u=" + encodeURIComponent('Check out these cool minecraft tools I found online. Click ' + window.location.href + ' to visit the website!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Facebook\"><i class=\"fab fa-facebook\"></i></a>";
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
fetch('./info.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    let info = myJson;
    if(getParameter('download'))
      checkDownload(info)
    return info = myJson;
});

function checkDownload(info) {
  let request = decodeURIComponent(getParameter('download'));
  for (var i = 0; i < info.list.length; i++) {
    if(info.list[i].id == request || info.list[i].version == request) {
      downloadFile(info.list[i].download, info.list[i].id + ".zip");
      return;
    }
  }
  downloadFile(info.list[info.list.length - 1].download, info.list[info.list.length - 1].id + ".zip")
}

window.addEventListener('load', () => {
  fetch('./list.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(list) {

      list.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });

      for(let i = 0; i < list.length; i++) {
        let pack = document.createElement('div');
        pack.classList.add('container-item');
        fetch(list[i].path + 'info.json')
          .then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            // console.log(JSON.stringify(myJson));
            let info = {raw: myJson.list}
            for(let e = 0; e < info.raw.length; e++) {
              let item = info.raw[e];
              if(e == (info.raw.length - 1))
                info.lastVersion = item.version;
              if(list[i].description)
                info.description = list[i].description
              else if(e == 0)
                info.description = item.description
            }
            pack.innerHTML = `<span><a href="` + list[i].path + `">` + list[i].name + `</a></span>
            <span>` + info.lastVersion + `</span>
            <span>` + info.description + `</span>
            <span title="Click to download"><a href="` + list[i].path + `?download"><i class="fas fa-arrow-circle-down download"></i></a></span>`
            if(list[i].extra)
              pack.innerHTML += '\n<div>' + list[i].extra + '</div>';
            document.querySelector('#container').appendChild(pack);
        });
      }
    })
});

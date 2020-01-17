function getParameter(key) {
  var query = window.location.search.substring(1);
  var pairs = query.split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair[0] == key) {
      if (pair[1]) {
        if (pair[1].length > 0) {
          return decodeURI(pair[1]);
        }
      } else {
        return true
      }
    }
  }
  return undefined;
};
function replaceParameter(url, param, val) {
  const locParam = getParameter(param);
  if(!locParam) {
    if(url.split('?').length == 1) return `${url}?${param}=${val}`;
    return `${url}&${param}=${val}`;
  }
  if(locParam == true) return url.replace(new RegExp('(?<=\\?)' + param), param + '=' + val);
  return url.replace(new RegExp('(?<=\\?)' + param + '=' + locParam), param + '=' + val);
}

const presetContainer = document.querySelector('#preset-container');
const searchBox = document.querySelector('#search');

fetch('../list.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(list) {
    search();



    searchBox.addEventListener('input', search);
    function search() {
      const searched = list.filter(e => {
        let ret = true;
        const queries = searchBox.value.split(' ');
        queries.forEach(ee => {
          let isTag = false;
          if(/^#/.test(ee)) {
            ee = ee.replace(/^#/, '');
            isTag = true;
          }
          const r = new RegExp(ee.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
          if(!((r.test(e.name) && isTag == false) || ((r.test(e.author) && isTag == false) && (e.author != "unnamedDE" || searchBox.value.toLowerCase() == "unnamedde")) || e.keywords.map(eee => r.test(eee)).some(eee => eee == true))) ret = false;
        });
        return ret;
      });
      presetContainer.innerHTML = "";
      searched.forEach(e => {
        const img = document.createElement('img');
        img.src = `../presets/${e.id}/preview.png`;
        img.alt = e;
        img.classList.add('preset-image');
        const container = document.createElement('div');
        container.classList.add("preset-container");
        container.title = e.name;
        const text = document.createElement('h3');
        text.innerText = e.name;
        text.classList.add('preset-name');
        container.appendChild(text);
        container.appendChild(img);

        const tagContainer = document.createElement('div');
        tagContainer.classList.add('preset-tags');
        e.keywords.forEach((ee, i) => {
          const el = document.createElement('span');
          el.innerText = '#' + ee;
          el.classList.add('preset-tag');
          el.addEventListener('click', e => {
            window.location = replaceParameter(window.location.href, 's', '%23' + ee);
            e.preventDefault();
          });
          tagContainer.appendChild(el);
          if(i+1 != e.keywords.length) {
            const seperator = document.createElement('span');
            seperator.innerText = ",";
            seperator.classList.add('seperator')
            tagContainer.appendChild(seperator);
          }
        });



        container.appendChild(tagContainer);
        const link = document.createElement('a');
        link.appendChild(container);
        link.href = `../?preset=${e.id}`;
        link.classList.add('preset-link');
        presetContainer.appendChild(link);
      });
    }

    const searchParameter = getParameter('s');
    if(searchParameter && searchParameter != true) {
      searchBox.value = searchParameter.replace('%23', '#');
      search();
    }
  });

/*
loadAll();

function loadAll() {
  fetch('../list.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(list) {
      list.forEach(e => {
        const img = document.createElement('img');
        img.src = `../presets/${e.id}/preview.png`;
        img.alt = e;
        img.classList.add('preset-image');
        const container = document.createElement('div');
        container.classList.add("preset-container");
        container.title = e.name;
        const text = document.createElement('h3');
        text.innerText = e.name;
        text.classList.add('preset-name')
        container.appendChild(text);
        container.appendChild(img);
        const link = document.createElement('a');
        link.appendChild(container);
        link.href = `../?preset=${e.id}`
        link.classList.add('preset-link');
        presetContainer.appendChild(link);
      });
    });
}
*/

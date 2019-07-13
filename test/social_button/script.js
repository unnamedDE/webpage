var social_open = false
window.addEventListener('load', () => {
  const menu = document.querySelector('.social-button');

  menu.addEventListener('click', () => {
    const icon = document.querySelector('#social-icon');
    if(social_open == true) {
      social_open = false;

      menu.title = menu.title.replace(/hide/,"expand")
      menu.classList.remove('social-button-open')
      icon.classList.remove('fa-times')
      icon.classList.add('fa-share-alt')

      var menu_point = document.querySelectorAll(".social-point");
      for (let i = 0; i < menu_point.length; i++) {
          menu_point[i].classList.remove('social-point-open');
        setTimeout(function() {
          menu_point[i].hidden = true;
        }, 800)
      }
    } else {
      social_open = true;

      menu.title = menu.title.replace(/expand/,"hide")
      menu.classList.add('social-button-open');
      icon.classList.remove('fa-share-alt')
      icon.classList.add('fa-times')

      var menu_point = document.querySelectorAll(".social-point");
      for (let i = 0; i < menu_point.length; i++) {
        menu_point[i].hidden = false;
        setTimeout(function() {
          menu_point[i].classList.add('social-point-open');
        }, 200)
      }
    }
  });
})

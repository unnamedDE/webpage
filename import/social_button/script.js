
var menu_open = false;


function click_social() {
  const menu = document.getElementsByClassName('social-button');
  const icon = document.getElementById('social-icon');
  if(menu_open == true) {
    menu_open = false;

    menu[0].classList.remove('social-button-open')
    icon.classList.remove('fa-times')
    icon.classList.add('fa-share-alt')

    var menu_point = document.getElementsByClassName("social-point");
    for (let i = 0; i < menu_point.length; i++) {
        menu_point[i].classList.remove('social-point-open');
      setTimeout(function() {
        menu_point[i].hidden = true;
      }, 800)
    }
  } else {
    menu_open = true;

    menu[0].classList.add('social-button-open');
    icon.classList.remove('fa-share-alt')
    icon.classList.add('fa-times')

    var menu_point = document.getElementsByClassName("social-point");
    for (let i = 0; i < menu_point.length; i++) {
      menu_point[i].hidden = false;
      setTimeout(function() {
        menu_point[i].classList.add('social-point-open');
      }, 200)
    }
  }
}
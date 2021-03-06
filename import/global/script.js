
if(isMobile()) {
  let mobile_style = document.createElement('link');
  mobile_style.rel = "stylesheet";
  mobile_style.href = "/import/global/mobile.css";
  document.querySelector('head').appendChild(mobile_style);
}

var contact_open = false;
var social_open = false;

function click_contact() {
  const menu = document.getElementsByClassName('contact-button');
  const icon = document.getElementById('contact-icon');
  if(contact_open == true) {
    contact_open = false;

    menu[0].title = menu[0].title.replace(/hide/,"expand")
    menu[0].classList.remove('contact-button-open')
    icon.classList.remove('fa-times')
    // icon.classList.add('fa-share-alt')
    icon.classList.add('fa-comment-alt')

    var menu_point = document.getElementsByClassName("contact-point");
    for (let i = 0; i < menu_point.length; i++) {
        menu_point[i].classList.remove('contact-point-open');
      setTimeout(function() {
        menu_point[i].hidden = true;
      }, 800)
    }
  } else {
    contact_open = true;
    if(social_open == true) {
      document.querySelector('.social-button').click();
    }
    menu[0].title = menu[0].title.replace(/expand/,"hide")
    menu[0].classList.add('contact-button-open');
    // icon.classList.remove('fa-share-alt')
    icon.classList.remove('fa-comment-alt')
    icon.classList.add('fa-times')

    var menu_point = document.getElementsByClassName("contact-point");
    for (let i = 0; i < menu_point.length; i++) {
      menu_point[i].hidden = false;
      setTimeout(function() {
        menu_point[i].classList.add('contact-point-open');
      }, 200)
    }
  }
}

function click_social() {
  const menu = document.getElementsByClassName('social-button');
  const icon = document.getElementById('social-icon');
  if(social_open == true) {
    social_open = false;

    menu[0].title = menu[0].title.replace(/hide/,"expand")
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
    social_open = true;
    if(contact_open == true) {
      document.querySelector('.contact-button').click();
    }

    menu[0].title = menu[0].title.replace(/expand/,"hide")
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

function getParameter(key) {
  var query = window.location.search.substring(1);
  var pairs = query.split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if(pair[0] == key) {
      if(pair[1]) {
        if(pair[1].length > 0) {
          return decodeURI(pair[1]);
        }
      } else {
        return true
      }
    }
  }

  return undefined;
};
window.addEventListener('load', () => {
  if(document.querySelector('.contact-button'))
    document.querySelector('.contact-button').innerHTML = "<i class=\"fas fa-comment-alt\" id=\"contact-icon\"></i><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/discord\" target=\"_blank\" rel=\"nofollow\" title=\"Discord\"><i class=\"fab fa-discord\"></i></a><a hidden class=\"contact-point\" href=\"mailto:admin@unnamedDE.tk?subject=Contact\" title=\"Email\"><i class=\"fas fa-envelope\"></i></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/curseforge\" target=\"_blank\" rel=\"nofollow\" title=\"Curseforge\"><div></div></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/planetminecraft\" target=\"_blank\" rel=\"nofollow\" title=\"Planetminecraft\"><div></div></a><a hidden class=\"contact-point\" href=\"https://unnamedde.tk/github\" target=\"_blank\" rel=\"nofollow\" title=\"GitHub\"><i class=\"fab fa-github\"></i></a>";
})
window.addEventListener('load', () => {
  if(document.querySelector('.social-button'))
    document.querySelector('.social-button').innerHTML = "<i class=\"fas fa-share-alt\" id=\"social-icon\"></i><a hidden class=\"social-point\" href=\"https://wa.me/?text=" + encodeURIComponent('Check out these cool minecraft online tools made by unnamedDE.\nClick on ' + window.location.href + ' to check out these tools!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Whatsapp\"><i class=\"fab fa-whatsapp\"></i></a><a hidden class=\"social-point\" href=\"mailto:?subject=" + encodeURIComponent('Check out these cool minecraft tools I found online!') + "&amp;body=" + encodeURIComponent('Check out these tools made by unnamedDE\nClick on ' + window.location.href) + "\" title=\"Email\"><i class=\"fas fa-envelope\"></i></a><a hidden class=\"social-point\" href=\"https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent('Check out these cool minecraft tools I found online') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Twitter\"><i class=\"fab fa-twitter\"></i></a><a hidden class=\"social-point\" href=\"sms:?body=" + encodeURIComponent('Check out these cool minecraft tools I found online. Click ' + window.location.href + ' to visit the website!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"SMS\"><i class=\"fas fa-sms\"></i></a><a hidden class=\"social-point\" href=\"https://www.facebook.com/sharer.php?u=" + encodeURIComponent('Check out these cool minecraft tools I found online. Click ' + window.location.href + ' to visit the website!') + "\" target=\"_blank\" rel=\"nofollow\" title=\"Facebook\"><i class=\"fab fa-facebook\"></i></a>";
})

window.addEventListener('load', () => {
  // let whatsapp_button = document.querySelector('.whatsapp_button')
  // if(whatsapp_button) {
  //   if(/\W?mobile/i.test(navigator.userAgent) || /\W?android/i.test(navigator.userAgent) || isMobile()) {
  //     whatsapp_button.classList.add('whatsapp_button_active')
  //     whatsapp_button.classList.add('animated')
  //     whatsapp_button.classList.add('flash')
  //     let whatsapp_link = document.createElement('a')
  //     // whatsapp_link.href = "https://wa.me/?text=" + encodeURIComponent("Check out these cool minecraft online tools made by unnamedDE.\nClick on https://unnamedde.tk to check out these tools!")
  //     whatsapp_link.href = "whatsapp://send?text=" + encodeURIComponent("Check out these cool minecraft online tools made by unnamedDE.\nClick on https://unnamedde.tk to check out these tools!")
  //     // whatsapp_link.target = "_blank"
  //     whatsapp_link.innerHTML = "<i class=\"fab fa-whatsapp\"></i>"
  //     whatsapp_button.appendChild(whatsapp_link)
  //   }
  // }
  let whatsapp_button = document.querySelector('.social-button .social-point')
  if(whatsapp_button) {
    if(/\W?mobile/i.test(navigator.userAgent) || /\W?android/i.test(navigator.userAgent) || isMobile()) {
      whatsapp_button.href = "whatsapp://send?text=" + encodeURIComponent("Check out these cool minecraft online tools made by unnamedDE.\nClick on https://unnamedde.tk to check out these tools!")
    }
  }
})
function isMobile() {
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent)) {return true} else {return false}

}
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if ( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) { return 'iOS'; }

	else if ( userAgent.match( /Android/i ) ) { return 'Android'; }

	else { return 'unknown'; }
}

function downloadFile(file,filename) {
  console.log('download(' + filename + ')');
  let element = document.createElement('a');
  element.setAttribute('href', file);
  element.setAttribute('download', filename)
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

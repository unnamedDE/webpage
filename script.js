if(isMobile() && (window.innerHeight / 1.5 > window.innerWidth || window.innerWidth / 1.5 > window.innerHeight)) {
  let mobile_style = document.createElement('link');
  mobile_style.rel = "stylesheet";
  mobile_style.href = "mobile.css";
  document.querySelector('head').appendChild(mobile_style);
}

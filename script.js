if(isMobile()) {
  let mobile_style = document.createElement('link');
  mobile_style.rel = "stylesheet";
  mobile_style.href = "mobile.css";
  document.querySelector('head').appendChild(mobile_style);
}

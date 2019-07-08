window.addEventListener('load', () => {
  let viewport = document.createElement('meta');
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1.0";
  document.querySelector('head').appendChild(viewport);
  let style = document.createElement('link');
  style.rel = "stylesheet";
  style.href = "../import/redirect/style.css";
  document.querySelector('head').appendChild(style);
  let body = document.querySelector('body');
  body.innerHTML = `<div class="body">
    <span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </span>
    <div class="base">
      <span></span>
      <div class="face"></div>
    </div>
  </div>
  <div class="longfazers">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <h1>Redirecting...</h1>`
})

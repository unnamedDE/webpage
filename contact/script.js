particlesJS.load('particles-js', 'particles.json', function() {});

window.addEventListener('load', () => {
  let discord = document.querySelector('a[href="../discord/"]')
  discord.addEventListener('mouseover', () => {
    pause = true;
  })
  discord.addEventListener('mouseleave', () => {
    pause = false;
  })

  let links = document.querySelectorAll('#contact-list a');
  let pause = false;
  let radius = 300;
  for (var i = 0; i < links.length; i++) {
    let deg = 360 / links.length * i;
    let link = links[i];
    let rad = deg / 180 * Math.PI;
    let baseX = 5;
    let baseY = -45;
    link.style.left = Math.sin(rad) * radius + baseX + "px";
    link.style.bottom = Math.cos(rad) * radius + baseY  + "px";
    link.style.visibility = "visible";
    setInterval(function() {
      if(pause == false) {
        let rad = deg / 180 * Math.PI;
        link.style.left = Math.sin(rad) * radius + baseX + "px";
        link.style.bottom = Math.cos(rad) * radius + baseY + "px";
        link.addEventListener('mouseover', () => {
          pause = true;
        })
        link.addEventListener('mouseleave', () => {
          pause = false;
        })
        deg += 0.05;
      }
    }, 1)
  }
})

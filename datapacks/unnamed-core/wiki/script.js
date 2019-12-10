window.addEventListener('load', () => {

  const players = document.getElementById('players');
  const developers = document.getElementById('developers');
  const playerHighlight = document.getElementById('player-highlight');
  const developerHighlight = document.getElementById('developer-highlight');

  players.addEventListener('mouseover', () => {
    playerHighlight.classList.add('player-highlighted');
  });
  players.addEventListener('mouseleave', () => {
    playerHighlight.classList.remove('player-highlighted');
  });
  developers.addEventListener('mouseover', () => {
    developerHighlight.classList.add('developer-highlighted');
  });
  developers.addEventListener('mouseleave', () => {
    developerHighlight.classList.remove('developer-highlighted');
  });

});

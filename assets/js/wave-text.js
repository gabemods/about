document.querySelectorAll('.wave-text').forEach(function(p) {
  p.innerHTML = p.innerText.split(' ').map(function(word) {
    return '<span>' + word + '</span>';
  }).join(' ');
});
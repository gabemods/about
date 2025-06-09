  document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.scroll-container');
  const dots = document.querySelectorAll('.dot');
  const logo = document.querySelector('.logo');
  const profileImages = document.querySelectorAll('.card img');
  const overlay = document.getElementById('fullscreenOverlay');
  const fullscreenImg = document.getElementById('fullscreenImage');

  function updateDots() {
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }

  function fixHeight() {
    container.style.height = window.innerHeight + 'px';
    document.querySelectorAll('.page').forEach(p => {
      p.style.height = window.innerHeight + 'px';
    });
  }

  function handleLogoClick() {
    logo.classList.add('clicked');
    setTimeout(() => logo.classList.remove('clicked'), 200);
  }

  if (container) {
    container.addEventListener('scroll', updateDots);
  }

  if (logo) {
    logo.addEventListener('click', handleLogoClick);
  }

  window.addEventListener('resize', fixHeight);
  window.addEventListener('orientationchange', fixHeight);
  fixHeight();

  document.querySelector('.scroll-container').addEventListener('wheel', function (e) {
  e.preventDefault();
  this.scrollBy({
    left: e.deltaY,
    behavior: 'smooth'
  });
}, { passive: false });

    
  window.hideFullscreen = function () {
    if (overlay && fullscreenImg) {
      overlay.style.display = 'none';
      fullscreenImg.style.transform = 'scale(1)';
    }
  };
});

window.addEventListener('load', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, i * 100);
  });
});

window.addEventListener('orientationchange', () => {
  const cards = document.querySelectorAll('.card');
  const texts = document.querySelectorAll('.card h1, .card h2, .card h3, .card p');

  cards.forEach(card => {
    card.style.animation = 'none';
    card.offsetHeight; // trigger reflow
    card.style.animation = 'cardBounceIn 0.6s ease forwards';
  });

  texts.forEach((text, index) => {
    text.style.animation = 'none';
    text.offsetHeight; // trigger reflow
    text.style.animation = `fadeBounceIn 0.6s ease forwards`;
    text.style.animationDelay = `${0.1 + index * 0.05}s`;
  });
});

const body = document.body;

function duplicateScrollerContent() {
  document.querySelectorAll('.projects-row').forEach(row => {
    const inner = row.querySelector('.scroller-inner');
    if (!inner) return;

    const original = inner.querySelectorAll('.project-card');
    const originalHTML = Array.from(original).map(el => el.outerHTML).join('');

    inner.innerHTML = '';
    let filler = '';
    do {
      filler += originalHTML;
      inner.innerHTML = filler;
    } while (inner.scrollWidth < window.innerWidth * 2);
  });
}

window.addEventListener('resize', duplicateScrollerContent);
duplicateScrollerContent();

function applySystemTheme(e) {
  if (e.matches) body.classList.add('dark');
  else body.classList.remove('dark');
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDark);
prefersDark.addEventListener('change', applySystemTheme);

const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

duplicateScrollerContent();

const resumeTimers = {};

function setAnimationState(rowElement, state) {
  const inner = rowElement.querySelector('.scroller-inner');
  if (inner) {
    inner.style.animationPlayState = state;
  }
}

function pauseAutoScroll(rowId, duration = 5000) {
  const rowSelector = `.projects-row-${rowId}`;
  const rowElement = document.querySelector(rowSelector);
  if (!rowElement) return;
  
  setAnimationState(rowElement, 'paused');
  
  clearTimeout(resumeTimers[rowId]);
  
  resumeTimers[rowId] = setTimeout(() => {
    setAnimationState(rowElement, 'running');
  }, duration);
}

document.querySelectorAll('.scroll-btn').forEach(button => {
  button.addEventListener('click', () => {
    const rowId = button.getAttribute('data-row');
    const rowElement = document.querySelector(`.projects-row-${rowId}`);
    if (!rowElement) return;
    
    pauseAutoScroll(rowId, 5000);
    
    const CARD_SCROLL_AMOUNT = 350 + 24;
    const isNext = button.classList.contains('next-btn');
    const scrollAmount = CARD_SCROLL_AMOUNT * (isNext ? 1 : -1);
    
    rowElement.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
  });
});

const modal = document.getElementById("project-modal");
const modalLogo = modal.querySelector(".modal-logo img");
const modalTitle = modal.querySelector(".modal-title");
const modalDesc = modal.querySelector(".modal-description");
const modalWebsite = modal.querySelector(".modal-website");
const modalGithub = modal.querySelector(".modal-github");
const modalClose = modal.querySelector(".modal-close");

modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
});

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => {
    document.body.style.overflow = "hidden";
    
    const logo = card.querySelector("img").src;
    const title = card.querySelector("h3").innerText;
    const desc = card.querySelector("p").innerText;
    const websiteLink = card.querySelector("a") ? card.querySelector("a").href : null;
    const githubLink = card.classList.contains("project-discontinued") ?
      card.querySelector("a") ? card.querySelector("a").href : null :
      null;
    
    modalLogo.src = logo;
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    
    if (card.classList.contains("project-discontinued")) {
      modalWebsite.style.display = "none";
      modalGithub.style.display = githubLink ? "inline-block" : "none";
      if (githubLink) modalGithub.href = githubLink;
    } else {
      modalWebsite.style.display = websiteLink ? "inline-block" : "none";
      modalGithub.style.display = "none";
      if (websiteLink) modalWebsite.href = websiteLink;
    }
    
    modal.classList.add("active");
  });
});

function pauseAllScrollers() {
  document.querySelectorAll(".scroller-inner").forEach(inner => {
    inner.style.animationPlayState = "paused";
  });
}

function resumeAllScrollers() {
  document.querySelectorAll(".scroller-inner").forEach(inner => {
    inner.style.animationPlayState = "running";
  });
}

modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
  resumeAllScrollers();
});

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => {
    document.body.style.overflow = "hidden";
    pauseAllScrollers();
  });
});
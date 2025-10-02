const body = document.body;

function attachProjectCardListeners() {
  const modal = document.getElementById("project-modal");
  const modalLogo = modal.querySelector(".modal-logo img");
  const modalTitle = modal.querySelector(".modal-title");
  const modalDesc = modal.querySelector(".modal-description");
  const modalWebsite = modal.querySelector(".modal-website");
  const modalGithub = modal.querySelector(".modal-github");
  const modalClose = modal.querySelector(".modal-close");

  document.querySelectorAll(".project-card").forEach(card => {

    card.removeEventListener("click", openProjectModal);
    card.addEventListener("click", openProjectModal);
  });

  function openProjectModal(event) {

    if (event.target.closest('a')) {
        return; 
    }

    const card = event.currentTarget;

    document.body.style.overflow = "hidden";
    pauseAllScrollers();

    const logo = card.querySelector("img").src;
    const title = card.querySelector("h3").innerText;
    const desc = card.querySelector("p").innerText;
    const websiteLinkElement = card.querySelector("a");
    const websiteLink = websiteLinkElement ? websiteLinkElement.href : null;

    const isDiscontinued = card.classList.contains("project-discontinued");

    const githubLink = isDiscontinued ? websiteLink : null;

    modalLogo.src = logo;
    modalTitle.innerText = title;
    modalDesc.innerText = desc;

    if (isDiscontinued) {
      modalWebsite.style.display = "none";
      modalGithub.style.display = githubLink ? "inline-block" : "none";
      if (githubLink) {
          modalGithub.href = githubLink;
          modalGithub.textContent = "Archived Code"; 
      }
    } else {
      modalWebsite.style.display = websiteLink ? "inline-block" : "none";
      modalGithub.style.display = "none";
      if (websiteLink) {
          modalWebsite.href = websiteLink;
          modalWebsite.textContent = "Open Website"; 
      }
    }

    modal.classList.add("active");
  }

  if (!modalClose.hasClickListener) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      resumeAllScrollers();
    });
    modalClose.hasClickListener = true; 
  }
}

function duplicateScrollerContent() {
  document.querySelectorAll('.projects-row').forEach(row => {
    const inner = row.querySelector('.scroller-inner');
    if (!inner) return;

    const originalCards = row.querySelectorAll('.project-card');
    const originalHTML = Array.from(originalCards).slice(0, 4).map(el => el.outerHTML).join(''); 

    inner.innerHTML = ''; 
    let filler = '';
    do {
      filler += originalHTML;
      inner.innerHTML = filler;
    } while (inner.scrollWidth < window.innerWidth * 2);
  });

  attachProjectCardListeners();
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
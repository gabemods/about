const body = document.body;
const allProjectsBtn = document.getElementById('view-all-projects-btn');
const yearSpan = document.getElementById('year');

function attachProjectCardListeners() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

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

  if (modalClose && !modalClose.hasClickListener) {
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

    const originalCards = Array.from(inner.querySelectorAll('.project-card')); 

    inner.innerHTML = ''; 

    const cardCount = row.classList.contains('projects-row-1') ? 4 : 6;

    const originalHTML = originalCards.slice(0, cardCount).map(el => el.outerHTML).join('');

    if (originalHTML) {
        let filler = '';
        do {
            filler += originalHTML;
            inner.innerHTML = filler;
        } while (inner.scrollWidth < window.innerWidth * 2 && inner.children.length < 20);
    }
  });

  attachProjectCardListeners();
}

window.addEventListener('resize', duplicateScrollerContent);

function applySystemTheme(e) {
  if (e.matches) body.classList.add('dark');
  else body.classList.remove('dark');
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDark);
prefersDark.addEventListener('change', applySystemTheme);

function initCommonFeatures() {
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
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

if (window.barba) {

    barba.init({
        views: [
            {
                namespace: 'about', 
                afterEnter() {
                    duplicateScrollerContent();
                    resumeAllScrollers();

                    if (allProjectsBtn) {
                        allProjectsBtn.classList.remove('hide-on-projects');
                    }
                }
            },
            {
                namespace: 'projects',
                afterEnter() {
                    attachProjectCardListeners();
                    pauseAllScrollers();

                    const mainContent = document.querySelector('[data-barba-namespace="projects"] .content');
                    if (mainContent) {
                        createGoBackButton(mainContent);
                    }
                }
            }
        ],

        transitions: [{
            name: 'fade',
            once({ next }) {
                initCommonFeatures();
                if (next.namespace === 'about') {
                    duplicateScrollerContent();
                    resumeAllScrollers();
                } else {
                    attachProjectCardListeners();
                    pauseAllScrollers();
                }
            },
            leave({ current }) {
                return new Promise(resolve => {
                    current.container.style.opacity = 0;
                    current.container.style.transition = 'opacity 0.3s ease';
                    setTimeout(resolve, 300);
                });
            },
            enter({ next }) {
                window.scrollTo(0, 0);
                next.container.style.opacity = 0;
                next.container.style.transition = 'opacity 0.3s ease';

                return new Promise(resolve => {
                    next.container.style.opacity = 1;
                    resolve();
                });
            },
        }],

        prevent: ({ el }) => el.matches('a[target="_blank"]'),
    });
}

function createGoBackButton(targetElement) {
    let backBtn = document.getElementById('back-to-about-btn');

    if (!backBtn) {
        backBtn = document.createElement('button');
        backBtn.id = 'back-to-about-btn';
        backBtn.classList.add('btn-secondary', 'back-button');
        backBtn.textContent = '← Back';

        backBtn.addEventListener('click', () => {
             if (window.barba) {
                 barba.go('./'); 
             } else {
                 window.location.href = './';
             }
        });
    }

    targetElement.insertAdjacentElement('afterbegin', backBtn);
}


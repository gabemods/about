const body = document.body;
const allProjectsBtn = document.getElementById('view-all-projects-btn');
const yearSpan = document.getElementById('year');
let resizeTimer = null;

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

function waitForImages(container) {
    return new Promise(resolve => {
        const imgs = Array.from(container.querySelectorAll('img'));
        if (imgs.length === 0) {
            resolve();
            return;
        }
        let remaining = imgs.length;
        imgs.forEach(img => {
            if (img.complete && img.naturalWidth !== 0) {
                remaining--;
                if (remaining === 0) resolve();
            } else {
                img.addEventListener('load', () => {
                    remaining--;
                    if (remaining === 0) resolve();
                }, { once: true });
                img.addEventListener('error', () => {
                    remaining--;
                    if (remaining === 0) resolve();
                }, { once: true });
            }
        });
    });
}

function duplicateScrollerContent() {
    const sourceContainer = document.getElementById('project-card-source');
    if (!sourceContainer) return;
    
    document.querySelectorAll('.projects-row').forEach(row => {
        const inner = row.querySelector('.scroller-inner');
        if (!inner) return;
        
        const isRow1 = row.classList.contains('projects-row-1');
        const rowNumber = isRow1 ? '1' : '2';
        
        const originalCards = Array.from(
            sourceContainer.querySelectorAll(`.project-card[data-row="${rowNumber}"]`)
        );
        if (originalCards.length === 0) return;
        
        inner.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            originalCards.forEach(card => inner.appendChild(card.cloneNode(true)));
        }
        
        const setWidth = inner.scrollWidth / 5;
        
        setScrollerAnimation(inner, setWidth, isRow1 ? false : true);
    });
    
    attachProjectCardListeners();
}

function setScrollerAnimation(inner, setWidth, reverse) {
    const speed = 20;
    const durationSec = setWidth / speed;
    
    const keyframeName = 'scrollAnim' + Math.random().toString(36).substring(2, 7);
    
    const style = document.createElement('style');
    style.textContent = reverse ?
        `@keyframes ${keyframeName} {
            from { transform: translateX(-${setWidth}px); }
            to   { transform: translateX(0); }
        }` :
        `@keyframes ${keyframeName} {
            from { transform: translateX(0); }
            to   { transform: translateX(-${setWidth}px); }
        }`;
    document.head.appendChild(style);
    
    inner.style.animation = `${keyframeName} ${durationSec}s linear infinite`;
}

function setupScroller(inner, travelPx, reverse) {
    inner.style.animation = 'none';
    inner.style.transform = reverse ? `translateX(-${Math.round(travelPx)}px)` : 'translateX(0px)';
    inner.getBoundingClientRect();
    const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--speed-px-per-sec')) || 120;
    let durationSec = Math.max(1, travelPx / speed);
    const keyframeName = 'scrollerKF' + Math.random().toString(36).substring(2, 9);
    const styleId = 'scroller-style-' + keyframeName;
    const from = reverse ? `transform: translateX(-${Math.round(travelPx)}px) translateZ(0);` : `transform: translateX(0px) translateZ(0);`;
    const to = reverse ? `transform: translateX(0px) translateZ(0);` : `transform: translateX(-${Math.round(travelPx)}px) translateZ(0);`;
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `@keyframes ${keyframeName} { from { ${from} } to { ${to} } }`;
    document.head.appendChild(styleEl);
    inner.dataset.kfStyleId = styleId;
    inner.style.willChange = 'transform';
    inner.style.backfaceVisibility = 'hidden';
    inner.style.animation = `${keyframeName} ${durationSec}s linear infinite`;
    inner.style.animationTimingFunction = 'linear';
    inner.style.animationPlayState = 'running';
    if (!inner._mouseListeners) {
        inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
        inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
        inner._mouseListeners = true;
    }
}

function openProjectModal(event) {
    if (event.target.closest('a') || event.target.closest('.button')) return;
    const card = event.currentTarget;
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    const modalLogo = modal.querySelector(".modal-logo img");
    const modalTitle = modal.querySelector(".modal-title");
    const modalDesc = modal.querySelector(".modal-description");
    const modalWebsite = modal.querySelector(".modal-website");
    const modalGithub = modal.querySelector(".modal-github");
    const isHomepage = !!document.getElementById('project-card-source');

    document.body.style.overflow = "hidden";
    if (isHomepage) pauseAllScrollers();

    const logo = card.dataset.image ? card.dataset.image : (card.querySelector("img") ? card.querySelector("img").src : "");
    const title = card.dataset.name ? card.dataset.name : (card.querySelector("h3") ? card.querySelector("h3").innerText : "");
    const desc = card.dataset.description ? card.dataset.description : (card.querySelector("p") ? card.querySelector("p").innerText : "");
    const websiteLink = card.dataset.website ? card.dataset.website : null;
    const githubLink = card.dataset.github ? card.dataset.github : null;
    const isDiscontinued = card.classList.contains("project-discontinued");

    if (modalLogo) modalLogo.src = logo;
    if (modalLogo) modalLogo.alt = title + ' logo';
    if (modalTitle) modalTitle.innerText = title;
    if (modalDesc) modalDesc.innerText = desc;

    if (websiteLink) {
        modalWebsite.style.display = "flex";
        modalWebsite.href = websiteLink;
        modalWebsite.textContent = isDiscontinued ? "Archived Code" : "Open Website";
    } else {
        modalWebsite.style.display = "none";
    }

    if (githubLink) {
        modalGithub.style.display = "flex";
        modalGithub.href = githubLink;
        modalGithub.textContent = "Open GitHub";
    } else {
        modalGithub.style.display = "none";
    }

    modal.classList.add("active");
}

function closeProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    const isHomepage = !!document.getElementById('project-card-source');

    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (isHomepage) resumeAllScrollers();
}

function attachProjectCardListeners() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    const modalClose = modal.querySelector(".modal-close");

    document.querySelectorAll(".project-card").forEach(card => {
        if (card._hasClickListener) return;

        card.addEventListener("click", openProjectModal);
        card._hasClickListener = true;
    });

    if (modalClose && !modalClose._hasClickListener) {
        modalClose.addEventListener("click", closeProjectModal);
        modalClose._hasClickListener = true;
    }
    
    if (!modal._hasOutsideClickListener) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeProjectModal();
        });
        modal._hasOutsideClickListener = true;
    }
}

function applySystemTheme(e) {
    if (e.matches) body.classList.add('dark');
    else body.classList.remove('dark');
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDark);
prefersDark.addEventListener('change', applySystemTheme);

window.addEventListener('load', () => {
    duplicateScrollerContent();
    attachProjectCardListeners();
});

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => duplicateScrollerContent(), 20);
});

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const pathPrefix = window.location.pathname.split('/').length > 2 ? '../' : './';

const footerHTML = `
<footer class="footer">
  <div class="footer-top">
    <h2 class="footer-title">Gabriel Longshaw</h2>
    <p class="footer-description">
      On this website you can find out a bit about me and all of my projects.
    </p>
  </div>

  <div class="footer-container">
    <div class="footer-section">
      <h3>Explore</h3>
      <ul>
        <li><a href="${pathPrefix}">Home</a></li>
        <li><a href="${pathPrefix}projects/">Projects</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Connect</h3>
      <p class="no-contact">No contact currently available.</p>
      <ul>
      <li><a href="https://github.com/gabriellongshaw">GitHub</a></li>
        <li><a href="https://www.instagram.com/gabe.l07">Instagram</a></li>
        <li><a href="https://youtube.com/@gabriellongshaw?si=DWkxGW_qTVH1oa1H">YouTube</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>
      © <span id="year"></span> Gabriel Longshaw. All rights reserved.
      Website created and maintained by 
      <a class="name" href="https://gabriellongshaw.co.uk/" target="_blank" rel="noopener">Gabriel Longshaw</a>.
    </p>
    <p class="meta">
Jesus said to him, “I am the way, the truth, and the life. No one comes to the Father except through Me.” ‭‭John‬‭ 14‬: ‭6‬‭ NKJV‬‬
</p>
  </div>
</footer>
`;

const footerPlaceholder = document.getElementById('footer-placeholder');

if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

const header = document.getElementById("projectsHeader");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

const body = document.body;
const allProjectsBtn = document.getElementById('view-all-projects-btn');
const yearSpan = document.getElementById('year');

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
        inner.style.transform = '';
        
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            inner.appendChild(clone);
        });
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            inner.appendChild(clone);
        });
        
        if (!isRow1) {
            
            inner.style.transform = "translateX(-50%)";
        } else {
            
            inner.style.transform = "translateX(0)";
        }
    });
    
    attachProjectCardListeners();
    resumeAllScrollers();
}

window.addEventListener('load', () => {
    duplicateScrollerContent();
});

window.addEventListener('resize', duplicateScrollerContent);

function openProjectModal(event) {
    if (event.target.closest('a')) return;
    
    const card = event.currentTarget;
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    
    const modalLogo = modal.querySelector(".modal-logo img");
    const modalTitle = modal.querySelector(".modal-title");
    const modalDesc = modal.querySelector(".modal-description");
    const modalWebsite = modal.querySelector(".modal-website");
    const modalGithub = modal.querySelector(".modal-github");
    
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

function attachProjectCardListeners() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;
    
    const modalClose = modal.querySelector(".modal-close");
    
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", openProjectModal);
    });
    
    if (modalClose && !modalClose.hasClickListener) {
        modalClose.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "";
            resumeAllScrollers();
        });
        modalClose.hasClickListener = true;
    }
}

function applySystemTheme(e) {
    if (e.matches) body.classList.add('dark');
    else body.classList.remove('dark');
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDark);
prefersDark.addEventListener('change', applySystemTheme);

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
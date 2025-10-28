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

document.addEventListener('DOMContentLoaded', () => {

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    projectCards.forEach(card => {
        const buttonGroup = card.querySelector('.button-group-active');
        const singleButton = card.querySelector('.project-discontinued > .button');

        if (buttonGroup) {
            const websiteButton = buttonGroup.querySelector('.button-website');
            const githubButton = buttonGroup.querySelector('.button:not(.button-website)');

            const websiteUrl = buttonGroup.getAttribute('data-website');
            const githubUrl = buttonGroup.getAttribute('data-github');

            const handleExternalClick = (e, url) => {
                e.preventDefault();
                e.stopPropagation();
                if (url) {
                    window.open(url, '_blank');
                }
            };

            if (websiteButton) {
                websiteButton.addEventListener('click', (e) => handleExternalClick(e, websiteUrl));
            }

            if (githubButton) {
                githubButton.addEventListener('click', (e) => handleExternalClick(e, githubUrl));
            }
        }

        if (singleButton && card.classList.contains('project-discontinued')) {
            const githubUrl = singleButton.getAttribute('data-github') || card.getAttribute('data-github');

            singleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (githubUrl) {
                    window.open(githubUrl, '_blank');
                }
            });
        }

        const projectName = card.getAttribute('data-name');
        if (projectName) {
            const slug = slugify(projectName.replace('(disc.)', '').trim());
            card.href = `projects/${slug}`;
        }
    });

    const body = document.body;
    const yearSpan = document.getElementById('year');

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

    const pathPrefix = window.location.pathname.split('/').length > 2 ? '../' : './';

    const footerHTML = `
    <footer class="footer">
      <div class="footer-top">
        <h2 class="footer-title">Gabriel Longshaw</h2>
        <p class="footer-description">
          On this website you can find out a bit about me and find all of my projects.
        </p>
      </div>

      <div class="footer-container">
        <div class="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><a href="${pathPrefix}">Home</a></li>
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
          © <span id="year">${new Date().getFullYear()}</span> Gabriel Longshaw. All rights reserved.
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

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
        });
    }

    const searchToggle = document.getElementById('search-toggle');
    const searchClose = document.getElementById('search-close');
    const searchOverlay = document.getElementById('search-overlay');

    const searchModalContent = document.querySelector('.search-modal-content'); 

    const searchInput = document.getElementById('fullscreen-search-input');
    const resultsContainer = document.getElementById('search-results-container');

        searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');

        searchOverlay.scrollTop = 0;
        searchOverlay.classList.remove('scrolled-down');

        if (searchModalContent) {
             searchModalContent.classList.add('is-sticky');
        }
        searchInput.classList.add('active');
        searchClose.classList.add('active');
        
        // FIX: Replaced body.style.overflow with class
        document.body.classList.add('search-active-lock');
        
        setTimeout(() => searchInput.focus(), 350); 
    });


    const closeSearch = () => {

        searchOverlay.classList.remove('active', 'scrolled-down'); 

        if (searchModalContent) {
            searchModalContent.classList.remove('is-sticky');
        }
        searchInput.classList.remove('active');
        searchClose.classList.remove('active');
        body.style.overflow = '';
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }

    searchClose.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    searchOverlay.addEventListener('scroll', () => {

        if (searchOverlay.scrollTop > 5) {
            searchOverlay.classList.add('scrolled-down');
        } else {
            searchOverlay.classList.remove('scrolled-down');
        }
    });

    const filterProjects = (searchTerm) => {
        const term = searchTerm.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (term.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        const fragment = document.createDocumentFragment();
        let matchesFound = false;

        projectCards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const description = card.getAttribute('data-description').toLowerCase();
            const tech = card.getAttribute('data-tech').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();

            const isMatch = name.includes(term) || 
                            description.includes(term) || 
                            tech.includes(term) || 
                            category.includes(term);

            if (isMatch) {
                const clonedCard = card.cloneNode(true);
                fragment.appendChild(clonedCard);
                matchesFound = true;
                if (clonedCard._hasClickListener) clonedCard.removeEventListener("click", openProjectModal);
                clonedCard.addEventListener("click", openProjectModal);
                clonedCard._hasClickListener = true;
            }
        });

        if (matchesFound) {
            resultsContainer.style.display = 'grid'; 
            resultsContainer.appendChild(fragment);
        } else {
            resultsContainer.style.display = 'flex'; 
            resultsContainer.innerHTML = `<p style="text-align: center; width: 100%; margin-top: 2rem; color: var(--meta-text);">No projects found matching "${term}".</p>`;
        }
    };

    searchInput.addEventListener('input', (e) => {
        filterProjects(e.target.value);
    });

    attachProjectCardListeners(); 
});
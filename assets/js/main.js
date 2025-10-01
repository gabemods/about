const body = document.body;
const toggles = document.querySelectorAll('.theme-toggle');

function applySystemTheme(e) {
  if (e.matches) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
applySystemTheme(prefersDark);
prefersDark.addEventListener('change', applySystemTheme);

const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

function setupInfiniteScroll(scrollerInnerSelector) {
  const scrollerInner = document.querySelector(scrollerInnerSelector);
  
  if (!scrollerInner) return;
  
  const children = Array.from(scrollerInner.children);
  
  children.forEach(item => {
    
    const clonedItem = item.cloneNode(true);
    clonedItem.setAttribute('aria-hidden', 'true');
    scrollerInner.appendChild(clonedItem);
  });
}

setupInfiniteScroll('.projects-row-1 .scroller-inner');
setupInfiniteScroll('.projects-row-2 .scroller-inner');


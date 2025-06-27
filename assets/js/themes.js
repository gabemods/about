// Get references
const themeSelect = document.getElementById('theme-select');
const metaColor = document.querySelector('meta[name="theme-color"]');

// Apply a theme based on mode
function updateTheme(mode) {
  document.body.classList.remove('light', 'dark');
  
  let finalTheme = mode;
  
  if (mode === 'system') {
    finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  document.body.classList.add(finalTheme);
  metaColor.setAttribute('content', finalTheme === 'dark' ? '#121212' : '#ffffff');
}

// Handle system theme change if "system" is selected
function watchSystemTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', () => {
    if (themeSelect.value === 'system') {
      updateTheme('system');
    }
  });
}

// Load saved preference or default to "system"
const storedTheme = localStorage.getItem('preferred-theme') || 'system';
themeSelect.value = storedTheme;
updateTheme(storedTheme);
watchSystemTheme();

// Handle user selection
themeSelect.addEventListener('change', () => {
  const choice = themeSelect.value;
  localStorage.setItem('preferred-theme', choice);
  updateTheme(choice);
});
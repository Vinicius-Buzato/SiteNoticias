/* script.js - Jornal Backstage
   - dark mode persistente (uses localStorage)
   - sets theme before DOMContent to avoid flash (index and article pages include small inline guard)
   - simple helpers for navigation if needed
*/

// Apply saved theme early if possible (redundant safety)
(function(){
  try {
    const t = localStorage.getItem('theme');
    if(t === 'dark') document.documentElement.classList.add('dark');
  } catch(e){}
})();

// after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    updateThemeButton();
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e){}
      updateThemeButton();
    });
  }
});

function updateThemeButton(){
  const themeBtn = document.getElementById('themeToggle');
  if(!themeBtn) return;
  if(document.documentElement.classList.contains('dark')){
    themeBtn.textContent = '☀️';
    themeBtn.setAttribute('aria-label','Ativar tema claro');
  } else {
    themeBtn.textContent = '🌙';
    themeBtn.setAttribute('aria-label','Ativar tema escuro');
  }
}

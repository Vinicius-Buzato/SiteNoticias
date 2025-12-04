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

function setupHighlightObserver() {
    // Seleciona todos os elementos que têm a classe 'highlight'
    const highlights = document.querySelectorAll('.highlight');

    // Se não houver elementos, sai da função
    if (highlights.length === 0) return; 

    // Opções para o observador:
    // O threshold de 0.8 significa que o efeito será acionado quando 80% do elemento estiver visível
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.8 
    };

    const highlightObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quando o elemento está visível, adiciona a classe que aciona o CSS
                entry.target.classList.add('is-visible');
                // Opcional: Para a animação ocorrer apenas uma vez, pare de observar
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Começa a observar cada elemento de destaque
    highlights.forEach(highlight => {
        highlightObserver.observe(highlight);
    });
}

// Chame a nova função dentro do DOMContentLoaded, logo após o seu código do themeToggle:
document.addEventListener('DOMContentLoaded', () => {
    // ... (código existente do themeToggle) ...

    // NOVO: Inicializa o observador de destaque de texto
    setupHighlightObserver();
});

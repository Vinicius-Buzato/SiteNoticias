/* script.js - Jornal Backstage
    - dark mode persistente (uses localStorage)
    - sets theme before DOMContent to avoid flash (index and article pages include small inline guard)
    - simple helpers for navigation if needed
    - NOVO: Suporte a múltiplos botões de tema usando a classe '.theme-toggle-btn'
*/

// Aplica o tema salvo antecipadamente para evitar o "flash"
(function(){
    try {
        const t = localStorage.getItem('theme');
        // Se o tema estiver salvo como 'dark', aplica a classe 'dark' ao <html>
        if(t === 'dark') document.documentElement.classList.add('dark');
    } catch(e){}
})();

// Função utilitária para animação slide up/down/toggle
function slideToggle(element) {
    const isExpanded = element.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
        // --- RECOLHER (Slide Up) ---
        // 1. Define a altura atual
        element.style.maxHeight = element.scrollHeight + 'px';

        // 2. Força o reflow do navegador
        element.offsetWidth;

        // 3. Define a altura final para zero
        element.style.maxHeight = '0';
        element.setAttribute('data-expanded', 'false');
    } else {
        // --- EXPANDIR (Slide Down) ---
        // 1. Define a altura total do conteúdo
        element.style.maxHeight = element.scrollHeight + 'px';
        element.setAttribute('data-expanded', 'true');

        // 2. Após a transição (500ms), remove max-height para responsividade
        setTimeout(() => {
            element.style.maxHeight = 'none';
        }, 500);
    }
}

// Função para atualizar o texto e aria-label de TODOS os botões de tema
function updateThemeButton(){
    // Seleciona TODOS os elementos com a classe '.theme-toggle-btn'
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    if(themeBtns.length === 0) return;

    const isDark = document.documentElement.classList.contains('dark');
    const icon = isDark ? '☀️' : '🌙';
    const ariaLabel = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

    // Aplica as mudanças em cada botão encontrado
    themeBtns.forEach(btn => {
        btn.textContent = icon;
        btn.setAttribute('aria-label', ariaLabel);
    });
}

// --- Funcionalidade de Copiar PIX ---
function setupPixCopy(btnId, valueId) {
    const btnCopiarPix = document.getElementById(btnId);
    const pixValueSpan = document.getElementById(valueId);

    if (btnCopiarPix && pixValueSpan) {
        // O texto a ser copiado é o conteúdo do <span>
        const textToCopy = pixValueSpan.textContent.trim();
        
        btnCopiarPix.addEventListener('click', () => {
            if (navigator.clipboard) {
                // API moderna (Chrome, Firefox, etc.)
                navigator.clipboard.writeText(textToCopy).then(() => {
                    btnCopiarPix.textContent = 'CNPJ Copiado!';
                    setTimeout(() => {
                        btnCopiarPix.textContent = 'Copiar Chave PIX';
                    }, 2000);
                }).catch(err => {
                    console.error('Falha ao copiar:', err);
                    alert('Erro ao copiar a chave PIX.');
                });
            } else {
                // Fallback para navegadores mais antigos
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);

                btnCopiarPix.textContent = 'CNPJ Copiado!';
                setTimeout(() => {
                    btnCopiarPix.textContent = 'Copiar Chave PIX';
                }, 2000);
            }
        });
    }
}

// --- Função auxiliar para configurar o toggle de conteúdo (PIX/Dropdown) ---
function setupToggle(buttonId, contentId, expandText, collapseText) {
    const btn = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    if (btn && content) {
        // Inicializa o estado para a função slideToggle funcionar
        content.setAttribute('data-expanded', 'false');
        content.style.maxHeight = '0';

        btn.addEventListener('click', () => {
            slideToggle(content);

            // Alterna o texto do botão
            const isExpanded = content.getAttribute('data-expanded') === 'true';
            btn.textContent = isExpanded ? collapseText : expandText;
        });
    }
}


// Funcionalidade de Animação de Destaque na Interseção
function setupHighlightObserver() {
    const highlights = document.querySelectorAll('.highlight');
    if (highlights.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
    };

    const highlightObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    highlights.forEach(highlight => {
        highlightObserver.observe(highlight);
    });
}

// Bloco de inicialização após o DOM carregar
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Configuração do Dark Mode (Fix) ---
    const themeToggleBtn = document.getElementById('themeToggle'); 

    // Adiciona a classe '.theme-toggle-btn' ao botão principal para ser rastreado pela função
    if(themeToggleBtn) {
        themeToggleBtn.classList.add('theme-toggle-btn');
    }

    // Seleciona TODOS os botões de tema (agora incluindo o #themeToggle)
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');

    if(themeBtns.length > 0) {
        // Inicializa o estado (para carregar o ícone correto)
        updateThemeButton(); 

        // Adiciona o listener para cada botão
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Alterna a classe 'dark' no elemento raiz <html>
                document.documentElement.classList.toggle('dark');

                const isDark = document.documentElement.classList.contains('dark');

                // Salva a preferência no localStorage
                try {
                    localStorage.setItem('theme', isDark ? 'dark' : 'light');
                } catch(e){}

                // Atualiza o texto e aria-label de TODOS os botões
                updateThemeButton();
            });
        });
    }


    // --- 2. Setup dos Toggles de Doação (PIX e Outras Formas) (Fix) ---

    // Biblioteca Wilma Lancellotti
    setupToggle('btnQueroDoarBiblioteca', 'pixDetailsBiblioteca', 'Quero Doar', 'Esconder');
    setupToggle('btnDropdownBiblioteca', 'dropdownContentBiblioteca', 'Outras Formas de Doar', 'Esconder');
    setupPixCopy('btnCopiarPixBiblioteca', 'pixValueBiblioteca'); 

    // Mooca Solidária
    setupToggle('btnQueroDoarMoocaSolidaria', 'pixDetailsMoocaSolidaria', 'Quero Doar', 'Esconder');
    setupToggle('btnDropdownMoocaSolidaria', 'dropdownContentMoocaSolidaria', 'Outras Formas de Doar', 'Esconder');
    setupPixCopy('btnCopiarPixMoocaSolidaria', 'pixValueMoocaSolidaria'); // Adicionado o setup para o botão de copiar da Mooca Solidária

    // --- 3. Setup do Highlight Observer ---
    setupHighlightObserver();

}); // Fim do DOMContentLoaded
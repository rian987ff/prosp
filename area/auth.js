// Gerenciador de Sessão, Menu Lateral (Sidebar) e Player Universal

(function () {
  const STORAGE_KEY = 'novena_user_email';

  window.NovenaAuth = {
    isLoggedIn: function () {
      const identifier = localStorage.getItem(STORAGE_KEY);
      return Boolean(identifier && identifier.trim().length > 0);
    },

    getUserEmail: function () {
      return localStorage.getItem(STORAGE_KEY) || 'fiel@novena.com';
    },

    login: function (identifier) {
      if (identifier && identifier.trim().length >= 5) {
        localStorage.setItem(STORAGE_KEY, identifier.trim());
        return true;
      }
      return false;
    },

    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/area/';
    },

    requireAuth: function () {
      if (!this.isLoggedIn()) {
        window.location.href = '/area/';
        return false;
      }
      return true;
    }
  };

  // Helper do Menu Lateral (Sidebar Drawer)
  window.toggleSidebar = function (open) {
    let backdrop = document.getElementById('global-sidebar-backdrop');
    let drawer = document.getElementById('global-sidebar-drawer');

    if (!backdrop || !drawer) {
      injectSidebar();
      backdrop = document.getElementById('global-sidebar-backdrop');
      drawer = document.getElementById('global-sidebar-drawer');
    }

    if (open) {
      backdrop.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      backdrop.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  function injectSidebar() {
    if (document.getElementById('global-sidebar-drawer')) return;

    const currentPath = window.location.pathname;

    const sidebarHtml = `
      <div id="global-sidebar-backdrop" class="sidebar-backdrop" onclick="toggleSidebar(false)"></div>
      <aside id="global-sidebar-drawer" class="sidebar-drawer" aria-label="Menu de Navegação">
        <div class="sidebar-header">
          <a href="/area/" class="brand-logo" onclick="toggleSidebar(false)">
            <img src="/public/area/maria-avatar-BkoYwFrM.jpg" alt="Nossa Senhora Desatadora dos Nós" class="brand-avatar-img">
            <div class="brand-text-wrap">
              <span class="brand-tagline">Portal Sagrado</span>
              <span class="brand-title">Maria Desatadora</span>
            </div>
          </a>
          <button type="button" class="sidebar-close-btn" onclick="toggleSidebar(false)" aria-label="Fechar Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="sidebar-content">
          <!-- Grupo 1: Navegação Principal -->
          <div>
            <p class="sidebar-group-title">Principal</p>
            <nav class="sidebar-nav-list">
              <a href="/area/" class="sidebar-link ${currentPath === '/area/' || currentPath === '/area/index.html' ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Início do Portal Sagrado
              </a>
              <a href="/area/novena/" class="sidebar-link ${currentPath.includes('/area/novena/') && !currentPath.includes('/dias') && !currentPath.includes('/oracoes') && !currentPath.includes('/musicas') && !currentPath.includes('/audiolivro') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Menu da Novena
              </a>
            </nav>
          </div>

          <!-- Grupo 2: Módulos da Novena -->
          <div>
            <p class="sidebar-group-title">Novena & Orações</p>
            <nav class="sidebar-nav-list">
              <a href="/area/novena/dias/" class="sidebar-link ${currentPath.includes('/novena/dias') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Novena dos 9 Dias
              </a>
              <a href="/area/novena/oracoes/" class="sidebar-link ${currentPath.includes('/novena/oracoes') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                Orações Especiais (8 Temas)
              </a>
              <a href="/area/novena/musicas/" class="sidebar-link ${currentPath.includes('/novena/musicas') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                Músicas de Nossa Senhora
              </a>
              <a href="/area/novena/audiolivro/" class="sidebar-link ${currentPath.includes('/novena/audiolivro') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
                Áudiolivro da Novena
              </a>
            </nav>
          </div>

          <!-- Grupo 3: Bônus e Entregáveis Especiais -->
          <div>
            <p class="sidebar-group-title">Seus Bônus Especiais Liberados</p>
            <nav class="sidebar-nav-list">
              <a href="/area/extras/musicas-anjos/" class="sidebar-link ${currentPath.includes('/musicas-anjos') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                Músicas dos Anjos
              </a>
              <a href="/area/extras/sao-francisco/" class="sidebar-link ${currentPath.includes('/sao-francisco') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
                30 Orações de São Francisco
              </a>
              <a href="/area/extras/arcanjos/" class="sidebar-link ${currentPath.includes('/arcanjos') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                Oração Sagrada dos 4 Arcanjos
              </a>
              <a href="/area/extras/grimorio/" class="sidebar-link ${currentPath.includes('/grimorio') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                Grimório dos Arcanjos (9 Capítulos)
              </a>
              <a href="/area/extras/corrente/" class="sidebar-link ${currentPath.includes('/corrente') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Corrente de Oração e Milagres
              </a>
              <a href="/area/extras/vela/" class="sidebar-link ${currentPath.includes('/vela') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>
                Vela Benta + Terço Consagrado
              </a>
              <a href="/area/extras/imagens-sagradas/" class="sidebar-link ${currentPath.includes('/imagens-sagradas') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                Imagens Sagradas em Alta Resolução
              </a>
            </nav>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <div class="sidebar-footer-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <div class="sidebar-footer-text">
              <p class="sidebar-footer-blessing">“Para Deus nada é impossível.”</p>
              <p class="sidebar-footer-sub">Portal Sagrado da Novena</p>
            </div>
          </div>
        </div>
      </aside>
    `;

    document.body.insertAdjacentHTML('beforeend', sidebarHtml);
  }

  // Inicializar sidebar ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    if (NovenaAuth.isLoggedIn()) {
      injectSidebar();
    }
  });

  // Helper de Toast Devocional
  window.showSacredToast = function (msg) {
    let toast = document.getElementById('global-sacred-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-sacred-toast';
      toast.className = 'sacred-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✦</span> <span>${msg}</span>`;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  };

  // Helper de Modal Global de Player / Oração
  window.openPlayer = function (item) {
    let modalBackdrop = document.getElementById('global-player-modal');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'global-player-modal';
      modalBackdrop.className = 'modal-backdrop';
      modalBackdrop.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-player-title">Oração</h3>
            <button type="button" class="btn-close-modal" onclick="closePlayer()" aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div id="modal-video-container" class="video-frame-wrap" style="display:none;"></div>
            <div id="modal-prayer-container" class="prayer-text-box"></div>
            <div id="modal-completion-container" class="modal-completion-bar" style="display:none;"></div>
            <div class="modal-actions">
              <button type="button" class="btn-copy-prayer" onclick="copyModalPrayer()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span id="copy-btn-text">Copiar Oração</span>
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalBackdrop);

      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) {
          closePlayer();
        }
      });
    }

    const titleEl = document.getElementById('modal-player-title');
    const videoContainer = document.getElementById('modal-video-container');
    const prayerContainer = document.getElementById('modal-prayer-container');
    const completionContainer = document.getElementById('modal-completion-container');

    titleEl.textContent = item.title || 'Oração Sagrada';

    if (item.youtubeId || item.src) {
      const vid = item.youtubeId || item.src;
      videoContainer.style.display = 'block';
      videoContainer.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0" title="${item.title}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      videoContainer.style.display = 'none';
      videoContainer.innerHTML = '';
    }

    const textContent = item.oracao || item.text || item.intencao || '';
    if (textContent) {
      prayerContainer.style.display = 'block';
      prayerContainer.textContent = textContent;
    } else {
      prayerContainer.style.display = 'none';
    }

    // Se o item for um dos 9 dias da novena, renderiza barra de conclusão
    if (item.dia && window.NovenaProgress) {
      completionContainer.style.display = 'block';
      renderModalCompletionBar(item.dia);
    } else {
      completionContainer.style.display = 'none';
      completionContainer.innerHTML = '';
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function renderModalCompletionBar(dia) {
    const completionContainer = document.getElementById('modal-completion-container');
    if (!completionContainer || !window.NovenaProgress) return;

    const isCompleted = window.NovenaProgress.isCompleted(dia);
    if (isCompleted) {
      completionContainer.innerHTML = `
        <div class="day-done-banner">
          <div class="day-done-text">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Oração do ${dia}º Dia concluída sob a bênção de Maria!</span>
          </div>
          <button type="button" class="btn-undo-done" onclick="undoDayCompletion(${dia})">Refazer</button>
        </div>
      `;
    } else {
      completionContainer.innerHTML = `
        <button type="button" class="btn-complete-action" onclick="handleDayCompletion(${dia})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Marcar ${dia}º Dia como Concluído
        </button>
      `;
    }
  }

  window.handleDayCompletion = function (dia) {
    if (window.NovenaProgress) {
      window.NovenaProgress.completeDay(dia);
      renderModalCompletionBar(dia);
      window.showSacredToast(`Glória a Deus! Oração do ${dia}º Dia concluída!`);
    }
  };

  window.undoDayCompletion = function (dia) {
    if (window.NovenaProgress) {
      window.NovenaProgress.uncompleteDay(dia);
      renderModalCompletionBar(dia);
      window.showSacredToast(`Oração do ${dia}º Dia reaberta.`);
    }
  };

  window.closePlayer = function () {
    const modalBackdrop = document.getElementById('global-player-modal');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      const videoContainer = document.getElementById('modal-video-container');
      if (videoContainer) videoContainer.innerHTML = '';
      document.body.style.overflow = '';
    }
  };

  window.copyModalPrayer = function () {
    const prayerContainer = document.getElementById('modal-prayer-container');
    const titleEl = document.getElementById('modal-player-title');
    const btnText = document.getElementById('copy-btn-text');
    if (prayerContainer && prayerContainer.textContent) {
      const fullText = `${titleEl.textContent}\n\n${prayerContainer.textContent}`;
      navigator.clipboard.writeText(fullText).then(() => {
        btnText.textContent = 'Copiado!';
        setTimeout(() => { btnText.textContent = 'Copiar Oração'; }, 2000);
      });
    }
  };
})();

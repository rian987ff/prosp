// Gerenciador de Progresso e Calendário Devocional da Novena (LocalStorage)

(function() {
  const STORAGE_KEY = 'novena_progress_state';
  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  window.NovenaProgress = {
    // Obter o estado salvo do devoto
    get: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return {
              started: Boolean(parsed.started),
              startDate: parsed.startDate || null,
              intention: parsed.intention || '',
              completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
              cycle: Number(parsed.cycle) || 1,
              lastCompletedAt: parsed.lastCompletedAt || null
            };
          }
        }
      } catch (e) {
        console.error('Erro ao ler progresso da novena:', e);
      }
      return {
        started: false,
        startDate: null,
        intention: '',
        completedDays: [],
        cycle: 1,
        lastCompletedAt: null
      };
    },

    // Salvar estado
    save: function(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent('novena-progress-updated', { detail: state }));
      } catch (e) {
        console.error('Erro ao salvar progresso da novena:', e);
      }
    },

    // Iniciar novena com intenção consagrada
    start: function(intentionText) {
      const state = this.get();
      state.started = true;
      state.startDate = new Date().toISOString();
      state.intention = (intentionText || '').trim();
      state.completedDays = [];
      this.save(state);
      return state;
    },

    // Marcar um dia como concluído
    completeDay: function(dayNumber) {
      const state = this.get();
      if (!state.started) {
        state.started = true;
        state.startDate = new Date().toISOString();
      }
      const day = Number(dayNumber);
      if (!state.completedDays.includes(day)) {
        state.completedDays.push(day);
        state.completedDays.sort((a, b) => a - b);
        state.lastCompletedAt = new Date().toISOString();
        this.save(state);
      }
      return state;
    },

    // Desmarcar um dia (caso o usuário queira refazer)
    uncompleteDay: function(dayNumber) {
      const state = this.get();
      const day = Number(dayNumber);
      state.completedDays = state.completedDays.filter(d => d !== day);
      this.save(state);
      return state;
    },

    // Iniciar novo ciclo devocional de 9 dias
    reset: function(newIntention) {
      const state = this.get();
      state.started = true;
      state.startDate = new Date().toISOString();
      state.intention = (newIntention !== undefined ? newIntention : state.intention).trim();
      state.completedDays = [];
      state.cycle = (state.cycle || 1) + 1;
      state.lastCompletedAt = null;
      this.save(state);
      return state;
    },

    // Verificar se um dia específico está concluído
    isCompleted: function(dayNumber) {
      const state = this.get();
      return state.completedDays.includes(Number(dayNumber));
    },

    // Verificar se um dia específico está liberado para oração
    // Regra: Dia 1 sempre liberado. Dia N liberado se Dia N-1 estiver concluído.
    isUnlocked: function(dayNumber) {
      const day = Number(dayNumber);
      if (day === 1) return true;
      const state = this.get();
      return state.completedDays.includes(day - 1);
    },

    // Retorna o dia atual que o fiel deve rezar (1 a 9, ou 9 se tudo completo)
    getCurrentActiveDay: function() {
      const state = this.get();
      for (let d = 1; d <= 9; d++) {
        if (!state.completedDays.includes(d)) {
          return d;
        }
      }
      return 9;
    },

    // Retorna se a novena de 9 dias foi 100% concluída
    isFinished: function() {
      const state = this.get();
      return state.completedDays.length >= 9;
    },

    // Calcula a data real formatada no calendário para um dia (1 a 9)
    getDayDateInfo: function(dayNumber) {
      const state = this.get();
      let baseDate = state.startDate ? new Date(state.startDate) : new Date();
      if (isNaN(baseDate.getTime())) baseDate = new Date();

      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + (Number(dayNumber) - 1));

      const today = new Date();
      const isToday = targetDate.getDate() === today.getDate() &&
                      targetDate.getMonth() === today.getMonth() &&
                      targetDate.getFullYear() === today.getFullYear();

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const isTomorrow = targetDate.getDate() === tomorrow.getDate() &&
                         targetDate.getMonth() === tomorrow.getMonth() &&
                         targetDate.getFullYear() === tomorrow.getFullYear();

      const dayStr = String(targetDate.getDate()).padStart(2, '0');
      const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
      const weekdayStr = WEEKDAYS[targetDate.getDay()];
      const monthNameStr = MONTHS[targetDate.getMonth()];

      let relativeLabel = `${dayStr}/${monthStr} · ${weekdayStr}`;
      if (isToday) {
        relativeLabel = `Hoje · ${dayStr}/${monthStr}`;
      } else if (isTomorrow) {
        relativeLabel = `Amanhã · ${dayStr}/${monthStr}`;
      }

      return {
        date: targetDate,
        dayStr: dayStr,
        monthStr: monthStr,
        weekdayStr: weekdayStr,
        monthNameStr: monthNameStr,
        label: relativeLabel,
        isToday: isToday,
        isTomorrow: isTomorrow
      };
    }
  };
})();

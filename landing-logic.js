/**
 * Lógica pura da landing (countdown, scroll derivado, FAQ, stats, contadores).
 * Usada por script.js e pelos testes Vitest.
 */

export const MS_SECOND = 1000;
export const MS_MINUTE = 60 * MS_SECOND;
export const MS_HOUR = 60 * MS_MINUTE;
export const MS_DAY = 24 * MS_HOUR;

export const DEFAULT_COUNTDOWN_TTL_MS = 7 * MS_DAY;

/** Seletores dos blocos com fade-in ao scroll (espelha script.js). */
export const FADE_IN_SELECTOR_LIST = [
  '.feature-card',
  '.module-card',
  '.testimonial-card',
  '.pricing-card',
  '.publico__grid',
  '.faq-item',
  '.ad-card',
  '.bonus-card',
  '.glosa-tip',
  '.numero-card',
  '.jornada__step',
  '.diff-item',
  '.certificado__doc',
  '.garantia__box',
  '.instrutora__grid',
];

export function getFadeInSelectorString() {
  return FADE_IN_SELECTOR_LIST.join(', ');
}

/**
 * @param {string | null | undefined} raw Valor lido do localStorage
 * @returns {number} ms ou NaN se inválido
 */
export function parseStoredDeadlineMs(raw) {
  if (raw == null || raw === '') return NaN;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Prazo inicial quando não há valor válido guardado.
 * @param {number} nowMs
 * @param {number} [ttlMs]
 */
export function computeFreshDeadlineMs(nowMs, ttlMs = DEFAULT_COUNTDOWN_TTL_MS) {
  return nowMs + ttlMs;
}

/**
 * Resolve prazo a partir do texto guardado: mantém se válido; senão cria novo.
 * @param {string | null | undefined} raw
 * @param {number} nowMs
 * @param {number} [ttlMs]
 */
export function resolveDeadlineFromStorage(raw, nowMs, ttlMs = DEFAULT_COUNTDOWN_TTL_MS) {
  const parsed = parseStoredDeadlineMs(raw);
  if (Number.isFinite(parsed)) return parsed;
  return computeFreshDeadlineMs(nowMs, ttlMs);
}

/**
 * Se o prazo já passou, renova a partir de agora (comportamento do countdown na página).
 * @param {number} deadlineMs
 * @param {number} nowMs
 * @param {number} [ttlMs]
 * @returns {{ deadlineMs: number, renewed: boolean }}
 */
export function renewDeadlineIfExpired(deadlineMs, nowMs, ttlMs = DEFAULT_COUNTDOWN_TTL_MS) {
  const distance = deadlineMs - nowMs;
  if (distance >= 0) {
    return { deadlineMs, renewed: false };
  }
  return { deadlineMs: nowMs + ttlMs, renewed: true };
}

/**
 * Distância em ms até o prazo (pode ser negativa antes de renew).
 */
export function distanceToDeadline(deadlineMs, nowMs) {
  return deadlineMs - nowMs;
}

/**
 * Partes inteiras do countdown (não negativas na UI).
 * @param {number} distanceMs
 */
export function splitCountdownParts(distanceMs) {
  const dMs = Number.isFinite(distanceMs) && distanceMs > 0 ? distanceMs : 0;
  const days = Math.floor(dMs / MS_DAY);
  const hours = Math.floor((dMs % MS_DAY) / MS_HOUR);
  const minutes = Math.floor((dMs % MS_HOUR) / MS_MINUTE);
  const seconds = Math.floor((dMs % MS_MINUTE) / MS_SECOND);
  return { days, hours, minutes, seconds };
}

export function padTimeUnit(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}

/**
 * Cabeçalho fixo: sombra após rolagem.
 */
export function shouldHeaderShowScrolledState(scrollY, threshold = 50) {
  return scrollY > threshold;
}

/**
 * Barra CTA fixa no mobile: após sair do hero e antes da seção de preço entrar no viewport.
 */
export function shouldShowMobileCtaBar(heroBottom, precoTop, viewportHeight) {
  return heroBottom < 0 && precoTop > viewportHeight;
}

/**
 * Observer dos números do hero: qualquer entrada visível dispara animação.
 * @param {Array<{ isIntersecting?: boolean }>} entries
 */
export function statsEntriesTriggerCounters(entries) {
  if (!Array.isArray(entries)) return false;
  return entries.some((e) => Boolean(e && e.isIntersecting));
}

/**
 * scrollIntoView behavior conforme prefers-reduced-motion.
 */
export function anchorScrollBehavior(reducedMotion) {
  return reducedMotion ? 'auto' : 'smooth';
}

/**
 * Clique no FAQ: se já estava ativo, fecha tudo; senão abre o item (fecha outros antes).
 * @param {boolean} wasActive
 * @returns {'close-all' | 'open-this'}
 */
export function faqClickAction(wasActive) {
  return wasActive ? 'close-all' : 'open-this';
}

/**
 * Passo da animação dos contadores (mesma fórmula que script.js).
 * @param {number} target
 * @param {number} durationMs
 * @param {number} frameMs
 */
export function statAnimationStep(target, durationMs, frameMs = 16) {
  if (!Number.isFinite(target) || target <= 0) return 0;
  return target / (durationMs / frameMs);
}

/**
 * Um frame da animação: estado float interno, valor exibido (inteiro) e se terminou.
 * @param {number} currentFloat
 * @param {number} step
 * @param {number} target
 */
export function statAnimationAfterTick(currentFloat, step, target) {
  const next = currentFloat + step;
  if (next < target) {
    return { currentFloat: next, displayValue: Math.floor(next), done: false };
  }
  return { currentFloat: target, displayValue: target, done: true };
}

/**
 * Valor inicial do contador a partir de data-* (fixed tem prioridade).
 * @param {{ fixed?: string, target?: string }} dataset
 */
export function statInitialTextFromDataset(dataset) {
  if (dataset.fixed != null && dataset.fixed !== '') {
    return String(dataset.fixed);
  }
  const t = Number(dataset.target);
  if (!Number.isFinite(t) || t <= 0) return null;
  return '0';
}

/**
 * Se deve animar o contador numérico (há target válido e sem fixed).
 */
export function shouldAnimateStatCounter(dataset) {
  if (dataset.fixed != null && dataset.fixed !== '') return false;
  const t = Number(dataset.target);
  return Number.isFinite(t) && t > 0;
}

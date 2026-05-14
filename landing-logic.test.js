import { describe, expect, it } from 'vitest';
import {
  anchorScrollBehavior,
  computeFreshDeadlineMs,
  DEFAULT_COUNTDOWN_TTL_MS,
  distanceToDeadline,
  faqClickAction,
  FADE_IN_SELECTOR_LIST,
  getFadeInSelectorString,
  MS_DAY,
  padTimeUnit,
  parseStoredDeadlineMs,
  renewDeadlineIfExpired,
  resolveDeadlineFromStorage,
  shouldAnimateStatCounter,
  shouldHeaderShowScrolledState,
  shouldShowMobileCtaBar,
  splitCountdownParts,
  statAnimationAfterTick,
  statAnimationStep,
  statInitialTextFromDataset,
  statsEntriesTriggerCounters,
} from './landing-logic.js';

describe('constantes', () => {
  it('DEFAULT_COUNTDOWN_TTL_MS equivale a 7 dias', () => {
    expect(DEFAULT_COUNTDOWN_TTL_MS).toBe(7 * MS_DAY);
  });

  it('FADE_IN_SELECTOR_LIST não está vazia', () => {
    expect(FADE_IN_SELECTOR_LIST.length).toBeGreaterThan(0);
  });
});

describe('getFadeInSelectorString', () => {
  it('junta os seletores com vírgula e espaço', () => {
    const s = getFadeInSelectorString();
    expect(s).toBe(FADE_IN_SELECTOR_LIST.join(', '));
    expect(s).toContain('.feature-card');
    expect(s).toContain('.faq-item');
  });
});

describe('parseStoredDeadlineMs', () => {
  it('parse número válido', () => {
    expect(parseStoredDeadlineMs('1700000000000')).toBe(1700000000000);
  });

  it('retorna NaN para vazio, null ou não numérico', () => {
    expect(parseStoredDeadlineMs('')).toBeNaN();
    expect(parseStoredDeadlineMs(null)).toBeNaN();
    expect(parseStoredDeadlineMs(undefined)).toBeNaN();
    expect(parseStoredDeadlineMs('x')).toBeNaN();
  });

  it('Infinity não é aceite', () => {
    expect(parseStoredDeadlineMs('Infinity')).toBeNaN();
  });
});

describe('computeFreshDeadlineMs', () => {
  it('soma ttl ao now', () => {
    expect(computeFreshDeadlineMs(1000, 5000)).toBe(6000);
    expect(computeFreshDeadlineMs(0)).toBe(DEFAULT_COUNTDOWN_TTL_MS);
  });
});

describe('resolveDeadlineFromStorage', () => {
  it('usa valor guardado quando finito', () => {
    expect(resolveDeadlineFromStorage('5000', 1000)).toBe(5000);
  });

  it('cria novo prazo quando inválido', () => {
    const now = 1_000_000;
    expect(resolveDeadlineFromStorage('', now)).toBe(now + DEFAULT_COUNTDOWN_TTL_MS);
    expect(resolveDeadlineFromStorage('bad', now)).toBe(now + DEFAULT_COUNTDOWN_TTL_MS);
  });
});

describe('renewDeadlineIfExpired', () => {
  it('não renova quando ainda há tempo', () => {
    const now = 1e12;
    const deadline = now + MS_DAY;
    expect(renewDeadlineIfExpired(deadline, now)).toEqual({ deadlineMs: deadline, renewed: false });
  });

  it('renova quando prazo passou', () => {
    const now = 2e12;
    const deadline = now - 1000;
    const ttl = MS_DAY;
    expect(renewDeadlineIfExpired(deadline, now, ttl)).toEqual({
      deadlineMs: now + ttl,
      renewed: true,
    });
  });

  it('distance zero não renova', () => {
    const now = 5e12;
    expect(renewDeadlineIfExpired(now, now)).toEqual({ deadlineMs: now, renewed: false });
  });
});

describe('distanceToDeadline', () => {
  it('diferença em ms', () => {
    expect(distanceToDeadline(1100, 100)).toBe(1000);
    expect(distanceToDeadline(100, 200)).toBe(-100);
  });
});

describe('splitCountdownParts', () => {
  it('decompõe 1 dia + 1h + 1min + 1s', () => {
    const ms = MS_DAY + 3600000 + 60000 + 1000;
    expect(splitCountdownParts(ms)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
  });

  it('zero para não finito ou não positivo', () => {
    expect(splitCountdownParts(-1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(splitCountdownParts(NaN)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('padTimeUnit', () => {
  it('preenche com zero à esquerda', () => {
    expect(padTimeUnit(3)).toBe('03');
    expect(padTimeUnit(12)).toBe('12');
  });

  it('aceita float e negativo com piso', () => {
    expect(padTimeUnit(3.7)).toBe('03');
    expect(padTimeUnit(-1)).toBe('00');
  });
});

describe('shouldHeaderShowScrolledState', () => {
  it('true acima do limiar (default 50)', () => {
    expect(shouldHeaderShowScrolledState(51)).toBe(true);
    expect(shouldHeaderShowScrolledState(50)).toBe(false);
  });

  it('limiar customizável', () => {
    expect(shouldHeaderShowScrolledState(10, 10)).toBe(false);
    expect(shouldHeaderShowScrolledState(11, 10)).toBe(true);
  });
});

describe('shouldShowMobileCtaBar', () => {
  it('mostra após hero e preço abaixo da viewport', () => {
    expect(shouldShowMobileCtaBar(-1, 900, 800)).toBe(true);
  });

  it('oculto ainda no hero', () => {
    expect(shouldShowMobileCtaBar(100, 900, 800)).toBe(false);
  });

  it('oculto quando preço já visível', () => {
    expect(shouldShowMobileCtaBar(-1, 400, 800)).toBe(false);
  });
});

describe('statsEntriesTriggerCounters', () => {
  it('false para não-array', () => {
    expect(statsEntriesTriggerCounters(null)).toBe(false);
    expect(statsEntriesTriggerCounters(undefined)).toBe(false);
  });

  it('false quando nenhum intersecting', () => {
    expect(statsEntriesTriggerCounters([{ isIntersecting: false }])).toBe(false);
  });

  it('true quando algum intersecting', () => {
    expect(statsEntriesTriggerCounters([{ isIntersecting: false }, { isIntersecting: true }])).toBe(
      true
    );
  });
});

describe('anchorScrollBehavior', () => {
  it('auto com redução de movimento', () => {
    expect(anchorScrollBehavior(true)).toBe('auto');
  });

  it('smooth sem redução', () => {
    expect(anchorScrollBehavior(false)).toBe('smooth');
  });
});

describe('faqClickAction', () => {
  it('item ativo fecha tudo', () => {
    expect(faqClickAction(true)).toBe('close-all');
  });

  it('item inativo abre este', () => {
    expect(faqClickAction(false)).toBe('open-this');
  });
});

describe('statAnimationStep', () => {
  it('zero para target inválido', () => {
    expect(statAnimationStep(0, 2000)).toBe(0);
    expect(statAnimationStep(NaN, 2000)).toBe(0);
  });

  it('passo proporcional a target/duração*frame', () => {
    const step = statAnimationStep(50, 2000, 16);
    expect(step).toBeCloseTo(50 / (2000 / 16), 10);
  });
});

describe('statAnimationAfterTick', () => {
  it('avança enquanto abaixo do target', () => {
    const r = statAnimationAfterTick(0, 10, 50);
    expect(r.done).toBe(false);
    expect(r.displayValue).toBe(10);
    expect(r.currentFloat).toBe(10);
  });

  it('termina no target', () => {
    const r = statAnimationAfterTick(45, 10, 50);
    expect(r.done).toBe(true);
    expect(r.displayValue).toBe(50);
    expect(r.currentFloat).toBe(50);
  });
});

describe('statInitialTextFromDataset', () => {
  it('prioridade a fixed', () => {
    expect(statInitialTextFromDataset({ fixed: '—', target: '10' })).toBe('—');
  });

  it('zero inicial quando há target válido', () => {
    expect(statInitialTextFromDataset({ target: '5' })).toBe('0');
  });

  it('null sem target válido', () => {
    expect(statInitialTextFromDataset({})).toBe(null);
    expect(statInitialTextFromDataset({ target: '0' })).toBe(null);
  });
});

describe('shouldAnimateStatCounter', () => {
  it('false com fixed', () => {
    expect(shouldAnimateStatCounter({ fixed: 'x' })).toBe(false);
  });

  it('false sem target positivo', () => {
    expect(shouldAnimateStatCounter({ target: '' })).toBe(false);
    expect(shouldAnimateStatCounter({ target: '0' })).toBe(false);
  });

  it('true com target positivo e sem fixed', () => {
    expect(shouldAnimateStatCounter({ target: '50' })).toBe(true);
  });
});

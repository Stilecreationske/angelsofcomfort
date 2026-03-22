const TALIA_MESSAGE_COPY =
  "Hi, I'm Talia — your virtual care assistant. I'm powered by AI, but designed with heart. I'm here to help you find answers, book care, and bring peace of mind. How can I help you today?";

const assignStyles = (element: Element | null, styles: Partial<CSSStyleDeclaration>, flag: string) => {
  if (!element || !(element instanceof HTMLElement)) return;
  if (element.dataset[flag]) return;
  Object.assign(element.style, styles);
  element.dataset[flag] = 'true';
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
  const intVal = parseInt(full, 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
};

const mixWithWhite = (hex: string, ratio = 0.8) => {
  try {
    const { r, g, b } = hexToRgb(hex);
    const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  } catch {
    return '#fffbf7';
  }
};

const buildPalette = (widget: HTMLElement | null) => {
  const base = widget?.getAttribute('base-bg-color') ?? '#ba5927';
  const accent = widget?.getAttribute('accent-color') ?? '#3c2b1c';
  const cta = widget?.getAttribute('cta-button-color') ?? '#ba5927';
  const ctaText = widget?.getAttribute('cta-button-text-color') ?? '#ffffff';
  return {
    headerBg: base,
    headerText: '#ffffff',
    panelBg: mixWithWhite(base, 0.9),
    bubbleBg: mixWithWhite(base, 0.8),
    textColor: accent,
    borderColor: mixWithWhite(base, 0.4),
    ctaColor: cta,
    ctaText,
  };
};

const styleVapiShadow = (shadow: ShadowRoot, palette: ReturnType<typeof buildPalette>) => {
  const panel =
    (shadow.querySelector('[role="dialog"]') as HTMLElement) ||
    (shadow.querySelector('[data-testid*="widget"]') as HTMLElement) ||
    (shadow.firstElementChild as HTMLElement | null);

  assignStyles(
    panel,
    {
      borderRadius: '28px',
      background: palette.panelBg,
      boxShadow: '0 28px 80px -40px rgba(12, 24, 21, 0.45)',
      border: `1px solid ${palette.borderColor}`,
      overflow: 'hidden',
      fontFamily: "'Open Sans', sans-serif",
      color: palette.textColor,
    },
    'aocPanel',
  );

  const header =
    (panel?.querySelector('header') as HTMLElement) ||
    (panel?.querySelector('[role="banner"]') as HTMLElement) ||
    (panel?.firstElementChild as HTMLElement | null);

  assignStyles(
    header,
    {
      background: palette.headerBg,
      color: palette.headerText,
      padding: '16px 20px',
      fontFamily: "'Lora', serif",
      fontSize: '1.05rem',
      fontWeight: '600',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    'aocHeader',
  );

  if (header) {
    header.querySelectorAll('*').forEach((node) => {
      if (node instanceof HTMLElement) {
        node.style.color = palette.headerText;
        node.style.fontFamily = "'Lora', serif";
      }
    });
  }

  const taliaMessageNode = Array.from(shadow.querySelectorAll('p, div')).find((el) =>
    el.textContent?.trim().startsWith("Hi, I'm Talia"),
  );
  const taliaBubble = taliaMessageNode?.closest('div');

  assignStyles(
    taliaBubble,
    {
      background: palette.bubbleBg,
      borderRadius: '24px',
      padding: '18px',
      boxShadow: `inset 0 0 0 1px ${palette.borderColor}`,
      color: palette.textColor,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.95rem',
      lineHeight: '1.5',
    },
    'aocMessage',
  );

  if (taliaMessageNode && taliaMessageNode.textContent !== TALIA_MESSAGE_COPY) {
    taliaMessageNode.textContent = TALIA_MESSAGE_COPY;
  }

  const composerInput =
    (shadow.querySelector('textarea') as HTMLElement) ||
    (shadow.querySelector('input[type="text"]') as HTMLElement);
  assignStyles(
    composerInput,
    {
      borderRadius: '999px',
      border: '1px solid rgba(60, 43, 28, 0.35)',
      padding: '12px 18px',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.95rem',
      color: palette.textColor,
      background: '#ffffff',
      boxShadow: 'none',
      outline: 'none',
    },
    'aocComposer',
  );

  const sendButton =
    (composerInput?.parentElement?.querySelector('button') as HTMLElement) ||
    (composerInput?.closest('form')?.querySelector('button') as HTMLElement | null);
  assignStyles(
    sendButton,
    {
      background: palette.ctaColor,
      color: palette.ctaText,
      borderRadius: '16px',
      padding: '10px 14px',
      boxShadow: '0 8px 18px rgba(0,0,0,0.2)',
    },
    'aocSend',
  );

  const footer = Array.from(shadow.querySelectorAll('p, span')).find((el) =>
    el.textContent?.toLowerCase().includes('powered'),
  );
  assignStyles(
    footer,
    {
      color: palette.ctaColor,
      fontWeight: '600',
    },
    'aocFooter',
  );
};

export const initVapiWidgetBranding = () => {
  if (typeof window === 'undefined') return;

  const attachBranding = (attempt = 0) => {
    const widget = document.querySelector('vapi-widget') as (HTMLElement & { shadowRoot?: ShadowRoot }) | null;
    if (!widget) {
      if (attempt < 20) setTimeout(() => attachBranding(attempt + 1), 500);
      return;
    }

    const applyBranding = () => {
      const shadow = widget.shadowRoot;
      if (!shadow) {
        if (attempt < 20) setTimeout(() => attachBranding(attempt + 1), 500);
        return;
      }
      const palette = buildPalette(widget);
      styleVapiShadow(shadow, palette);
      if ((widget as any)._aocVapiObserver) return;
      const observer = new MutationObserver(() => styleVapiShadow(shadow, palette));
      observer.observe(shadow, { childList: true, subtree: true });
      (widget as any)._aocVapiObserver = observer;
    };

    if (customElements.get('vapi-widget')) {
      applyBranding();
    } else {
      customElements.whenDefined('vapi-widget').then(applyBranding);
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    attachBranding();
  } else {
    window.addEventListener('DOMContentLoaded', () => attachBranding(), { once: true });
  }
};

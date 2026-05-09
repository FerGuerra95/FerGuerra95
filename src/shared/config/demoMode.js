const rawDemoMode = String(
  import.meta.env.VITE_PUBLIC_DEMO_MODE ||
    import.meta.env.VITE_DEMO_MODE ||
    ''
).toLowerCase();

export const IS_PUBLIC_DEMO_MODE = rawDemoMode === 'true';

export const SHOW_DEMO_TOOLS = IS_PUBLIC_DEMO_MODE;

export const DEMO_BUTTON_LABELS = {
  ma: 'Preparar caso M&A',
  compliance: 'Preparar caso Compliance',
  funding: 'Preparar caso Funding'
};

export const DEMO_RESET_LABELS = {
  ma: 'Limpiar M&A',
  compliance: 'Limpiar Compliance',
  funding: 'Limpiar Funding'
};

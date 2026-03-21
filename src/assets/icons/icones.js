export const ICONES = {
  remedio: { emoji: '💊', label: 'Remédio' },
  pressao: { emoji: '🩺', label: 'Aferir Pressão' },
  hidratar: { emoji: '💧', label: 'Hidratar' },
  refeicao: { emoji: '🍽️', label: 'Refeição' },
  curativo: { emoji: '🩹', label: 'Curativo' },
};

export const ICONES_LISTA = Object.entries(ICONES).map(([key, val]) => ({
  key,
  ...val,
}));

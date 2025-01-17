export const COLORS: string[] = [
  '#C70039', // Vermelho escuro
  '#8A2BE2', // Azul violeta
  '#581845', // Roxo escuro
  '#FF5733', // Vermelho vibrante
  '#FA8072', // Salmão
  '#1E90FF', // Azul brilhante
  '#FF33FF', // Rosa choque
  '#900C3F', // Vinho
  '#FF8C00', // Laranja escuro
  '#DC143C', // Carmesim
  '#FF4500', // Laranja avermelhado
  '#4B0082', // Índigo
  '#FF1493', // Rosa profundo
  '#FF6347', // Tomate
  '#FFC300', // Amarelo ouro
  '#FF00FF', // Fúcsia
  '#EE82EE', // Violeta
  '#4169E1', // Azul royal
  '#FF69B4', // Rosa claro
  '#FFD700', // Dourado
];

export function getColorByIndex(index: number): string {
  const safeIndex = index % COLORS.length;
  return COLORS[safeIndex];
}

export function getSelectionColor(): string {
  return '#4caf50';
}

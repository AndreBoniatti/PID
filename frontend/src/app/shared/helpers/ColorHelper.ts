export const COLORS: string[] = [
  '#C70039', // Vermelho escuro
  '#8A2BE2', // Azul violeta
  '#581845', // Roxo escuro
  '#FF5733', // Vermelho vibrante
  '#FFC300', // Amarelo ouro
  '#1E90FF', // Azul brilhante
  '#FF33FF', // Rosa choque
  '#900C3F', // Vinho
  '#FF8C00', // Laranja escuro
  '#DC143C', // Carmesim
  '#FF4500', // Laranja avermelhado
  '#4B0082', // Índigo
  '#FF1493', // Rosa profundo
  '#FF6347', // Tomate
  '#FFD700', // Dourado
  '#FA8072', // Salmão
  '#FF00FF', // Fúcsia
  '#EE82EE', // Violeta
  '#4169E1', // Azul royal
  '#FF69B4', // Rosa claro
];

export function getColorByIndex(index: number): string {
  const safeIndex = index % COLORS.length;
  return COLORS[safeIndex];
}

export function getSelectionColor(): string {
  return '#4caf50';
}

export function formatARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProductPrice(value: number): string {
  return value > 0 ? formatARS(value) : 'Consultar precio';
}

// Shared silhouettes keep the bouquet and the moving field visually consistent.
export type FlowerKind = 'sunflower' | 'daisy' | 'tulip' | 'poppy';
export const flowerKinds: FlowerKind[] = ['sunflower', 'daisy', 'tulip', 'poppy'];
export function flowerShape(kind: FlowerKind) {
  switch (kind) {
    case 'daisy': return { petals: 17, path: 'M-3 -8 C-12 -27 -10 -61 0 -65 C10 -61 12 -27 3 -8Z', center: 10, color: '#d69a22' };
    case 'poppy': return { petals: 5, path: 'M-5 -4 C-42 -12 -43 -51 -23 -59 C-8 -67 25 -61 30 -44 C34 -24 16 -10 5 -4Z', center: 9, color: '#8b681b' };
    case 'tulip': return { petals: 1, path: 'M0 35 C-40 25 -43 -16 -38 -50 L-16 -29 L0 -63 L17 -29 L38 -50 C45 -10 37 28 0 35Z', center: 0, color: '#dfae2c' };
    default: return { petals: 13, path: 'M-5 -12 C-24 -34 -15 -63 0 -66 C16 -53 22 -32 5 -12Z', center: 19, color: '#49311e' };
  }
}

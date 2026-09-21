export type FlowerKind = 'rose' | 'peony';
export const bouquetKinds: FlowerKind[] = ['peony', 'rose', 'peony', 'rose', 'rose', 'peony', 'rose'];
// Petals overlap from the outside inward: cupped spirals for roses,
// more numerous, scalloped petals for the fuller peonies.
export function flowerPetals(kind: FlowerKind) {
  const layers = kind === 'rose' ? [5, 5, 4, 4, 3, 3] : [10, 11, 9, 8, 7, 5];
  return layers.flatMap((count, layer) => Array.from({ length: count }, (_, i) => ({
    angle: i * 360 / count + layer * (kind === 'rose' ? 43 : 19),
    scale: Math.pow(kind === 'rose' ? .72 : .76, layer),
    path: kind === 'rose'
      ? 'M-27 20 C-53 5 -62 -27 -42 -47 C-20 -66 17 -64 38 -44 C57 -27 42 1 20 17 C2 9 -9 8 -27 20Z'
      : 'M-17 16 C-39 4 -47 -23 -38 -40 C-43 -52 -27 -63 -18 -56 C-10 -69 4 -65 10 -58 C25 -67 37 -55 33 -44 C47 -35 34 -9 17 15 Q0 7 -17 16Z',
    light: kind === 'rose' ? '#ffed98' : '#fff1ae',
    shade: layer > 3 ? '#bf861b' : '#dab03b',
  })));
}

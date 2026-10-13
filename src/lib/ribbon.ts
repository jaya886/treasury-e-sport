// Path helpers for the HORI 80-style striped ribbon supergraphic.

export interface MeanderOptions {
  /** x of the first vertical run */
  x: number;
  /** y where the ribbon starts and ends (usually just outside the viewBox) */
  baseline: number;
  /** arc radius (half the horizontal distance between two verticals) */
  r: number;
  /**
   * Apex of each loop, measured from the top of the viewBox.
   * Loops alternate: up, down, up, … (first one is an "up" arch).
   */
  apexY: number[];
}

/**
 * Builds a meander: vertical runs joined by semicircles, alternating arch (∩) and cup (∪).
 * `loops` is the path without the opening move / closing run, for composing custom ends.
 */
export function meander({ x, baseline, r, apexY }: MeanderOptions) {
  let cx = x;
  let loops = '';
  let lastTurnY = baseline;
  const apexes: { x: number; y: number; up: boolean }[] = [];
  apexY.forEach((ay, i) => {
    const up = i % 2 === 0;
    const turnY = up ? ay + r : ay - r;
    loops += ` V ${turnY} A ${r} ${r} 0 0 ${up ? 1 : 0} ${cx + 2 * r} ${turnY}`;
    apexes.push({ x: cx + r, y: ay, up });
    cx += 2 * r;
    lastTurnY = turnY;
  });
  const d = `M ${x} ${baseline}${loops} V ${baseline}`;
  return { d, loops, apexes, endX: cx, lastTurnY };
}

/**
 * Stroke widths (outer → inner) that, used as alternating white/black mask strokes, draw `count`
 * parallel lines (odd number) of thickness `unit` with equal gaps.
 */
export function stripeWidths(count: number, unit: number) {
  return Array.from({ length: count }, (_, i) => ({ width: (2 * (count - i) - 1) * unit, on: i % 2 === 0 }));
}

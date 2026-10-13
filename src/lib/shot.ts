// Markup for the generic (non-branded) "match result" screenshot, used both in slide visuals
// and as an image attachment inside the Discord simulator. Styles live in styles/sim.css.

export interface ShotOptions {
  callouts?: boolean;
}

export function resultShotMarkup({ callouts = false }: ShotOptions = {}) {
  const c = (n: number) => (callouts ? `<span class="shot__callout" data-n="${n}">${n}</span>` : '');
  return `
<div class="shot${callouts ? ' shot--callouts' : ''}">
  <div class="shot__top">
    <span class="shot__mode">LAGA KUSTOM · Bo3</span>
    <span class="shot__id">Match ID: <b>7491 2635 08</b>${c(3)}</span>
  </div>
  <div class="shot__banner">
    <span class="shot__win">MENANG${c(2)}</span>
  </div>
  <div class="shot__score">
    <div class="shot__team shot__team--a"><span class="shot__dot"></span>Elang Sulsel</div>
    <div class="shot__nums">2<i>—</i>1${c(1)}</div>
    <div class="shot__team shot__team--b">Laskar Maluku<span class="shot__dot"></span></div>
  </div>
  <div class="shot__rows">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</div>`;
}

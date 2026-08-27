// `behavior: 'instant'` isn't actually a standard ScrollBehavior value (the
// CSSOM spec only defines 'auto' and 'smooth' — Chrome added 'instant' as a
// non-standard extension, other browsers may not honor it) and this app sets
// a global CSS `scroll-behavior: smooth`. Rather than rely on 'instant' being
// respected everywhere, force the CSS behavior to 'auto' for the duration of
// the jump so it's guaranteed instant cross-browser, then restore it.
export function scrollInstantly(action: () => void) {
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  action();
  requestAnimationFrame(() => { html.style.scrollBehavior = prevBehavior; });
}

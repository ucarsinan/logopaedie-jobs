// Quellenlinks bereits im gerenderten Artikel kennzeichnen, auch ohne JavaScript.
export default function externeQuellen({ site }) {
  const portalHost = new URL(site).hostname;
  function visit(node) {
    const href = node.tagName === 'a' && node.properties?.href;
    if (typeof href === 'string' && /^(https?:)?\/\//i.test(href)) {
      const url = new URL(href, site);
      if (url.hostname.replace(/^www\./, '') !== portalHost) {
        node.properties.target = '_blank';
        node.properties.rel = [...new Set([...(node.properties.rel ?? []), 'noopener'])];
        node.children.push({
          type: 'element', tagName: 'span', properties: { className: ['sr-only'] },
          children: [{ type: 'text', value: ' (öffnet in einem neuen Tab)' }],
        });
      }
    }
    node.children?.forEach(visit);
  }
  return visit;
}

"""Prüft den aktuellen Astro-Produktionsbuild und den URL-Bestand vor V8, ohne Netzwerk."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import json
import sys
import xml.etree.ElementTree as ET


SITE = 'https://xn--logopdiejobs-kcb.de'
ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'dist/client'
JOB = '/jobs/logopaedin-sprachtherapeut-duisburg/'


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.meta = {}
        self.ids = set()
        self.links = []
        self.canonicals = []
        self.schemas = []
        self.title = ''
        self.h1_count = 0
        self.field = None
        self.feed(file.read_text())
        self.close()

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if tag == 'meta':
            self.meta[attr.get('property') or attr.get('name')] = attr.get('content', '')
        if tag == 'link' and attr.get('rel') == 'canonical':
            self.canonicals.append(attr.get('href'))
        if tag == 'a' and attr.get('href'):
            self.links.append(attr['href'])
        if attr.get('id'):
            self.ids.add(attr['id'])
        if tag == 'title':
            self.field = 'title'
        if tag == 'script' and attr.get('type') == 'application/ld+json':
            self.field = 'schema'
        if tag == 'h1':
            self.h1_count += 1

    def handle_data(self, data):
        if self.field == 'title':
            self.title += data
        if self.field == 'schema':
            self.schemas.append(json.loads(data))

    def handle_endtag(self, tag):
        if tag in ('title', 'script'):
            self.field = None


def main():
    pages = {'/' + file.relative_to(BUILD).as_posix().removesuffix('index.html'): Page(file)
             for file in BUILD.rglob('index.html')}
    sitemap = {entry.text for entry in ET.parse(BUILD / 'sitemap-0.xml').iterfind('.//{*}loc')}
    baseline = (ROOT / 'docs/seo/bestand-vor-v8.txt').read_text().splitlines()
    errors = []
    indexable = set()
    edges = {}
    for route, page in pages.items():
        canonical = SITE + route
        if page.canonicals != [canonical]:
            errors.append(f'{route} Canonical: {page.canonicals}')
        if page.h1_count != 1 or not page.title or not page.meta.get('description'):
            errors.append(f'{route} Titel, Beschreibung oder H1 prüfen')
        if 'noindex' not in page.meta.get('robots', '').lower():
            indexable.add(route)
            for key in ('og:image', 'twitter:image'):
                image = urlsplit(page.meta.get(key, ''))
                if (image.netloc != urlsplit(SITE).netloc or
                        not (BUILD / unquote(image.path).lstrip('/')).is_file()):
                    errors.append(f'{route} Fehlendes Vorschaubild für {key}')
        postings = [s for s in page.schemas if s.get('@type') == 'JobPosting']
        if len(postings) != int(route == JOB and route in indexable):
            errors.append(f'{route} Unerwartete Zahl an JobPostings')
        edges[route] = set()
        for href in page.links:
            target = urlsplit(urljoin(canonical, href))
            if target.netloc != urlsplit(SITE).netloc:
                continue
            if target.path in pages:
                edges[route].add(target.path)
                if target.fragment and unquote(target.fragment) not in pages[target.path].ids:
                    errors.append(f'{route} Fehlende Sprungmarke: {href}')
            elif not (BUILD / unquote(target.path).lstrip('/')).is_file():
                errors.append(f'{route} Fehlendes Linkziel: {href}')

    for route in baseline:
        if route.startswith('/') and route not in pages:
            errors.append(f'Fehlender Bestandspfad: {route}')
        elif route.startswith('/') and route != JOB and route not in indexable:
            errors.append(f'Bestandspfad nicht indexierbar: {route}')
    if sitemap != {SITE + path for path in indexable}:
        errors.append(f'Sitemap-Abweichung: {sitemap ^ {SITE + path for path in indexable}}')
    if 'noindex' not in Page(BUILD / '404.html').meta.get('robots', ''):
        errors.append('Direkt abrufbare Fehlerseite ohne noindex')
    for field in ('title', 'description'):
        values = Counter(pages[r].title if field == 'title' else pages[r].meta[field] for r in indexable)
        errors.extend(f'{field} doppelt: {value}' for value, count in values.items() if count > 1)
    seen, queue = set(), ['/']
    while queue:
        route = queue.pop()
        if route not in seen:
            seen.add(route)
            queue.extend(edges[route] - seen)
    errors.extend(f'Von der Startseite nicht verlinkt: {r}' for r in sorted(indexable - seen))
    if errors:
        sys.exit('\n'.join(sorted(set(errors))))
    print(f'{len(pages)} Inhalts- und Funktionsseiten, {len(sitemap)} indexierbare URLs. '
          'Altpfade, Canonicals, Metadaten, interne Links, Sprungziele und JobPosting-Verteilung geprüft.')


if __name__ == '__main__':
    main()

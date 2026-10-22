/**
 * Glossary hover-tooltip helper.
 *
 * Neemt een HTML-string en wrapt de eerste voorkomen van elke bekende term
 * in een <abbr title="korte definitie"> tag. De browser toont dan zijn
 * native tooltip on hover - geen JS-client-component nodig. globals.css
 * styled `abbr[title]` als een dotted-underlined klikbare hint.
 *
 * Wordt gebruikt in blog- en kennis-body's die via dangerouslySetInnerHTML
 * gerenderd worden. Alleen buiten <a>, <h*>, <code> en al bestaande <abbr>
 * tags wrappen zodat we geen dubbele decoratie of nested links krijgen.
 */

type GlossaryEntry = { term: string; short: string; slug: string };

// Volgorde maakt uit: langste term eerst, zodat "PDE5-remmer" niet als "PDE5" gematcht wordt.
export const GLOSSARY: GlossaryEntry[] = [
  { slug: "pde5-remmer", term: "PDE5-remmer", short: "Middel dat het enzym PDE5 remt, zoals sildenafil en tadalafil" },
  { slug: "pde5-remmer", term: "PDE5", short: "Fosfodiesterase type 5, het enzym dat cGMP afbreekt" },
  { slug: "sildenafil", term: "sildenafil", short: "Werkzame stof in Kamagra, Cenforce en Viagra. Werkt 4 tot 6 uur" },
  { slug: "tadalafil", term: "tadalafil", short: "Werkzame stof in Vidalista en Cialis. Werkt tot ongeveer 36 uur" },
  { slug: "vardenafil", term: "vardenafil", short: "Werkzame stof in Vilitra en Levitra. Werkt 4 tot 8 uur" },
  { slug: "dapoxetine", term: "dapoxetine", short: "Kortwerkende SSRI tegen vroegtijdige zaadlozing" },
  { slug: "ed", term: "erectiele disfunctie", short: "Terugkerende moeite om een erectie te krijgen of te houden" },
  { slug: "premature-ejaculatie", term: "premature ejaculatie", short: "Te snel klaarkomen, vaak binnen ongeveer een minuut" },
  { slug: "halfwaardetijd", term: "halfwaardetijd", short: "Tijd waarin de helft van de werkzame stof is afgebroken" },
  { slug: "onset", term: "onset", short: "Tijd tot het middel begint te werken" },
  { slug: "werkingsduur", term: "werkingsduur", short: "Periode waarin het middel zijn werk doet" },
  { slug: "nitraten", term: "nitraten", short: "Hartmedicatie die nooit samen met een PDE5-remmer mag" },
  { slug: "nitraten", term: "nitroglycerine", short: "Nitraat bij angina pectoris. Nooit combineren met PDE5-remmers" },
  { slug: "alfablokker", term: "alfablokker", short: "Prostaat- of bloeddrukmiddel dat de bloeddruk extra verlaagt" },
  { slug: "alfablokker", term: "tamsulosine", short: "Alfablokker bij prostaatklachten. Minimaal 4 tot 6 uur ertussen" },
  { slug: "poppers", term: "poppers", short: "Amylnitriet. In de praktijk een nitraat, dus levensgevaarlijk in combinatie" },
  { slug: "priapisme", term: "priapisme", short: "Erectie die langer dan 4 uur duurt. Spoedgeval" },
  { slug: "naion", term: "NAION", short: "Zeldzame oogaandoening met plotseling verlies van zicht" },
  { slug: "flushing", term: "flushing", short: "Blozen en warmte in gezicht en nek, veelvoorkomende bijwerking" },
  { slug: "hypotensie", term: "hypotensie", short: "Te lage bloeddruk" },
  { slug: "cgmp", term: "cGMP", short: "Stof die de zwellichamen ontspant en de erectie in stand houdt" },
  { slug: "stikstofmonoxide", term: "stikstofmonoxide", short: "Signaalstof die bij opwinding de erectie op gang brengt" },
  { slug: "generiek", term: "generiek", short: "Zelfde werkzame stof als het merk, andere naam en prijs" },
  { slug: "bioequivalentie", term: "bio-equivalent", short: "Geeft dezelfde bloedspiegel als het originele merkmiddel" },
  { slug: "titratie", term: "titratie", short: "Opbouwen naar de laagste dosering die voor jou werkt" },
  { slug: "oral-jelly", term: "oral jelly", short: "Sildenafil in gelvorm, wordt sneller opgenomen dan een tablet" },
  { slug: "blister", term: "blister", short: "Doordrukstrip met merknaam, sterkte, batchcode en houdbaarheidsdatum" },
  { slug: "batchcode", term: "batchcode", short: "Productiecode van de partij, staat op doos en blister" },
  { slug: "contra-indicatie", term: "contra-indicatie", short: "Reden om een middel juist niet te gebruiken" },
  { slug: "wisselwerking", term: "wisselwerking", short: "Ander middel dat de werking of de risico's beinvloedt" },
  { slug: "psychogene-ed", term: "psychogene", short: "Erectieprobleem met een psychische in plaats van lichamelijke oorzaak" },
];

// Zorg dat langste term eerst gematcht wordt.
const SORTED = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Wrapt de eerste voorkomen van elke bekende term in <abbr title="...">.
 * Skipt content binnen <a>, <h1-6>, <code>, <abbr>, en attribuut-waardes.
 * Werkt op HTML-string voordat je 'm door dangerouslySetInnerHTML rendert.
 */
export function highlightGlossary(html: string): string {
  if (!html) return html;

  // Splits op tags - alleen tekst-nodes bewerken zodat we geen attrs breken.
  const parts = html.split(/(<[^>]+>)/g);

  const wrapped = new Set<string>();
  // Skip-stack: welke omhullende tags mogen niet gematcht worden
  const skipTags = new Set(["a", "abbr", "h1", "h2", "h3", "h4", "h5", "h6", "code", "pre"]);
  const openStack: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if (part.startsWith("<")) {
      // Tag - update stack
      const closing = part.startsWith("</");
      const tagMatch = part.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
      if (tagMatch) {
        const tag = tagMatch[1].toLowerCase();
        if (skipTags.has(tag)) {
          if (closing) {
            const idx = openStack.lastIndexOf(tag);
            if (idx !== -1) openStack.splice(idx, 1);
          } else if (!part.endsWith("/>")) {
            openStack.push(tag);
          }
        }
      }
      continue;
    }

    // Tekst-node - skip als we in een skip-tag zitten
    if (openStack.length > 0) continue;

    let text = part;
    for (const entry of SORTED) {
      if (wrapped.has(entry.slug)) continue;
      const rx = new RegExp(`(^|[^a-zA-Z0-9À-ÿ])(${escapeRegex(entry.term)})(?=[^a-zA-Z0-9À-ÿ]|$)`, "i");
      const m = rx.exec(text);
      if (!m) continue;
      const before = m[1];
      const matched = m[2];
      const start = m.index + before.length;
      const end = start + matched.length;
      text =
        text.slice(0, start) +
        `<abbr title="${escapeAttr(entry.short)}">${matched}</abbr>` +
        text.slice(end);
      wrapped.add(entry.slug);
    }
    parts[i] = text;
  }

  return parts.join("");
}

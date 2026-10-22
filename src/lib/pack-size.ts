/**
 * Pakketgrootte uit specifications.Inhoud halen.
 *
 * De import vult Inhoud als vrije tekst: "10 tabletten", "7 zakjes",
 * "4 kauwtabletten", "12 tabletten". Een deel van de catalogus (o.a. een paar
 * Cenforce-rijen) heeft helemaal geen Inhoud. We parsen dus het eerste gehele
 * getal en geven null terug als dat er niet is - nooit een gok, want op de
 * prijstabel zou dat een verkeerde prijs-per-stuk opleveren.
 */
export function parsePackUnits(
  specifications?: Record<string, string> | null,
  name?: string | null,
): number | null {
  const raw = specifications?.["Inhoud"] ?? specifications?.["inhoud"];
  if (raw) {
    const m = String(raw).match(/(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }

  // Terugval op de productnaam, voor rijen waar Inhoud ontbreekt. Alleen een
  // getal dat direct voor een verpakkingswoord staat telt mee: "12 tabletten",
  // "7 zakjes". Een losse 100 uit "Cenforce 100mg" is de dosering en mag hier
  // nooit als pakketgrootte doorgaan, anders rekent de prijstabel onzin uit.
  if (name) {
    const m = String(name).match(
      /(\d+)\s*(tabletten|tablets|kauwtabletten|bruistabletten|zakjes|sachets|stuks|capsules)\b/i,
    );
    if (m) {
      const n = parseInt(m[1], 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }

  return null;
}

/** Het woord achter het getal: "tabletten", "zakjes", "kauwtabletten". */
export function parsePackUnitLabel(
  specifications?: Record<string, string> | null,
  name?: string | null,
): string | null {
  const raw = specifications?.["Inhoud"] ?? specifications?.["inhoud"];
  if (raw) {
    const m = String(raw).match(/\d+\s*(.+)$/);
    if (m) return m[1].trim();
  }
  if (name) {
    const m = String(name).match(
      /\d+\s*(tabletten|tablets|kauwtabletten|bruistabletten|zakjes|sachets|stuks|capsules)\b/i,
    );
    if (m) return m[1].toLowerCase();
  }
  return null;
}

/** Prijs per stuk in centen, of null als de inhoud onbekend is. */
export function pricePerUnitCents(priceCents: number, units: number | null): number | null {
  if (!units || units <= 0) return null;
  return priceCents / units;
}

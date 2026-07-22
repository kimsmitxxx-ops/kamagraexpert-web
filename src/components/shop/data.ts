/**
 * Shared static data voor kamagraexpert-web.
 * Product-catalog + blogs komen uit Supabase; deze file bevat alleen
 * hero-illustraties en category-tegel fallbacks voor de homepage.
 */

const catKamagra = "/assets/cat-kamagra.jpg";
const catCenforce = "/assets/cat-cenforce.jpg";
const catVidalista = "/assets/cat-vidalista.jpg";
const catVilitra = "/assets/cat-vilitra.jpg";
const catCombo = "/assets/cat-combo.jpg";

export interface MainCategory {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  to: string;
}

export const mainCategories: MainCategory[] = [
  { slug: "kamagra", name: "Kamagra", tagline: "Klassieke sildenafil 100 mg — snelle werking, betaalbaar.", image: catKamagra, to: "/winkel/kamagra" },
  { slug: "cenforce", name: "Cenforce", tagline: "Sildenafil in doseringen van 50 tot 200 mg voor precieze titratie.", image: catCenforce, to: "/winkel/cenforce" },
  { slug: "vidalista", name: "Vidalista", tadalafil: "", tagline: "Tadalafil — werking tot 36 uur, voor spontaniteit zonder timing.", image: catVidalista, to: "/winkel/vidalista" } as any,
  { slug: "vilitra", name: "Vilitra", tagline: "Vardenafil — vergelijkbaar met Levitra, snelle onset.", image: catVilitra, to: "/winkel/vilitra" },
  { slug: "combo-preparaten", name: "Combo-preparaten", tagline: "Sildenafil + dapoxetine voor ED én uitgestelde ejaculatie in één tablet.", image: catCombo, to: "/winkel/combo-preparaten" },
];

// Legacy exports — categoryContent + findCategoryContent zijn nog geïmporteerd
// door category-view.tsx (stof-cards); voor de ED-shop tonen we geen stof-cards
// dus we exporten een lege array.
export interface CategoryContent {
  slug: string;
  group: "anabolen" | "pct";
  name: string;
  aka: string[];
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string;
  longIntro?: string;
  keyFacts: { label: string; value: string }[];
  sections: { heading: string; body: string }[];
  faqs?: { q: string; a: string }[];
  usps?: string[];
  related?: string[];
  knowledge?: string[];
  resultImage?: string;
  resultImageAlt?: string;
}

export const categoryContent: CategoryContent[] = [];

export function findCategoryContent(slug: string): CategoryContent | undefined {
  return categoryContent.find((c) => c.slug === slug);
}

export function findCategoryContentByGroup(group: "anabolen" | "pct") {
  return categoryContent.filter((c) => c.group === group);
}

// Alias, sommige components importeren dit; retourneert een lege array
// omdat er in de ED-shop geen stof-cards zijn zoals bij anabolenpro.
export function categoriesByGroup(_group: "anabolen" | "pct"): CategoryContent[] {
  return [];
}

/**
 * Supabase-verbindingsgegevens op één plek.
 *
 * Beide waarden zijn PUBLIC (de anon key is bedoeld om in de browser te staan)
 * en staan hier hardcoded als fallback, omdat de Vercel-omgeving de env-vars
 * niet gezet heeft. Zonder die fallback viel de middleware stil terug op
 * "geen onderhoud" en bleef de onderhoudspagina dus uit.
 *
 * Zowel supabase.ts als middleware.ts leest hieruit, zodat die twee niet uit
 * elkaar kunnen lopen.
 */
export const SB_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rexqfwibxawqnvrzbdoo.supabase.co";

export const SB_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleHFmd2lieGF3cW52cnpiZG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODM1NzIsImV4cCI6MjA5MjM1OTU3Mn0.XQGZNdGcnZlALl7truWiPC5_uMYeMhWwIneTMNO8AhI";

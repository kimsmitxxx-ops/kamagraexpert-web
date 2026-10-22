import { AlertTriangle, Info } from "lucide-react";

interface Props {
  /**
   * Variant - `inline` voor een neutrale compact block (op product-pages),
   * `prominent` voor een opvallender block (op pagina's over risico en dosering).
   */
  variant?: "inline" | "prominent";
  /**
   * Optionele extra zin bovenop de standaard disclaimer. Bv. "Specifiek voor
   * X - overleg met je arts als je Y gebruikt."
   */
  extra?: string;
}

/**
 * Medische disclaimer-snippet voor E-E-A-T compliance op YMYL-content.
 * Plaats op product-pages en op kennisbank-artikelen over dosering of risico.
 *
 * De tekst benoemt de twee dingen die er bij PDE5-remmers echt toe doen: de
 * nitraat-combinatie en wanneer je een arts raadpleegt.
 */
export function MedicalDisclaimer({ variant = "inline", extra }: Props) {
  const isProminent = variant === "prominent";
  return (
    <aside
      role="note"
      aria-label="Medische disclaimer"
      className={
        isProminent
          ? "mt-10 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-5 text-sm text-amber-900"
          : "mt-8 rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900"
      }
    >
      <div className="flex items-start gap-2.5">
        {isProminent ? (
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1.5 leading-relaxed">
          <p>
            <strong>Disclaimer.</strong> De informatie op deze pagina is bedoeld om je te
            informeren en vervangt geen consult bij een arts. PDE5-remmers zoals sildenafil,
            tadalafil en vardenafil zijn in Nederland receptgeneesmiddelen; wij leveren ze zonder
            recept, waardoor er niemand met je meekijkt.
          </p>
          <p>
            Combineer ze <strong>nooit</strong> met nitraten of poppers: dat kan een
            levensgevaarlijke bloeddrukdaling geven. Overleg eerst met een arts bij hartklachten,
            een recent infarct of beroerte, een lage bloeddruk, lever- of nierproblemen, of bij
            gebruik van alfablokkers. Houdt een erectie langer dan vier uur aan of val je plots uit
            met je zicht, ga dan direct naar de spoedeisende hulp.
          </p>
          {extra && <p className="mt-2 font-medium">{extra}</p>}
        </div>
      </div>
    </aside>
  );
}

export default MedicalDisclaimer;

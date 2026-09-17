import React from 'react';
import { VisualElement } from '../types';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Thermometer, 
  HelpCircle, Heart
} from 'lucide-react';

interface EducationalVisualProps {
  visual: VisualElement;
}

export const EducationalVisual: React.FC<EducationalVisualProps> = ({ visual }) => {
  const { type, title, data, caption } = visual;

  return (
    <div className="my-4 rounded-xl border border-[#F2CCD6] bg-[#FFF8FA] p-3.5 sm:p-4.5 shadow-2xs text-right">
      {title && (
        <div className="flex items-center justify-between border-b border-[#F5D8E0] pb-2 mb-3">
          <span className="text-[11px] font-bold tracking-wider text-[#A8586B] uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D88A9C]" />
            مخطط تعليمي مصور
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-[#422129]">{title}</h4>
        </div>
      )}

      {/* RENDER BY TYPE */}
      {type === 'hair-anatomy' && (
        <div className="space-y-2.5">
          <div className="relative h-24 sm:h-28 rounded-lg overflow-hidden bg-gradient-to-r from-[#FDEEF1] via-[#FFF6F8] to-[#FCEBF0] flex items-center justify-center p-2 border border-[#F2CCD6]">
            {/* SVG Visual Hair Shaft Anatomy - Feminine Rose Edition */}
            <svg viewBox="0 0 320 90" className="w-full h-full">
              <defs>
                <linearGradient id="roseCuticleGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#EAB1BF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F9D7DF" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="roseCortexGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#D88A9C" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#A84C62" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Cuticle Outer Shell */}
              <rect x="20" y="10" width="280" height="70" rx="35" fill="url(#roseCuticleGrad)" stroke="#C86A80" strokeWidth="1.5" />
              {/* Scales pattern */}
              <path d="M 60 10 L 45 80 M 90 10 L 75 80 M 120 10 L 105 80 M 150 10 L 135 80 M 180 10 L 165 80 M 210 10 L 195 80 M 240 10 L 225 80" stroke="#B85D73" strokeWidth="1" strokeDasharray="2,3" opacity="0.35" />
              
              {/* Cortex Inner Core */}
              <rect x="70" y="22" width="180" height="46" rx="23" fill="url(#roseCortexGrad)" stroke="#80263C" strokeWidth="1" />
              
              {/* Medulla Central Canal */}
              <rect x="115" y="36" width="90" height="18" rx="9" fill="#581424" opacity="0.8" />
              
              {/* Labels in diagram */}
              <text x="35" y="50" fontSize="10" fontWeight="bold" fill="#662031" textAnchor="middle">Cuticle</text>
              <text x="88" y="49" fontSize="9.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">Cortex</text>
              <text x="160" y="49" fontSize="8.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">Medulla</text>
            </svg>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#422129]">
            <div className="bg-[#FFFDFE] p-2.5 rounded-lg border border-[#F2CCD6]">
              <span className="font-bold text-[#A8586B] block mb-0.5">1. Cuticle (الحراشف)</span>
              <span>درع الحماية الخارجي؛ عندما تكون الحراشف ملساء ومغلقة يكتسب الشعر لمعانًا فائقًا ونعومة حريرية.</span>
            </div>
            <div className="bg-[#FFFDFE] p-2.5 rounded-lg border border-[#F2CCD6]">
              <span className="font-bold text-[#8C384E] block mb-0.5">2. Cortex (اللب)</span>
              <span>مركز الكيراتين والقوة، والمسؤول عن المرونة ولون الشعر.</span>
            </div>
            <div className="bg-[#FFFDFE] p-2.5 rounded-lg border border-[#F2CCD6]">
              <span className="font-bold text-[#5C1B2A] block mb-0.5">3. Medulla (النخاع)</span>
              <span>القناة الوسطى الدقيقة في الخصلات السميكة.</span>
            </div>
          </div>
        </div>
      )}

      {type === 'growth-cycle' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-[#FFF0F4] border border-[#F5CCD6] text-center">
              <span className="inline-block px-2 py-0.5 rounded bg-[#D88A9C] text-white text-[10px] font-bold mb-1">Anagen</span>
              <p className="text-[11px] font-bold text-[#422129]">مرحلة النمو</p>
              <p className="text-[10px] text-[#7A3E4E] mt-1">2 - 7 سنوات (85-90% من الشعر)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFF0F4] border border-[#F5CCD6] text-center">
              <span className="inline-block px-2 py-0.5 rounded bg-[#B85D73] text-white text-[10px] font-bold mb-1">Catagen</span>
              <p className="text-[11px] font-bold text-[#422129]">مرحلة الانتقال</p>
              <p className="text-[10px] text-[#7A3E4E] mt-1">2 - 3 أسابيع (توقف النمو)</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFF0F4] border border-[#F5CCD6] text-center">
              <span className="inline-block px-2 py-0.5 rounded bg-[#E598AA] text-white text-[10px] font-bold mb-1">Telogen</span>
              <p className="text-[11px] font-bold text-[#422129]">السقوط الطبيعي</p>
              <p className="text-[10px] text-[#7A3E4E] mt-1">حوالي 3 أشهر (50-100 شعرة/يوم)</p>
            </div>
          </div>
        </div>
      )}

      {type === 'hair-types' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
          <div className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6]">
            <div className="h-7 w-full flex items-center justify-center text-[#D88A9C] font-serif text-lg font-bold">| | |</div>
            <p className="font-bold text-[#422129]">Type 1: Straight</p>
            <p className="text-[10px] text-[#7A3E4E] mt-1">أملس، زيوت سريعة، يحتاج حجم خفيف.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6]">
            <div className="h-7 w-full flex items-center justify-center text-[#D88A9C] font-serif text-lg font-bold">~ ~ ~</div>
            <p className="font-bold text-[#422129]">Type 2: Wavy</p>
            <p className="text-[10px] text-[#7A3E4E] mt-1">تموجات حرف S، يحتاج رغوة موس ناعمة.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6]">
            <div className="h-7 w-full flex items-center justify-center text-[#D88A9C] font-serif text-lg font-bold">§ § §</div>
            <p className="font-bold text-[#422129]">Type 3: Curly</p>
            <p className="text-[10px] text-[#7A3E4E] mt-1">حلقات حلزونية محددة، يحتاج ترطيب دائم.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6]">
            <div className="h-7 w-full flex items-center justify-center text-[#D88A9C] font-serif text-lg font-bold">z z z</div>
            <p className="font-bold text-[#422129]">Type 4: Coily</p>
            <p className="text-[10px] text-[#7A3E4E] mt-1">لولبيات دقيقة، انكماش، يحتاج زبدات غنية.</p>
          </div>
        </div>
      )}

      {type === 'porosity-scale' && (
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2 p-2.5 bg-[#FFFDFE] rounded-lg border-r-4 border-r-[#87A996] border-[#F2CCD6]">
            <span className="font-bold min-w-[70px] text-[#245237]">Low (منخفضة):</span>
            <span className="text-[#52212D]">حراشف مغلقة بإحكام. يحتاج ماء دافئ ومنتجات مائية خفيفة سريعة النفاذ.</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-[#FFFDFE] rounded-lg border-r-4 border-r-[#D88A9C] border-[#F2CCD6]">
            <span className="font-bold min-w-[70px] text-[#8C384E]">Medium (متوسطة):</span>
            <span className="text-[#52212D]">حراشف متوازنة ومثالية. امتصاص واحتفاظ ممتاز بالرطوبة والتسريحات.</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-[#FFFDFE] rounded-lg border-r-4 border-r-[#B85D73] border-[#F2CCD6]">
            <span className="font-bold min-w-[70px] text-[#6B2435]">High (عالية):</span>
            <span className="text-[#52212D]">حراشف مفتوحة أو مثقوبة. شرب سريع للماء وتبخر أسرع، يحتاج زيوت عازلة (LOC).</span>
          </div>
        </div>
      )}

      {type === 'heat-dial' && (
        <div className="p-3.5 bg-gradient-to-r from-[#FFF0F4] via-[#FFF8FA] to-[#FCEBED] rounded-xl border border-[#F2CCD6]">
          <div className="flex items-center gap-2 mb-2 text-[#8C384E]">
            <Thermometer className="w-4 h-4 text-[#D88A9C]" />
            <span className="text-xs font-bold">محدد الحرارة الآمنة حسب نوع الشعر:</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center py-1 border-b border-[#F7D8E0]">
              <span className="text-[#52212D]">شعر رقيق (Fine) أو مصبوغ تالف</span>
              <span className="font-bold text-[#2A663C] bg-[#E8F5EB] px-2.5 py-0.5 rounded">140°C - 160°C</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F7D8E0]">
              <span className="text-[#52212D]">شعر طبيعي، متوسط السمك (Medium)</span>
              <span className="font-bold text-[#8C384E] bg-[#FCE8ED] px-2.5 py-0.5 rounded">170°C - 185°C</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#52212D]">شعر سميك، خشن، ومجعد جداً (Coarse)</span>
              <span className="font-bold text-[#9C2539] bg-[#FFEAEF] px-2.5 py-0.5 rounded">190°C - 200°C Max</span>
            </div>
          </div>
        </div>
      )}

      {type === 'blowdry-angles' && (
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-[#EEF8F1] border border-[#BDE3C8] text-[#1E4D2B]">
            <span className="font-bold flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              الزاوية الصحيحة (45° للأسفل)
            </span>
            <p className="text-[10px] text-[#245233]">توجيه تدفق الهواء مع مسار الحراشف يغلق الـ Cuticle ويمنح لمعاناً حريرياً دون نفشة.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFF1F3] border border-[#F8CCD3] text-[#801B2B]">
            <span className="font-bold flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C62828]" />
              الزاوية الخاطئة (عمودياً أو للأعلى)
            </span>
            <p className="text-[10px] text-[#691825]">توجيه تدفق الهواء للأعلى يفتح حراشف الشعرة، مما يسبب تطاير الشعيرات وتطايرها ويترك الشعر باهتًا وعرضة للتشابك.</p>
          </div>
        </div>
      )}

      {type === 'product-ladder' && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {Object.entries(data).map(([key, val]: [string, any], idx) => (
            <div key={key} className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6] flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FCE8ED] text-[#8C384E] font-bold text-xs flex items-center justify-center shrink-0 border border-[#F0BAC6]">
                {idx + 1}
              </span>
              <span className="text-[#422129]">{val}</span>
            </div>
          ))}
        </div>
      )}

      {type === 'glossary-cards' && data?.terms && (
        <div className="space-y-2">
          {data.terms.map((t: any, i: number) => (
            <div key={i} className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6] text-[11.5px]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#8C384E]">{t.ar.split(':')[0]}</span>
                <span className="font-latin-title text-[10px] text-[#A65B6F] bg-[#FCE8ED] px-2 py-0.5 rounded-full border border-[#F5CCD6]">
                  {t.en} / {t.fr}
                </span>
              </div>
              <p className="text-[#52212D] leading-relaxed">{t.ar.split(':')[1] || t.ar}</p>
            </div>
          ))}
        </div>
      )}

      {type === 'checklist-card' && data?.items && (
        <div className="space-y-1.5 text-[11px] text-[#422129]">
          {data.items.map((item: string, i: number) => (
            <label key={i} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#FDEFF3] transition-colors cursor-pointer">
              <input type="checkbox" className="rounded text-[#D88A9C] focus:ring-[#D88A9C] accent-[#D88A9C] w-3.5 h-3.5 cursor-pointer" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      )}

      {type === 'custom-illustration' && data && (
        <div className="space-y-2 text-[11px]">
          {Object.entries(data).map(([k, v]: [string, any]) => (
            <div key={k} className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6] text-[#422129]">
              {v}
            </div>
          ))}
        </div>
      )}

      {/* Fallback for other data categories */}
      {!['hair-anatomy', 'growth-cycle', 'hair-types', 'porosity-scale', 'heat-dial', 'blowdry-angles', 'product-ladder', 'glossary-cards', 'checklist-card', 'custom-illustration'].includes(type) && data && (
        <div className="space-y-1.5 text-[11px]">
          {Object.entries(data).map(([k, v]: [string, any]) => (
            <div key={k} className="p-2.5 rounded-lg bg-[#FFFDFE] border border-[#F2CCD6] text-[#422129]">
              <span className="font-bold text-[#8C384E] block mb-0.5">{k}:</span>
              <span>{typeof v === 'string' ? v : JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      )}

      {caption && (
        <p className="mt-2.5 text-[10.5px] text-[#A66878] italic border-t border-[#F5D8E0] pt-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#D88A9C] shrink-0" />
          {caption}
        </p>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import {
  service_translate_aiTranslate_async_getSupportedLanguages,
  service_translate_aiTranslate_async_translateTextToManylanguages,
} from "@/src/services/translate";

// export default function Home() {
//   const [languages, setLanguages] = useState<Record<string, string>>({});
//   const [text, setText] = useState("Hello, how are you?");
//   const [sourceLanguage, setSourceLanguage] = useState("en");
//   const [targetLanguages, setTargetLanguages] = useState<Array<string>>(["de", "fr", "es"]);
//   const [result, setResult] = useState<Array<string> | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     service_translate_aiTranslate_async_getSupportedLanguages()
//       .then(setLanguages)
//       .catch((e) => setError(String(e)));
//   }, []);

//   const toggleTarget = (code: string) => {
//     setTargetLanguages((prev) =>
//       prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
//     );
//   };

//   const translate = async () => {
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     try {
//       const translated = await service_translate_aiTranslate_async_translateTextToManylanguages(
//         text,
//         sourceLanguage,
//         targetLanguages
//       );
//       setResult(translated);
//     } catch (e) {
//       setError(String(e));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl p-6 text-left">
//       <h1 className="mb-4 text-heading font-bold">Translate test</h1>

//       <label className="mb-1 block text-caption text-slate">Text</label>
//       <textarea
//         className="mb-4 w-full rounded border border-slate/30 p-2"
//         rows={4}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <label className="mb-1 block text-caption text-slate">Source language</label>
//       <select
//         className="mb-4 w-full rounded border border-slate/30 p-2"
//         value={sourceLanguage}
//         onChange={(e) => setSourceLanguage(e.target.value)}
//       >
//         {Object.entries(languages).map(([code, name]) => (
//           <option key={code} value={code}>
//             {code} — {name}
//           </option>
//         ))}
//       </select>

//       <label className="mb-1 block text-caption text-slate">
//         Target languages ({targetLanguages.length} selected)
//       </label>
//       <div className="mb-4 max-h-48 overflow-auto rounded border border-slate/30 p-2">
//         {Object.entries(languages).map(([code, name]) => (
//           <label key={code} className="mr-3 inline-flex items-center gap-1 text-caption">
//             <input
//               type="checkbox"
//               checked={targetLanguages.includes(code)}
//               onChange={() => toggleTarget(code)}
//             />
//             {code} — {name}
//           </label>
//         ))}
//       </div>

//       <button
//         className="rounded bg-iris px-4 py-2 text-white disabled:opacity-50"
//         onClick={translate}
//         disabled={loading || !text || targetLanguages.length === 0}
//       >
//         {loading ? "Translating..." : "Translate"}
//       </button>

//       {error && <p className="mt-4 text-caption text-red-600">{error}</p>}

//       {result && (
//         <ul className="mt-4 space-y-2">
//           {result.map((translated, i) => (
//             <li key={i} className="rounded bg-linen p-2">
//               <span className="text-caption text-slate">{targetLanguages[i]}: </span>
//               {translated}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import TranslationsRow from "@/src/components/translation_row";
import LanguageSelection from "@/src/components/language_selection";

// import {  } from "@untitledui/icons"

export default function Home() {

  return <>
    <TranslationsRow
      translations={[
        {
          languageCode: "es",
          countryCode: "es",
          translation: "Serendipia: la suerte de encontrar algo valioso sin buscarlo.",
          tags: ["sustantivo", "C1", "neutro"]
        },
        {
          languageCode: "fr",
          countryCode: "fr",
          translation: "Sérendipité : la chance de trouver quelque chose de précieux sans le chercher.",
          tags: ["nom", "C1", "neutre"]
        },
        {
          languageCode: "de",
          countryCode: "de",
          translation: "Serendipität: das Glück, etwas Wertvolles zu finden, ohne danach zu suchen.",
          tags: ["Substantiv", "C1", "neutral"]
        },
        {
          languageCode: "de",
          countryCode: "de",
          translation: "Serendipität: das Glück, etwas Wertvolles zu finden, ohne danach zu suchen.",
          tags: ["Substantiv", "C1", "neutral"]
        },
      ]}
    />
    <TranslationsRow
      translations={[
        {
          languageCode: "es",
          countryCode: "es",
          translation: "Serendipia: la suerte de encontrar algo valioso sin buscarlo.",
          tags: ["sustantivo", "C1", "neutro"]
        },
        {
          languageCode: "fr",
          countryCode: "",
          translation: "Sérendipité : la chance de trouver quelque chose de précieux sans le chercher.",
          tags: ["nom", "C1", "neutre"]
        },
      ]}
    />
    <LanguageSelection
        supportedLanguages={[
          { languageCode: "es", countryCode: "es" },
          { languageCode: "fr", countryCode: "fr" },
          { languageCode: "de", countryCode: "de" },
          { languageCode: "it", countryCode: "it" },
          { languageCode: "pt", countryCode: "pt" },
          { languageCode: "ja", countryCode: "jp" },
          { languageCode: "zh", countryCode: "cn" },
          { languageCode: "ko", countryCode: "" },
          { languageCode: "ru", countryCode: "ru" },
          { languageCode: "ar", countryCode: "sa" },
          { languageCode: "hi", countryCode: "in" },
          { languageCode: "bn", countryCode: "bd" },
          { languageCode: "pa", countryCode: "pk" },
          { languageCode: "ur", countryCode: "pk" },
          { languageCode: "fa", countryCode: "ir" },
          { languageCode: "tr", countryCode: "" },
          { languageCode: "vi", countryCode: "vn" },
          { languageCode: "th", countryCode: "th" },
          { languageCode: "id", countryCode: "id" },
          { languageCode: "ms", countryCode: "my" },
          { languageCode: "tl", countryCode: "ph" },
          { languageCode: "sw", countryCode: "ke" },
          { languageCode: "am", countryCode: "et" },
          { languageCode: "ha", countryCode: "ng" },
        ]}
        onSelect={(languageCode, countryCode) => {
          console.log("Selected language:", languageCode, countryCode);
        }}
        onClose={() => {
          console.log("Language selection closed");
        }}
      />
  </>
}
import { useState } from "react";
import { TranslationUnit } from "./TranslationUnit";

export default function TranslationsRow({ translations }: { 
    translations: Array<{ languageCode: string; countryCode: string|null|undefined; translation: string; tags: string[] }>
}) {

    const [wideBlockIndex, setWideBlockIndex] = useState<number|null>(null);

    return (
        <div className="w-full flex flex-row gap-[10px]">
            {translations.map((translation, index) => (
                <TranslationUnit
                    key={index}
                    index={index}
                    languageCode={translation.languageCode}
                    countryCode={translation.countryCode}
                    translation={translation.translation}
                    tags={translation.tags}
                    isWideBlock={wideBlockIndex === index}
                    wideblockExists={wideBlockIndex !== null}
                    onClick={(clickedIndex) => {setWideBlockIndex(prev => prev === index ? null : clickedIndex);}}
                    onVolumeClick={(text, languageCode, countryCode) => {}}
                />
            ))}
        </div>
    );
}
// Translation window as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.

import * as FlagIcons from "@untitledui/country-flags";
import { Volume2 } from "lucide-react";

import LanguageCodeBox from "@/src/components/LanguageCodeBox";
import Tags from "@/src/components/Tags";

const countries_region = new Intl.DisplayNames(['en'], {
    type: 'region'
});

const countries_language = new Intl.DisplayNames(['en'], {
    type: 'language'
});


export function TranslationUnit({
    index,
    languageCode,
    countryCode,  
    translation, 
    tags,
    isWideBlock,
    wideblockExists,
    onClick,
    onVolumeClick
}: {
    index: number;
    languageCode: string; 
    countryCode: string|null|undefined; 
    translation: string; 
    tags: string[]; 
    isWideBlock: boolean;
    wideblockExists: boolean;
    onClick: (wideBlockIndex: number) => void; 
    onVolumeClick: (text: string, languageCode: string, countryCode: string|null|undefined) => void
}) {
    const LanguageFlag = countryCode ? FlagIcons[`Flag${countryCode.charAt(0).toUpperCase() + countryCode.slice(1).toLowerCase()}` as keyof typeof FlagIcons] : null;
   
    const contentIsImportant = isWideBlock || !wideblockExists;
    return (
    <>
        <div className={
            `relative ${isWideBlock ? "flex-[7_1_0%]" : "flex-[1_1_0%]"} 
            min-w-[10%] h-[322px] 
            flex flex-col items-start rounded-[20px] overflow-hidden
            bg-white 
            border-2 
            transition-[flex] duration-200
            ${contentIsImportant ? "opacity-100" : "opacity-50"}
        `}>
            {/* Header */}
            <div className="w-full h-[50px] flex flex-row gap-[10px] p-[1%] items-center border-b-2 border-black/10 hover:cursor-pointer hover:bg-slate/10 transition-[background-color] duration-200"
                onClick={() => {
                    onClick(index)
                }}
            >
                {/* Country flag / Language code */}
                {LanguageFlag ? (<LanguageFlag size={30} />) : (<LanguageCodeBox content={languageCode?.toUpperCase()} />)}

                { contentIsImportant && <>
                    {/* Language and country titles */}
                    <div className="flex-1 flex-col items-start">
                        <p className="text-[#1B1C30] text-ui-text font-semibold">{countries_language.of(languageCode?.toUpperCase())}</p>
                        {countryCode && <p className="text-[#71748A] text-caption font-normal">{countries_region.of(countryCode?.toUpperCase())}</p> }
                    </div>

                    {/* Volume icon */}
                    <div className="w-fit p-[8px] flex items-center rounded-[8px] bg-slate/10 cursor-pointer select-none hover:bg-slate/20 transition-[background-color,transform] duration-200 active:scale-75"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            e.stopPropagation()
                            onVolumeClick(translation, languageCode, countryCode)
                        }}
                    >
                        <Volume2 className="w-max h-[16px] color-black fill-black"/>
                    </div>
                </>
                }
            </div>
            
            {/* Body */}
            { contentIsImportant ? (
                <div className="flex flex-1 w-full flex-col justify-between p-[20px] overflow-hidden">
                    {/* Translation text */}
                    <div className="flex-1 overflow">
                        <p>
                            {translation}
                        </p>
                    </div>
                    {/* Tags */}
                    <Tags tags={tags} />
                </div>
            ) : (
                // Alternative - empty body 
                <div className="flex flex-1 w-full" onClick={() => {
                    onClick(index)
                }}>

                </div>
            )}
        </div>
    </>
  );
}

import { Bookmark } from "@untitledui/icons"
import LanguageCodeBox from "@/src/components/LanguageCodeBox";
import * as FlagIcons from "@untitledui/country-flags";
import { LanguageIdentity } from "@/src/utils/local_storage/favourite_languages";

const countries_region = new Intl.DisplayNames(['en'], {
    type: 'region'
});

const countries_language = new Intl.DisplayNames(['en'], {
    type: 'language'
});


export default function LanguageSelection({ 
    languageCode, 
    countryCode, 
    onSelect, 
    onAddToFavourites,
    isFavourite
}: { 
    languageCode: string;
    countryCode: string|null|undefined;
    onSelect: (language: LanguageIdentity) => void;
    onAddToFavourites: (languageCode: string, countryCode: string|null|undefined) => void;
    isFavourite: boolean;        
}) {



    const LanguageFlag = countryCode ? FlagIcons[`Flag${countryCode.charAt(0).toUpperCase() + countryCode.slice(1).toLowerCase()}` as keyof typeof FlagIcons] : null;

    const languageCodeBoxBg = isFavourite ? "bg-iris/30" : "bg-linen/30";
    const bg = isFavourite ? "bg-linen" : "";
    const bookmarkColor = isFavourite ? "#5B4BFF" : "#71748A80";
    const bookmarkFill = isFavourite ? "#5B4BFF" : "none";
    // CSS `fill` beats the icon's `fill="none"` presentation attribute, so hover can fill the outline.
    const bookmarkClassName = isFavourite
        ? ""
        : "transition-[fill] duration-200 group-hover:fill-[#71748A80]";

    return <>
        <div className={` ${bg} p-[8px] rounded-[8px] flex w-full flex-row items-between justify-between select-none hover:cursor-pointer hover:bg-saffron/10 transition-[background-color] duration-200`}
            onClick={() => {
                onSelect({ languageCode, countryCode })
            }}
        >
            {/* Left part  */}
            <div className="flex flex-row items-center gap-[10px]">
                {LanguageFlag ? (<LanguageFlag size={30} />) : (<LanguageCodeBox content={languageCode?.toUpperCase()} className={languageCodeBoxBg} />)}
                <div className="flex-1 flex-col items-start">
                    <p className="text-[#1B1C30] text-ui-text font-semibold">{countries_language.of(languageCode?.toUpperCase())}</p>
                    {countryCode && <p className="text-[#71748A] text-caption font-normal">{countries_region.of(countryCode?.toUpperCase())}</p> }
                </div>
            </div>

            {/* Right part */}
            <div className="group flex items-center justify-center hover:cursor-pointer rounded-[8px]"
                onClick={(e) => {
                    e.stopPropagation()
                    onAddToFavourites(languageCode, countryCode)
                }}
            >
                <Bookmark color={bookmarkColor} fill={bookmarkFill} className={bookmarkClassName} />
            </div>
        </div>
    </>

}
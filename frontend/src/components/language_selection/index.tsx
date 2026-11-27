import { useLayoutEffect, useRef, useState } from "react";
import { LanguageIdentity } from "@/src/utils/local_storage/favourite_languages";
import { use_service_translate_aiTranslate_async_getSupportedLanguages } from "@/src/services/translate/queries";
import * as useQueryConfigPatterns from "@/src/utils/api/use_query_config_patterns.ts";

import { 
    addFavouriteLanguage,
    removeFavouriteLanguage,
    getFavouriteLanguages,
    type FavouriteLanguage
} from "@/src/utils/local_storage/favourite_languages";

import LanguageSelectorOption from "./LanguageSelectorOption";
import SearchBar from "@/src/components/SearchBar";
import { XClose } from "@untitledui/icons/XClose";

const languageKey = (languageCode: string, countryCode: string|null|undefined) =>
    `${languageCode}-${countryCode || ""}`;

// Duplication from favourite_languages.tsx - lets reduce local storage access
const isFavourite = (
    favourites: FavouriteLanguage[],
    languageCode: string,
    countryCode: string|null|undefined
) => favourites.some(
    (item) => item.languageCode === languageCode && item.countryCode === (countryCode || "")
);

export default function LanguageSelection({
    supportedLanguagesList=[],
    onSelect,
    onClose,
}: { 
    supportedLanguagesList: LanguageIdentity[];
    onSelect: (language: LanguageIdentity) => void;
    onClose: () => void;
    //supportedLanguages: Array<{ languageCode: string; countryCode: string|null|undefined;}>;
}) {

    // Supported languages: manual OR fetched from api
    const { data: fetchedSupportedLanguages } = use_service_translate_aiTranslate_async_getSupportedLanguages(
        { config: useQueryConfigPatterns.manual_mummy_cache30min_notry }
    );
    const supportedLanguages: LanguageIdentity[] =
        supportedLanguagesList != undefined
            ? supportedLanguagesList
            : (Array.isArray(fetchedSupportedLanguages) ? fetchedSupportedLanguages : []);

    const [favourites, setFavourites] = useState<FavouriteLanguage[]>(getFavouriteLanguages);


    // Animation stuff
    const itemRefs = useRef(new Map<string, HTMLDivElement>());
    const pendingFrom = useRef<{ key: string; rect: DOMRect } | null>(null);

    const toggleFavourite = (languageCode: string, countryCode: string|null|undefined) => {
        const code = countryCode || "";
        const key = languageKey(languageCode, code);
        const element = itemRefs.current.get(key);

        pendingFrom.current = element ? { key, rect: element.getBoundingClientRect() } : null;
        setFavourites(
            isFavourite(favourites, languageCode, code)
                ? removeFavouriteLanguage(languageCode, code)
                : addFavouriteLanguage(languageCode, code)
        );
    };

    const favouriteAddedAt = new Map(
        favourites.map((item) => [languageKey(item.languageCode, item.countryCode), item.addedAt])
    );

    // Favourites first, ordered by the date they were added; everything else keeps its original order.
    const sortedLanguages = supportedLanguages
        .map((language, index) => ({ language, index }))
        .sort((a, b) => {
            const aAddedAt = favouriteAddedAt.get(languageKey(a.language.languageCode, a.language.countryCode));
            const bAddedAt = favouriteAddedAt.get(languageKey(b.language.languageCode, b.language.countryCode));
            if (aAddedAt === undefined && bAddedAt === undefined) return a.index - b.index;
            if (aAddedAt === undefined) return 1;
            if (bAddedAt === undefined) return -1;
            return aAddedAt.localeCompare(bAddedAt) || a.index - b.index;
        })
        .map(({ language }) => language);

    useLayoutEffect(() => {
        const pending = pendingFrom.current;
        pendingFrom.current = null;
        if (!pending) return;

        const element = itemRefs.current.get(pending.key);
        if (!element) return;

        const after = element.getBoundingClientRect();
        const deltaX = pending.rect.left - after.left;
        const deltaY = pending.rect.top - after.top;
        const moved = Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1;

        element.getAnimations().forEach((animation) => animation.cancel());

        const lifted: Keyframe = {
            transform: "translate(0px, 0px) scale(1.04)",
            boxShadow: "0 10px 24px rgba(27, 28, 48, 0.18)",
        };
        const settled: Keyframe = {
            transform: "translate(0px, 0px) scale(1)",
            boxShadow: "0 0 0 rgba(27, 28, 48, 0)",
        };

        const frames: Keyframe[] = moved
            ? [
                {
                    transform: `translate(${deltaX}px, ${deltaY}px) scale(1)`,
                    boxShadow: "0 0 0 rgba(27, 28, 48, 0)",
                    offset: 0,
                },
                { ...lifted, offset: 0.6 },
                { ...settled, offset: 1 },
            ]
            : [{ ...lifted, offset: 0.4 }, { ...settled, offset: 1 }];

        element.style.zIndex = "1";
        const clearLayer = () => {
            element.style.zIndex = "";
        };
        element.animate(frames, {
            duration: moved ? 460 : 320,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
        }).finished.then(clearLayer, clearLayer);
    }, [favourites]);

    
    // Search bar and filtering
    const [searchTerm, setSearchTerm] = useState<string>("");

    const countries_region = new Intl.DisplayNames(['en'], { type: 'region' });
    const countries_language = new Intl.DisplayNames(['en'], { type: 'language' });

    const filteredLanguages = sortedLanguages.filter((language) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        const languageName = countries_language.of(language.languageCode?.toUpperCase())?.toLowerCase() ?? "";
        const regionName = language.countryCode
            ? countries_region.of(language.countryCode?.toUpperCase())?.toLowerCase() ?? ""
            : "";
        const languageCode = language.languageCode?.toLowerCase() ?? "";
        const countryCode = language.countryCode?.toLowerCase() ?? "";

        return (
            languageName.includes(term) ||
            regionName.includes(term) ||
            languageCode.includes(term) ||
            countryCode.includes(term)
        );
    });

    

    return <>

        <div className="flex flex-col gap-[20px] w-full border-2 rounded-[20px] p-[20px]">

            <div className="flex flex-row items-baseline justify-between">
                <p className="text-ui-text text-slate font-bold mr-[1%]">Language Selection</p>    
                <div className="flex items-center justify-center text-center rounded-[24px] p-[16px] bg-saffron/10 hover:bg-saffron/20 transition-[background-color] duration-200"

                    onClick={() => {
                        onClose();
                    }}
                >
                    <XClose size={20} />
                </div>
            </div>
            {/* search bar */}
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {/* Title */}
            <div className="mb-[10px] flex flex-row items-baseline">
                <p className="text-ui-text text-slate font-bold mr-[1%]">All Languages</p>
                <p className="text-caption text-slate font-normal">{filteredLanguages.length} available</p>
            </div>

            {/* Language list */}
            <div className="columns-[300px] gap-[20px] w-full">
            {filteredLanguages.map((language) => {
                const key = languageKey(language.languageCode, language.countryCode);
                return (
                <div
                    key={key}
                    ref={(element) => {
                        if (element) itemRefs.current.set(key, element);
                        else itemRefs.current.delete(key);
                    }}
                    className="mb-[10px] break-inside-avoid"
                >
                    <LanguageSelectorOption
                        languageCode={language.languageCode}
                        countryCode={language.countryCode}
                        onSelect={(language: LanguageIdentity) => onSelect(language)}
                        onAddToFavourites={toggleFavourite}
                        isFavourite={isFavourite(favourites, language.languageCode, language.countryCode)}
                    />
                </div>
                );
            })}
            </div>


        </div>


    </>

}
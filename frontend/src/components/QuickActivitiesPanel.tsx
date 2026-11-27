import { ScanEye } from "lucide-react"
import { DotsVertical } from "@untitledui/icons"
import { LanguageIdentity, getFavouriteLanguages } from "@/src/utils/local_storage/favourite_languages"
import { useState } from "react";

interface QuickActivitiesPanelProps {}

type ActivityHandler = () => void;

const scanTextActivity: ActivityHandler = (): void => {
    console.log("Scan text activity triggered");
};


export default function QuickActivitiesPanel({
   // onSelectMainLanguage,
   // onExchangeLanguageTo,
   // onLanguageAdd,
}: QuickActivitiesPanelProps) {

    const [subLanguagesState, setFavouriteLanguagesState] = useState<LanguageIdentity[]>([]);
    const [mainLanguageState, setMainLanguageState] = useState<LanguageIdentity | undefined>(undefined);


    return (
    <div className="flex w-full flex-row justify-between items-center p-[10px] min-h-[100px] bg-linen">
        <div className="flex flex-row justify-between items-center">

        </div>

        {/* add button here */}
        
        <div className="flex flex-row gap-[10px]">
            <div className="flex items-center gap-[10px] rounded-[12px] bg-white p-[8px] hover:cursor-pointer" style={{ border: "2px solid transparent" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "black")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                <ScanEye size={24} className="color-black" />
                <button className="flex items-center"
                
                    onClick={scanTextActivity}
                > 
                    <h1 className="text-black text-ui-text">Scan text</h1>
                </button>
            </div>
            <div className="flex items-center gap-[10px] rounded-[12px] bg-white p-[8px] hover:cursor-pointer" style={{ border: "2px solid transparent" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "black")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                <DotsVertical size={24} className="color-black" />
            </div>
        </div>
    </div>
    );
}
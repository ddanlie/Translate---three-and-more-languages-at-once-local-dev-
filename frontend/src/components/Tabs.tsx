import { twMerge } from "tailwind-merge"

export default function Tabs({
    tabs,
    onSelect,
    selectedTab,
    className,
    selectedTabStyle
} : {
    tabs: string[],
    onSelect: (name: string) => void,
    selectedTab: string,
    className?: string,
    selectedTabStyle?: string
}) {
    return (
        <div className="flex flex-row">
            {
                tabs.map((tab, index) => (
                    <div
                    onClick={() => onSelect(tab)} 
                    key={index}
                    className={twMerge(
                        "px-3 py-2 cursor-pointer rounded-[10px]",
                        selectedTab === tab
                            ? `bg-white font-semibold text-ink ${selectedTabStyle}`
                            : "text-slate",
                        className
                    )}
                    >
                        <p>{tab}</p>
                    </div>
                ))
            }
        </div>
    )
}

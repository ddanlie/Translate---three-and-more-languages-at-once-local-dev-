import { SearchMd } from "@untitledui/icons"
import type { ChangeEvent, KeyboardEvent } from "react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    // bg-slate/10
    <div className="flex search-bar p-[5px] bg-linen focus-within:outline focus-within:outline-2 focus-within:outline-black/50 rounded-[8px]">
        <div className="flex items-center">
            <SearchMd color="#71748a4e" size={32}/>
        </div>
        <input
            className="flex w-full hover:cursor-text p-[8px] bg-linen focus:outline-none"
            id="activity-search"
            type="search"
            value={searchTerm}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.currentTarget.value)}
            placeholder="Search languages codes and countries"
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                    onSearchChange(event.currentTarget.value);
                }
            }}
        />
    </div>
  );
}

export default SearchBar;
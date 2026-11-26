export default function Tags({ tags }: { tags: string[] }) {
    if (tags.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-[6px]">
            {tags.map((tag, index) => (
                <div key={index} className="flex flex-row py-1 px-2 items-start rounded-[8px] bg-slate/10">
                    <p className="text-[#71748A] text-caption font-normal break-all">{tag}</p>
                </div>
            ))}
        </div>
    );
}
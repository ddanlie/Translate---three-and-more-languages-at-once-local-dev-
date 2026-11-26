import { twMerge } from 'tailwind-merge';

export default function LanguageCodeBox({ content, className }: { content: string|null|undefined; className?: string }) {

    if(!content) {
        return <></>
    }

    return (
        <div className={twMerge('size-7 rounded-lg bg-iris/30 flex justify-center items-center', className)}>
            <p className='text-iris text-caption font-bold'>{content.slice(0, 2)}</p>
        </div>
    )
}
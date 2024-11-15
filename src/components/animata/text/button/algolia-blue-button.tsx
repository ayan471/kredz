import Link from 'next/link';

export default function AlgoliaBlueButton(props:any) {
    return (
      <Link href={`${props.ctaLink}`} className="flex flex-col align-middle justify-center max-w-min m-auto sm:m-0">
        <button
          className="relative box-border inline-flex h-12 cursor-pointer touch-manipulation items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-0 bg-slate-800 px-4 leading-none text-slate-100 no-underline transition-all duration-150 ease-in-out  active:translate-y-0.5 active:shadow-[#3c4fe0_0_3px_7px_inset]"
          role="button"
        >
          {props.ctaText}
        </button>
      </Link>
    );
  }
  
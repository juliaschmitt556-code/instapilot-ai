import Link from 'next/link';

export function BrandMark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="InstaPilot AI home">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-lime" aria-hidden="true">
        <span className="absolute left-[9px] top-[7px] h-[15px] w-[3px] rounded-full bg-ink" />
        <span className="absolute right-[9px] top-[11px] h-[11px] w-[3px] rounded-full bg-ink" />
        <span className="absolute bottom-[7px] left-[9px] h-[3px] w-[11px] rounded-full bg-ink" />
      </span>
      {!compact && <span className={`font-display text-[18px] font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-ink'}`}>InstaPilot <span className={light ? 'text-lime' : 'text-indigo'}>AI</span></span>}
    </Link>
  );
}

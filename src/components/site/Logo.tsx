import logoImg from "@/assets/leadsup-logo.png";
const logo = typeof logoImg === 'string' ? logoImg : (logoImg as { src: string }).src;

export function Logo({ size = 28, withText = true, textClassName = "" }: { size?: number; withText?: boolean; textClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={logo}
        alt="LeadsUp"
        width={size}
        height={size}
        className="rounded-md object-contain"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className={`font-semibold tracking-tight ${textClassName}`}>
          Leads<span className="text-gradient-brand">up</span>
        </span>
      )}
    </span>
  );
}

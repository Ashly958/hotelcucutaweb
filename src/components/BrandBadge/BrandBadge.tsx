interface BrandBadgeProps {
  className?: string;
  mostrarTexto?: boolean;
}

export function BrandBadge({ className = '', mostrarTexto = true }: BrandBadgeProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-10 w-10 bg-brand-red rounded-xl flex items-center justify-center font-display font-black text-xl text-white tracking-tight shadow-soft-xs border border-red-500/20">
        HC
      </div>
      {mostrarTexto && (
        <div className="text-left">
          <div className="font-display font-bold text-base tracking-tight text-slate-900 leading-tight">
            HOTEL CÚCUTA
          </div>
          <div className="text-[10px] uppercase font-semibold text-brand-red tracking-widest">
            Estrictamente Familiar
          </div>
        </div>
      )}
    </div>
  );
}

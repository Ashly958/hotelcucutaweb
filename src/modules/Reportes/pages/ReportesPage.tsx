import React from 'react';
import {
  BedDouble,
  DollarSign,
  ShieldCheck,
  Shield,
  Globe,
  Building2,
  FileCheck2,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useReportes } from '../hooks/useReportes';
import { OcupacionTab } from '../components/OcupacionTab';
import { IngresosTab } from '../components/IngresosTab';
import { DianTab } from '../components/DianTab';
import { PoliciaTraTab } from '../components/PoliciaTraTab';
import { SireTab } from '../components/SireTab';
import { MincitTab } from '../components/MincitTab';
import { AuditoriaDiariaTab } from '../components/AuditoriaDiariaTab';
import { DirectorioHuespedesTab } from '../components/DirectorioHuespedesTab';
import { Button, Loading, ErrorState } from '@/components';
import type { ReportesTab } from '../types/reporte.types';

export function ReportesPage() {
  const {
    tabActivo,
    setTabActivo,
    cargando,
    error,
    ocupacionData,
    ingresosData,
    dianData,
    policiaTraData,
    sireData,
    mincitData,
    auditoriaData,
    refreshTrigger,
    recargar,
    actualizarSire,
    ejecutarCierreAuditoria,
  } = useReportes();

  const tabs: { id: ReportesTab; label: string; icon: React.ReactNode; tag?: string }[] = [
    {
      id: 'ocupacion',
      label: 'Ocupación',
      icon: <BedDouble className="w-4 h-4" />,
    },
    {
      id: 'ingresos',
      label: 'Ingresos & Minibar',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'dian',
      label: 'DIAN',
      icon: <ShieldCheck className="w-4 h-4" />,
      tag: 'Tributario',
    },
    {
      id: 'policia',
      label: 'Policía TRA',
      icon: <Shield className="w-4 h-4" />,
      tag: 'Libro Oficial',
    },
    {
      id: 'sire',
      label: 'Migración SIRE',
      icon: <Globe className="w-4 h-4" />,
      tag: 'Extranjeros',
    },
    {
      id: 'mincit',
      label: 'MinCIT / DANE',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'auditoria',
      label: 'Cierre Diario',
      icon: <FileCheck2 className="w-4 h-4" />,
      tag: 'Night Audit',
    },
    {
      id: 'directorio',
      label: 'Directorio Huéspedes',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* BARRA SUPERIOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Reportes, Estadísticas & Auditoría
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200/80 uppercase tracking-wider">
              Auditoría Operativa
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ocupación diaria/mensual, ingresos desglosados, reportes para DIAN, Policía TRA, SIRE Migración Colombia y MinCIT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={recargar}
            disabled={cargando}
            icono={<RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-red-700' : ''}`} />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* BARRA DE PESTAÑAS (TABS) SUAVE Y FLUIDA */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-soft flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const estaActivo = tabActivo === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabActivo(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                estaActivo
                  ? 'bg-slate-900 text-white shadow-soft-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.tag && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
                    estaActivo
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENIDO DEL TAB CON CARGA O ERROR */}
      {cargando && !ocupacionData && !ingresosData && !dianData && !policiaTraData && !sireData && !mincitData && !auditoriaData ? (
        <Loading mensaje="Cargando estadísticas e informes analíticos..." />
      ) : error ? (
        <ErrorState mensaje={error} onReintentar={recargar} />
      ) : (
        <div>
          {tabActivo === 'ocupacion' && (
            <OcupacionTab data={ocupacionData} />
          )}

          {tabActivo === 'ingresos' && (
            <IngresosTab data={ingresosData} />
          )}

          {tabActivo === 'dian' && (
            <DianTab data={dianData} />
          )}

          {tabActivo === 'policia' && (
            <PoliciaTraTab data={policiaTraData} />
          )}

          {tabActivo === 'sire' && (
            <SireTab
              data={sireData}
              onActualizarEstado={actualizarSire}
            />
          )}

          {tabActivo === 'mincit' && (
            <MincitTab data={mincitData} />
          )}

          {tabActivo === 'auditoria' && (
            <AuditoriaDiariaTab
              data={auditoriaData}
              onCerrarAuditoria={ejecutarCierreAuditoria}
            />
          )}

          {tabActivo === 'directorio' && (
            <DirectorioHuespedesTab refreshTrigger={refreshTrigger} />
          )}
        </div>
      )}
    </div>
  );
}

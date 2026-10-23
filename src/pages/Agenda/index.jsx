import { useCallback, useEffect, useMemo, useState } from "react";
import { HeaderBar, Layout, SideBar } from "../../components";
import CalendarioMes from "../../components/Especificos/Agenda/CalendarioMes";
import DetalheEvento from "../../components/Especificos/Agenda/DetalheEvento";
import ListaEventos from "../../components/Especificos/Agenda/ListaEventos";
import ModalNovoEvento from "../../components/Especificos/Agenda/ModalNovoEvento";
import { useEmpresa } from "../../contexts";
import { agendaService } from "../../services/agendaService";

const VIEWS = [
  { key: "dia", label: "Dia" },
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mês" },
];

function getRange(view, refDate) {
  const base = new Date(refDate);
  base.setHours(0, 0, 0, 0);
  if (view === "dia") return { inicio: base, fim: base };
  if (view === "semana") {
    const ini = new Date(base);
    ini.setDate(ini.getDate() - ini.getDay());
    const fim = new Date(ini);
    fim.setDate(fim.getDate() + 6);
    return { inicio: ini, fim };
  }
  const ini = new Date(base.getFullYear(), base.getMonth(), 1);
  const fim = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return { inicio: ini, fim };
}

export default function Agenda() {
  const { empresa, loading: empresaLoading } = useEmpresa();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [view, setView] = useState("semana");
  const [dataRef, setDataRef] = useState(new Date());
  const [modalAberto, setModalAberto] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [detalhe, setDetalhe] = useState(null);

  const carregar = useCallback(async () => {
    if (!empresa?.id_empresa) return;
    setErro(null);
    try {
      const { inicio, fim } = getRange(view, dataRef);
      const lista = await agendaService.listar(empresa.id_empresa, {
        inicio: inicio.toISOString().slice(0, 10),
        fim: fim.toISOString().slice(0, 10),
      });
      const hoje = new Date().toISOString().slice(0, 10);
      const comStatus = lista.map((ev) => ({
        ...ev,
        status:
          ev.status === "pendente" && ev.data_evento < hoje
            ? "atrasado"
            : ev.status,
      }));
      setEventos(comStatus);
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar agenda.");
    } finally {
      setLoading(false);
    }
  }, [empresa?.id_empresa, view, dataRef]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const stats = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const prox7 = new Date();
    prox7.setDate(prox7.getDate() + 7);
    const em7 = prox7.toISOString().slice(0, 10);
    return {
      proximos7: eventos.filter(
        (e) =>
          e.data_evento >= hoje &&
          e.data_evento <= em7 &&
          e.status !== "cancelado",
      ).length,
      hoje: eventos.filter(
        (e) => e.data_evento === hoje && e.status !== "cancelado",
      ).length,
      atrasados: eventos.filter((e) => e.status === "atrasado").length,
      concluidos: eventos.filter((e) => e.status === "concluido").length,
    };
  }, [eventos]);

  const navegar = (delta) => {
    const d = new Date(dataRef);
    if (view === "dia") d.setDate(d.getDate() + delta);
    else if (view === "semana") d.setDate(d.getDate() + delta * 7);
    else d.setMonth(d.getMonth() + delta);
    setDataRef(d);
  };

  const handleConcluir = async (evento) => {
    await agendaService.concluir(evento.id_evento);
    if (evento.recorrencia && evento.recorrencia !== "nenhuma") {
      await agendaService.gerarProximaOcorrencia(evento);
    }
    await carregar();
  };

  const handleCancelar = async (evento, motivo) => {
    await agendaService.cancelar(evento.id_evento, motivo);
    await carregar();
  };

  const handleExcluir = async (evento) => {
    await agendaService.excluir(evento.id_evento);
    await carregar();
  };

  if (loading || empresaLoading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="Agenda de Logística" desc="Carregando..." />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </Layout>
      </>
    );
  }

  const labelPeriodo = () => {
    if (view === "dia")
      return dataRef.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
    if (view === "semana") {
      const { inicio, fim } = getRange(view, dataRef);
      return `${inicio.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })} – ${fim.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }
    return dataRef.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Agenda de Logística"
          desc="Agende e organize suas operações"
        />

        {erro && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-between gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            <button
              onClick={carregar}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {!empresa && (
          <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Sua conta não está vinculada a uma empresa. Peça ao administrador
              para vincular seu usuário.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Próximos 7 dias"
            valor={stats.proximos7}
            cor="purple"
          />
          <StatCard label="Hoje" valor={stats.hoje} cor="blue" />
          <StatCard label="Atrasados" valor={stats.atrasados} cor="red" />
          <StatCard label="Concluídos" valor={stats.concluidos} cor="emerald" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navegar(-1)}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-surface-dark-hover hover:bg-gray-200 dark:hover:bg-[#241b42] text-gray-600 dark:text-gray-300 flex items-center justify-center"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={() => setDataRef(new Date())}
              className="px-3 h-9 rounded-lg bg-gray-100 dark:bg-surface-dark-hover hover:bg-gray-200 dark:hover:bg-[#241b42] text-xs font-medium text-gray-600 dark:text-gray-300"
            >
              Hoje
            </button>
            <button
              onClick={() => navegar(1)}
              className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-surface-dark-hover hover:bg-gray-200 dark:hover:bg-[#241b42] text-gray-600 dark:text-gray-300 flex items-center justify-center"
              aria-label="Próximo"
            >
              →
            </button>
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 ml-2 capitalize">
              {labelPeriodo()}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-surface-dark-hover rounded-lg p-1 h-9">
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  className={`px-3 h-7 text-xs rounded-md transition-colors ${
                    view === v.key
                      ? "bg-white dark:bg-surface-dark font-semibold text-gray-800 dark:text-gray-100 shadow-sm"
                      : "font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setModalData(null);
                setModalAberto(true);
              }}
              disabled={!empresa}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 h-9 text-xs rounded-xl font-semibold shadow-sm active:scale-95"
            >
              Novo Agendamento
            </button>
          </div>
        </div>

        {view === "mes" ? (
          <CalendarioMes
            mesRef={dataRef}
            eventos={eventos}
            onDiaClick={(d) => {
              setDataRef(d);
              setView("dia");
            }}
            onEventoClick={setDetalhe}
          />
        ) : (
          <ListaEventos
            eventos={eventos}
            onEventoClick={setDetalhe}
            agrupadoPorDia={view === "semana"}
          />
        )}
      </Layout>

      {modalAberto && (
        <ModalNovoEvento
          dataInicial={modalData}
          onClose={() => setModalAberto(false)}
          onSuccess={() => {
            setModalAberto(false);
            carregar();
          }}
        />
      )}

      {detalhe && (
        <DetalheEvento
          evento={detalhe}
          onClose={() => setDetalhe(null)}
          onConcluir={handleConcluir}
          onCancelar={handleCancelar}
          onExcluir={handleExcluir}
        />
      )}
    </>
  );
}

function StatCard({ label, valor, cor }) {
  const mapa = {
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-slate-800 p-4">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mapa[cor]}`}
        >
          <span className="text-xs font-bold">{valor}</span>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {valor}
        </p>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GraficoMovimentacoes,
  HeaderBar,
  Layout,
  SideBar,
} from "../../components";
import GraficoComposicao from "../../components/Especificos/CMV/GraficoComposicao";
import { useEmpresa } from "../../contexts";
import { cmvService } from "../../services/cmvService";
import { formatCurrency, formatPercent, formatQuantity } from "../../utils";

const PERIODOS = [
  { label: "30 dias", value: "30d", dias: 30 },
  { label: "90 dias", value: "90d", dias: 90 },
  { label: "6 meses", value: "6m", dias: 180 },
  { label: "12 meses", value: "12m", dias: 365 },
];

function calcularIntervalo(valor) {
  const config = PERIODOS.find((p) => p.value === valor) || PERIODOS[1];
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - config.dias);
  return { inicio, fim };
}

export default function CMVDetalhado() {
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [periodo, setPeriodo] = useState("90d");
  const [resumo, setResumo] = useState(null);
  const [evolucao, setEvolucao] = useState([]);
  const [composicao, setComposicao] = useState([]);
  const [topInsumos, setTopInsumos] = useState([]);
  const [meta, setMeta] = useState(30);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const { inicio, fim } = calcularIntervalo(periodo);
      const promises = [
        cmvService.getResumo(),
        cmvService.getEvolucao(inicio),
        cmvService.getComposicao(inicio, fim),
        cmvService.getTopInsumos(inicio, fim, 10),
      ];
      if (empresa?.id_empresa)
        promises.push(cmvService.getMeta(empresa.id_empresa));

      const [r, e, c, t, m] = await Promise.all(promises);
      setResumo(r);
      setEvolucao(e);
      setComposicao(c);
      setTopInsumos(t);
      if (m !== undefined) setMeta(Number(m) || 30);
    } catch (e) {
      console.error(e);
      setErro(e?.message || "Erro ao carregar dados do CMV.");
    } finally {
      setLoading(false);
    }
  }, [periodo, empresa?.id_empresa]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const saude = useMemo(() => {
    const atual = Number(resumo?.margem_lucro_percentual || 0);
    const cmvPct = 100 - atual;
    if (cmvPct <= meta) return { label: "Saudável", cor: "emerald", cmvPct };
    if (cmvPct <= meta + 5) return { label: "Atenção", cor: "amber", cmvPct };
    return { label: "Crítico", cor: "red", cmvPct };
  }, [resumo, meta]);

  if (loading) {
    return (
      <>
        <SideBar />
        <Layout>
          <HeaderBar page="CMV Detalhado" desc="Carregando..." />
          <div className="flex justify-center items-center h-64 sm:h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="CMV Detalhado"
          desc="Análise profunda do custo de mercadoria vendida."
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

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
              Período de análise:
            </span>
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  periodo === p.value
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 dark:bg-surface-dark-hover text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#241b42]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              saude.cor === "emerald"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : saude.cor === "amber"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            Saúde do CMV: {saude.label} ({saude.cmvPct.toFixed(1)}% / meta{" "}
            {meta}%)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KPI
            titulo="CMV (mês atual)"
            valor={formatCurrency(resumo?.cmv || 0)}
            descricao="Consumo do mês"
            cor="orange"
          />
          <KPI
            titulo="CMV %"
            valor={formatPercent(
              100 - Number(resumo?.margem_lucro_percentual || 0),
            )}
            descricao={`Meta: ${meta}%`}
            cor="purple"
          />
          <KPI
            titulo="Lucro bruto"
            valor={formatCurrency(resumo?.lucro_bruto || 0)}
            descricao="Faturamento − CMV"
            cor="emerald"
          />
          <KPI
            titulo="Margem de lucro"
            valor={formatPercent(resumo?.margem_lucro_percentual || 0)}
            descricao="Sobre o faturamento"
            cor="blue"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-white dark:bg-surface-dark-elevated p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-sm sm:text-base">
              Evolução financeira
            </h3>
            <GraficoMovimentacoes dados={evolucao} />
          </div>

          <div className="bg-white dark:bg-surface-dark-elevated p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 text-sm sm:text-base">
              Composição da movimentação
            </h3>
            <GraficoComposicao dados={composicao} />
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                Insumos que mais impactam o custo
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Top 10 em valor consumido no período selecionado
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-175">
              <thead className="bg-gray-50 dark:bg-surface-dark text-[10px] sm:text-xs uppercase text-gray-600 dark:text-gray-300 font-semibold">
                <tr>
                  <th className="px-4 py-3 w-8">#</th>
                  <th className="px-4 py-3">Insumo</th>
                  <th className="px-4 py-3 text-right">Quantidade</th>
                  <th className="px-4 py-3 text-right">Valor consumido</th>
                  <th className="px-4 py-3 w-[35%]">% do total</th>
                </tr>
              </thead>
              <tbody>
                {topInsumos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-400 dark:text-gray-500"
                    >
                      Nenhuma saída registrada no período.
                    </td>
                  </tr>
                ) : (
                  topInsumos.map((i, idx) => (
                    <tr
                      key={i.id_ingrediente}
                      className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-surface-dark-hover"
                    >
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                        {i.nm_ingrediente}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {formatQuantity(i.quantidade, i.sg_unidade)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                        {formatCurrency(i.valor)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(i.percentual, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums w-12 text-right">
                            {i.percentual.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
}

function KPI({ titulo, valor, descricao, cor }) {
  const mapa = {
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-slate-800 p-5">
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
        {titulo}
      </p>
      <div className="flex items-center gap-3 mt-2">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${mapa[cor]}`}
        >
          <span className="text-xs font-bold">%</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {valor}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
        {descricao}
      </p>
    </div>
  );
}

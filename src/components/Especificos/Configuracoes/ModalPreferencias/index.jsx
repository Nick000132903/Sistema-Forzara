import { useState } from "react";

import { useEmpresa, useAuth } from "../../../../contexts";
import { configuracaoService } from "../../../../services/configuracaoService";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

export default function ModalPreferencias({ configs, onClose, onSaved }) {
  const { empresa } = useEmpresa();
  const { usuario } = useAuth();
  const isGerente = ["gerente", "admin", "administrador"].includes(
    usuario?.tipo_perfil?.toLowerCase() || "",
  );

  const [form, setForm] = useState({
    cmv_meta_percentual: configs.cmv_meta_percentual || "30",
    dias_alerta_validade: configs.dias_alerta_validade || "7",
    aprovacao_perda_ativa:
      configs.aprovacao_perda_ativa !== "false" ? "true" : "false",
    aprovacao_perda_threshold_rs: configs.aprovacao_perda_threshold_rs || "50",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const salvar = async (e) => {
    e.preventDefault();
    if (!empresa?.id_empresa) return;
    setLoading(true);
    setMsg(null);
    try {
      await configuracaoService.setMany(empresa.id_empresa, form);
      setMsg({ tipo: "ok", texto: "Preferências salvas." });
      onSaved?.(form);
      setTimeout(onClose, 700);
    } catch (err) {
      setMsg({ tipo: "erro", texto: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-dark-elevated rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Preferências
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={salvar} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Meta de CMV (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.cmv_meta_percentual}
              onChange={(e) =>
                setForm({ ...form, cmv_meta_percentual: e.target.value })
              }
              className={inputClass}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Usada na tela de CMV Detalhado.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dias de alerta de validade
            </label>
            <input
              type="number"
              min="1"
              value={form.dias_alerta_validade}
              onChange={(e) =>
                setForm({ ...form, dias_alerta_validade: e.target.value })
              }
              className={inputClass}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Quantos dias antes do vencimento alertar.
            </p>
          </div>

          {isGerente && (
            <>
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Aprovação de perdas
                </h4>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="aprovacao_ativa"
                    checked={form.aprovacao_perda_ativa === "true"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        aprovacao_perda_ativa: e.target.checked
                          ? "true"
                          : "false",
                      })
                    }
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <label
                    htmlFor="aprovacao_ativa"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Exigir aprovação de perdas acima do limite
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor limite (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.aprovacao_perda_threshold_rs}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aprovacao_perda_threshold_rs: e.target.value,
                    })
                  }
                  className={inputClass}
                  disabled={form.aprovacao_perda_ativa !== "true"}
                />
              </div>
            </>
          )}

          {msg && (
            <div
              className={`p-3 rounded-lg text-sm ${
                msg.tipo === "ok"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {msg.texto}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium text-sm active:scale-95"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth, useEmpresa } from "../../../../contexts";
import { movimentacaoService } from "../../../../services/movimentacaoService";
import { ingredienteService } from "../../../../services/ingredienteService";
import { fornecedorService } from "../../../../services/fornecedorService";

const TIPOS = [
  { value: "entrada", label: "Entrada", color: "bg-green-500" },
  { value: "saida", label: "Saída", color: "bg-red-500" },
  { value: "perda", label: "Perda", color: "bg-orange-500" },
  { value: "ajuste", label: "Ajuste", color: "bg-purple-500" },
];

export default function ModalNovaMovimentacao({ onClose, onSuccess }) {
  const { user } = useAuth();
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [form, setForm] = useState({
    tipo: "entrada",
    id_ingrediente: "",
    quantidade: "",
    motivo: "",
    vl_unitario: "",
    dt_validade: "",
    id_fornecedor: "",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [ings, forns] = await Promise.all([
          ingredienteService.getAll(),
          fornecedorService.getAll(),
        ]);
        setIngredientes(ings || []);
        setFornecedores(forns || []);
      } catch (err) {
        console.error(err);
      }
    };
    carregar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        id_ingrediente: Number(form.id_ingrediente),
        id_usuario: user?.user_metadata?.id_usuario || 1,
        tipo: form.tipo,
        motivo: form.motivo.trim(),
        quantidade: Number(form.quantidade),
      };

      if (form.tipo === "entrada") {
        payload.vl_unitario = Number(form.vl_unitario) || 0;
        payload.dt_validade = form.dt_validade || null;
        payload.id_fornecedor = form.id_fornecedor
          ? Number(form.id_fornecedor)
          : null;
      }

      await movimentacaoService.registrar(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao registrar movimentação.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-100 transition-all";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#181330] rounded-2xl p-6 max-w-lg w-full shadow-xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Nova Movimentação
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer transition-colors active:scale-90"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Tipo de Movimentação *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: t.value })}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                    form.tipo === t.value
                      ? `${t.color} text-white shadow-md`
                      : "bg-gray-50 dark:bg-[#0B071E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingrediente *
            </label>
            <select
              required
              value={form.id_ingrediente}
              onChange={(e) =>
                setForm({ ...form, id_ingrediente: e.target.value })
              }
              className={inputClass}
            >
              <option value="">Selecione o ingrediente</option>
              {ingredientes.map((i) => (
                <option key={i.id_ingrediente} value={i.id_ingrediente}>
                  {i.nm_ingrediente} — Estoque: {i.qt_atual} {i.sg_unidade}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantidade *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.quantidade}
                onChange={(e) =>
                  setForm({ ...form, quantidade: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: 10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Motivo *
              </label>
              <input
                type="text"
                required
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                className={inputClass}
                placeholder="Ex: Compra de reposição"
              />
            </div>
          </div>

          {form.tipo === "entrada" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.vl_unitario}
                    onChange={(e) =>
                      setForm({ ...form, vl_unitario: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ex: 69.90"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data de Validade
                  </label>
                  <input
                    type="date"
                    value={form.dt_validade}
                    onChange={(e) =>
                      setForm({ ...form, dt_validade: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fornecedor
                </label>
                <select
                  value={form.id_fornecedor}
                  onChange={(e) =>
                    setForm({ ...form, id_fornecedor: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Selecione (opcional)</option>
                  {fornecedores.map((f) => (
                    <option key={f.id_fornecedor} value={f.id_fornecedor}>
                      {f.documento?.nm_portador || "Fornecedor"}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm text-center animate-in shake">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm transition-colors active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              {loading ? "Registrando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

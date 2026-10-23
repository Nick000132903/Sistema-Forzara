import { useEffect, useState } from "react";
import { useEmpresa } from "../../../../contexts";
import { categoriaService } from "../../../../services/categoriaService";
import { ingredienteService } from "../../../../services/ingredienteService";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

export default function ModalNovoIngrediente({ onClose, onSuccess }) {
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [form, setForm] = useState({
    nm_ingrediente: "",
    id_categoria: "",
    id_unidade: "",
    qt_minima: "",
    vl_unitario_atual: "",
    localizacao_fisica: "Despensa",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [cats, unis] = await Promise.all([
          categoriaService.getAllCategoriasIngrediente(),
          categoriaService.getUnidadesMedida(),
        ]);
        setCategorias(cats || []);
        setUnidades(unis || []);
      } catch (err) {
        console.error(err);
      }
    };
    carregar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empresa?.id_empresa) {
      setError("Empresa não carregada. Aguarde e tente novamente.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await ingredienteService.create({
        id_empresa: empresa.id_empresa,
        id_categoria: Number(form.id_categoria),
        id_unidade: Number(form.id_unidade),
        nm_ingrediente: form.nm_ingrediente.trim(),
        qt_minima: Number(form.qt_minima),
        vl_unitario_atual: Number(form.vl_unitario_atual) || 0,
        localizacao_fisica: form.localizacao_fisica.trim() || "Despensa",
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar ingrediente.");
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
        className="bg-white dark:bg-surface-dark-elevated rounded-2xl p-6 max-w-lg w-full shadow-xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Novo Ingrediente
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer transition-colors active:scale-90"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Ingrediente *
            </label>
            <input
              type="text"
              required
              value={form.nm_ingrediente}
              onChange={(e) =>
                setForm({ ...form, nm_ingrediente: e.target.value })
              }
              className={inputClass}
              placeholder="Ex: Tomate Italiano"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria *
              </label>
              <select
                required
                value={form.id_categoria}
                onChange={(e) =>
                  setForm({ ...form, id_categoria: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Selecione</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nm_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Unidade *
              </label>
              <select
                required
                value={form.id_unidade}
                onChange={(e) =>
                  setForm({ ...form, id_unidade: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Selecione</option>
                {unidades.map((u) => (
                  <option key={u.id_unidade} value={u.id_unidade}>
                    {u.sg_unidade} — {u.ds_unidade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Qtd. Mínima *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.qt_minima}
                onChange={(e) =>
                  setForm({ ...form, qt_minima: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: 5"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custo Unitário (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.vl_unitario_atual}
                onChange={(e) =>
                  setForm({ ...form, vl_unitario_atual: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: 7.50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Localização Física
            </label>
            <input
              type="text"
              value={form.localizacao_fisica}
              onChange={(e) =>
                setForm({ ...form, localizacao_fisica: e.target.value })
              }
              className={inputClass}
              placeholder="Ex: Geladeira A1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
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
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

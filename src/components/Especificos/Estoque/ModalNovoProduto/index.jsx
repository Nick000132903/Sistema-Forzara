import { useEffect, useState } from "react";
import { useEmpresa } from "../../../../contexts";
import { categoriaService } from "../../../../services/categoriaService";
import { produtoService } from "../../../../services/produtoService";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

export default function ModalNovoProduto({ onClose, onSuccess }) {
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nm_produto: "",
    ds_produto: "",
    vl_venda_produto: "",
    id_categoria_produto: "",
    tempo_preparo: "15",
    alergenicos: "Nenhum",
    disponivel_delivery: true,
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const cats = await categoriaService.getAllCategoriasProduto();
        setCategorias(cats || []);
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
      await produtoService.create({
        id_empresa: empresa.id_empresa,
        id_categoria_produto: Number(form.id_categoria_produto),
        nm_produto: form.nm_produto.trim(),
        ds_produto: form.ds_produto.trim(),
        vl_venda_produto: Number(form.vl_venda_produto),
        tempo_preparo: Number(form.tempo_preparo) || 15,
        alergenicos: form.alergenicos.trim() || "Nenhum",
        disponivel_delivery: form.disponivel_delivery,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar produto.");
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
            Novo Produto
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
              Nome do Produto *
            </label>
            <input
              type="text"
              required
              value={form.nm_produto}
              onChange={(e) => setForm({ ...form, nm_produto: e.target.value })}
              className={inputClass}
              placeholder="Ex: Picanha na Brasa"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              rows={2}
              value={form.ds_produto}
              onChange={(e) => setForm({ ...form, ds_produto: e.target.value })}
              className={`${inputClass} resize-none`}
              placeholder="Ex: Picanha grelhada com arroz, farofa e salada."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoria *
              </label>
              <select
                required
                value={form.id_categoria_produto}
                onChange={(e) =>
                  setForm({ ...form, id_categoria_produto: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Selecione</option>
                {categorias.map((c) => (
                  <option
                    key={c.id_categoria_produto}
                    value={c.id_categoria_produto}
                  >
                    {c.nm_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Preço de Venda (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={form.vl_venda_produto}
                onChange={(e) =>
                  setForm({ ...form, vl_venda_produto: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: 49.90"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tempo de Preparo (min)
              </label>
              <input
                type="number"
                value={form.tempo_preparo}
                onChange={(e) =>
                  setForm({ ...form, tempo_preparo: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: 25"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alergênicos
              </label>
              <input
                type="text"
                value={form.alergenicos}
                onChange={(e) =>
                  setForm({ ...form, alergenicos: e.target.value })
                }
                className={inputClass}
                placeholder="Ex: Contém Glúten e Leite"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="delivery"
              checked={form.disponivel_delivery}
              onChange={(e) =>
                setForm({ ...form, disponivel_delivery: e.target.checked })
              }
              className="h-4 w-4 accent-primary rounded border-slate-300 cursor-pointer"
            />
            <label
              htmlFor="delivery"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              Disponível para delivery
            </label>
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

import { useEffect, useState } from "react";
import { useAuth, useEmpresa } from "../../../../contexts";
import { agendaService } from "../../../../services/agendaService";
import { ingredienteService } from "../../../../services/ingredienteService";
import { fornecedorService } from "../../../../services/fornecedorService";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

const TIPOS = [
  { value: "reposicao", label: "Reposição" },
  { value: "entrega", label: "Entrega de Fornecedor" },
  { value: "contagem_fisica", label: "Contagem Física" },
  { value: "manutencao", label: "Manutenção" },
];

const RECORRENCIAS = [
  { value: "nenhuma", label: "Não recorrente" },
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Mensal" },
];

export default function ModalNovoEvento({ onClose, onSuccess, dataInicial }) {
  const { usuario } = useAuth();
  const { empresa } = useEmpresa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const hoje = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    tipo: "reposicao",
    titulo: "",
    descricao: "",
    id_ingrediente: "",
    id_fornecedor: "",
    quantidade: "",
    unidade: "",
    data_evento: dataInicial || hoje,
    hora_evento: "08:00",
    recorrencia: "nenhuma",
    observacoes: "",
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
      } catch (e) {
        console.error(e);
      }
    };
    carregar();
  }, []);

  const precisaFornecedor =
    form.tipo === "entrega" || form.tipo === "reposicao";
  const precisaInsumo = form.tipo !== "manutencao";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empresa?.id_empresa) {
      setError("Empresa não carregada.");
      return;
    }
    if (!form.titulo.trim()) {
      setError("Título obrigatório.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await agendaService.criar({
        id_empresa: empresa.id_empresa,
        id_ingrediente: form.id_ingrediente
          ? Number(form.id_ingrediente)
          : null,
        id_fornecedor: form.id_fornecedor ? Number(form.id_fornecedor) : null,
        id_usuario: usuario?.id_usuario || null,
        tipo: form.tipo,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim() || null,
        quantidade: form.quantidade ? Number(form.quantidade) : null,
        unidade: form.unidade.trim() || null,
        data_evento: form.data_evento,
        hora_evento: form.hora_evento || null,
        recorrencia: form.recorrencia || "nenhuma",
        observacoes: form.observacoes.trim() || null,
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Erro ao criar evento.");
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
            Novo Agendamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo *
            </label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className={inputClass}
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Título *
            </label>
            <input
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className={inputClass}
              placeholder="Ex: Reposição de carnes"
            />
          </div>

          {precisaInsumo && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Insumo
              </label>
              <select
                value={form.id_ingrediente}
                onChange={(e) => {
                  const id = e.target.value;
                  const ing = ingredientes.find(
                    (i) => String(i.id_ingrediente) === id,
                  );
                  setForm({
                    ...form,
                    id_ingrediente: id,
                    unidade: ing?.sg_unidade || form.unidade,
                  });
                }}
                className={inputClass}
              >
                <option value="">Selecione</option>
                {ingredientes.map((i) => (
                  <option key={i.id_ingrediente} value={i.id_ingrediente}>
                    {i.nm_ingrediente}
                  </option>
                ))}
              </select>
            </div>
          )}

          {precisaFornecedor && (
            <div>
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
                <option value="">Selecione</option>
                {fornecedores.map((f) => (
                  <option key={f.id_fornecedor} value={f.id_fornecedor}>
                    {f.documento?.nm_portador || `#${f.id_fornecedor}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {precisaInsumo && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantidade
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.quantidade}
                  onChange={(e) =>
                    setForm({ ...form, quantidade: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unidade
                </label>
                <input
                  type="text"
                  value={form.unidade}
                  onChange={(e) =>
                    setForm({ ...form, unidade: e.target.value })
                  }
                  className={inputClass}
                  placeholder="kg, un..."
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data *
              </label>
              <input
                type="date"
                required
                value={form.data_evento}
                onChange={(e) =>
                  setForm({ ...form, data_evento: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hora
              </label>
              <input
                type="time"
                value={form.hora_evento}
                onChange={(e) =>
                  setForm({ ...form, hora_evento: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recorrência
            </label>
            <select
              value={form.recorrencia}
              onChange={(e) =>
                setForm({ ...form, recorrencia: e.target.value })
              }
              className={inputClass}
            >
              {RECORRENCIAS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Observações
            </label>
            <textarea
              rows={2}
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              className={`${inputClass} resize-none`}
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
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium text-sm active:scale-95"
            >
              {loading ? "Criando..." : "Criar evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

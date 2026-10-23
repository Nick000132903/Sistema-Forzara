import { useEffect, useState } from "react";

import { useEmpresa } from "../../../../contexts";
import { usuarioService } from "../../../../services/usuarioService";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

const PERFIS = [
  { value: "Funcionário", label: "Funcionário" },
  { value: "Gerente", label: "Gerente" },
];

export default function ModalUsuarios({ onClose }) {
  const { empresa } = useEmpresa();
  const [modo, setModo] = useState("lista");
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    nm_usuario: "",
    nm_email: "",
    tipo_perfil: "Funcionário",
    cargo: "",
  });
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    if (!empresa?.id_empresa) return;
    setLoading(true);
    try {
      const data = await usuarioService.listar(empresa.id_empresa);
      setUsuarios(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [empresa?.id_empresa]);

  const criar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setError(null);
    try {
      await usuarioService.criar({
        id_empresa: empresa.id_empresa,
        nm_usuario: form.nm_usuario.trim(),
        nm_email: form.nm_email.trim(),
        tipo_perfil: form.tipo_perfil,
        cargo: form.cargo.trim() || null,
      });
      setForm({
        nm_usuario: "",
        nm_email: "",
        tipo_perfil: "Funcionário",
        cargo: "",
      });
      setModo("lista");
      await carregar();
    } catch (err) {
      setError(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const toggleAtivo = async (u) => {
    try {
      await usuarioService.alternarAtivo(u.id_usuario, !u.ativo);
      await carregar();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-dark-elevated rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {modo === "lista" ? "Usuários" : "Novo usuário"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {modo === "lista" && (
          <div className="mt-4">
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setModo("novo")}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                + Novo usuário
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : usuarios.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">
                Nenhum usuário cadastrado.
              </p>
            ) : (
              <div className="space-y-2">
                {usuarios.map((u) => (
                  <div
                    key={u.id_usuario}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {u.nm_usuario}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {u.nm_email} · {u.tipo_perfil}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          u.ativo
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {u.ativo ? "Ativo" : "Inativo"}
                      </span>
                      <button
                        onClick={() => toggleAtivo(u)}
                        className="text-xs text-primary hover:underline"
                      >
                        {u.ativo ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
              ℹ️ Ao criar um usuário aqui, ele precisa se cadastrar no sistema
              com o mesmo e-mail para o vínculo automático acontecer.
            </div>
          </div>
        )}

        {modo === "novo" && (
          <form onSubmit={criar} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome *
              </label>
              <input
                type="text"
                required
                value={form.nm_usuario}
                onChange={(e) =>
                  setForm({ ...form, nm_usuario: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={form.nm_email}
                onChange={(e) => setForm({ ...form, nm_email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Perfil *
                </label>
                <select
                  value={form.tipo_perfil}
                  onChange={(e) =>
                    setForm({ ...form, tipo_perfil: e.target.value })
                  }
                  className={inputClass}
                >
                  {PERFIS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cargo
                </label>
                <input
                  type="text"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  className={inputClass}
                  placeholder="Ex: Chefe de cozinha"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setModo("lista")}
                className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium text-sm"
              >
                {salvando ? "Criando..." : "Criar usuário"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

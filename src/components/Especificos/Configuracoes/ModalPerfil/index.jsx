import { useState } from "react";
import { useAuth } from "../../../../contexts";
import { formatPhone } from "../../../../utils/validators";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

export default function ModalPerfil({ onClose }) {
  const { user, usuario, updateUser } = useAuth();
  const [nome, setNome] = useState(user?.user_metadata?.display_name || "");
  const [telefone, setTelefone] = useState(user?.user_metadata?.telefone || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const salvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await updateUser({
        display_name: nome.trim(),
        telefone: telefone.trim(),
      });
      setMsg({ tipo: "ok", texto: "Perfil atualizado." });
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
        className="bg-white dark:bg-surface-dark-elevated rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Editar perfil
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-surface-dark text-xs text-gray-500 dark:text-gray-400">
          <p>
            <strong>E-mail:</strong> {user?.email}
          </p>
          <p className="mt-1">
            <strong>Perfil:</strong> {usuario?.tipo_perfil || "—"}
            {usuario?.cargo ? ` · ${usuario.cargo}` : ""}
          </p>
        </div>

        <form onSubmit={salvar} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome de exibição
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
              placeholder="Como quer ser chamado"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              className={inputClass}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </div>

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

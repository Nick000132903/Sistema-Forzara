import { useEffect, useMemo, useRef, useState } from "react";
import { useEmpresa } from "../../../../contexts";
import { fornecedorService } from "../../../../services/fornecedorService";
import {
  formatCNPJ,
  validateCNPJ,
  formatPhone,
  validateEmail,
} from "../../../../utils/validators";

const inputClass =
  "w-full mt-1 px-3 py-2.5 bg-gray-50 dark:bg-[#0B071E] border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 dark:text-gray-100 transition-all";

export default function ModalFornecedores({ onClose, onSuccess, fornecedor }) {
  const { empresa, loading: empresaLoading } = useEmpresa();
  const isEdit = Boolean(fornecedor);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [fotoPreview, setFotoPreview] = useState(fornecedor?.url_foto || null);
  const [fotoFile, setFotoFile] = useState(null);

  const [form, setForm] = useState({
    nm_portador: fornecedor?.documento?.nm_portador || "",
    numero_documento: fornecedor?.documento?.numero_documento
      ? formatCNPJ(fornecedor.documento.numero_documento)
      : "",
    cd_telefone: fornecedor?.documento?.cd_telefone
      ? formatPhone(fornecedor.documento.cd_telefone)
      : "",
    nm_email: fornecedor?.documento?.nm_email || "",
    contato_principal: fornecedor?.contato_principal || "",
    prazo_entrega_padrao: String(fornecedor?.prazo_entrega_padrao ?? 2),
    condicao_pagamento: fornecedor?.condicao_pagamento || "À vista",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!form.nm_portador.trim()) e.nm_portador = "Obrigatório";
    if (!form.numero_documento.trim()) e.numero_documento = "Obrigatório";
    else if (!validateCNPJ(form.numero_documento))
      e.numero_documento = "CNPJ inválido";
    if (!form.contato_principal.trim()) e.contato_principal = "Obrigatório";
    if (form.nm_email && !validateEmail(form.nm_email))
      e.nm_email = "E-mail inválido";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Foto muito grande (máx 5MB).");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem.");
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      nm_portador: true,
      numero_documento: true,
      contato_principal: true,
      nm_email: true,
    });
    if (!isValid) return;
    if (!isEdit && !empresa?.id_empresa) {
      setError("Empresa não identificada. Recarregue a página.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nm_portador: form.nm_portador.trim(),
        numero_documento: form.numero_documento.replace(/\D/g, ""),
        cd_telefone: form.cd_telefone.trim() || null,
        nm_email: form.nm_email.trim() || null,
        contato_principal: form.contato_principal.trim(),
        prazo_entrega_padrao: Number(form.prazo_entrega_padrao) || 2,
        condicao_pagamento: form.condicao_pagamento.trim() || "À vista",
        foto: fotoFile,
      };

      if (isEdit) {
        await fornecedorService.update(
          fornecedor.id_fornecedor,
          fornecedor.id_documento,
          payload,
        );
      } else {
        await fornecedorService.create({
          ...payload,
          id_empresa: empresa.id_empresa,
          tipo_documento: "cnpj",
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Erro ao salvar fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }) =>
    touched[name] && errors[name] ? (
      <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
        {errors[name]}
      </p>
    ) : null;

  if (empresaLoading && !isEdit) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
        </div>
      </div>
    );
  }

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
            {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        {!isEdit && !empresa && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
            Sua conta não está vinculada a uma empresa.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full bg-purple-400/20 flex items-center justify-center overflow-hidden shrink-0 border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-primary transition-colors cursor-pointer"
            >
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/icons/user-branco.svg"
                  alt=""
                  className="w-8 h-8 opacity-60"
                />
              )}
            </button>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Foto do fornecedor
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Opcional · JPG/PNG · máx 5MB
              </p>
              {fotoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFotoFile(null);
                    setFotoPreview(null);
                  }}
                  className="text-xs text-red-600 hover:underline mt-1"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Razão Social / Nome *
            </label>
            <input
              type="text"
              value={form.nm_portador}
              onChange={(e) =>
                setForm({ ...form, nm_portador: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, nm_portador: true })}
              className={inputClass}
              placeholder="Ex: Casa de Carnes Vitória"
            />
            <FieldError name="nm_portador" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CNPJ *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.numero_documento}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numero_documento: formatCNPJ(e.target.value),
                  })
                }
                onBlur={() =>
                  setTouched({ ...touched, numero_documento: true })
                }
                className={inputClass}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              <FieldError name="numero_documento" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.cd_telefone}
                onChange={(e) =>
                  setForm({ ...form, cd_telefone: formatPhone(e.target.value) })
                }
                className={inputClass}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              value={form.nm_email}
              onChange={(e) => setForm({ ...form, nm_email: e.target.value })}
              onBlur={() => setTouched({ ...touched, nm_email: true })}
              className={inputClass}
              placeholder="contato@fornecedor.com"
            />
            <FieldError name="nm_email" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Contato Principal *
            </label>
            <input
              type="text"
              value={form.contato_principal}
              onChange={(e) =>
                setForm({ ...form, contato_principal: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, contato_principal: true })}
              className={inputClass}
              placeholder="Nome do responsável"
            />
            <FieldError name="contato_principal" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Prazo de Entrega (horas)
              </label>
              <input
                type="number"
                min="1"
                value={form.prazo_entrega_padrao}
                onChange={(e) =>
                  setForm({ ...form, prazo_entrega_padrao: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Condição de Pagamento
              </label>
              <input
                type="text"
                value={form.condicao_pagamento}
                onChange={(e) =>
                  setForm({ ...form, condicao_pagamento: e.target.value })
                }
                className={inputClass}
                placeholder="À vista, 30 dias, 30/60..."
              />
            </div>
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
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (!isEdit && !empresa) || !isValid}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium text-sm active:scale-95 shadow-sm"
            >
              {loading
                ? "Salvando..."
                : isEdit
                  ? "Salvar alterações"
                  : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

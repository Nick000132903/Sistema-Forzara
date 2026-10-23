export default function ModalSobre({ onClose }) {
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
            Sobre o FORZARA
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none cursor-pointer"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-f-roxo.png"
              alt="Forzara"
              className="h-10 dark:hidden"
            />
            <img
              src="/images/logo-f-branco.png"
              alt="Forzara"
              className="h-10 hidden dark:block"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                FORZARA
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Versão 1.0.0
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
            <p>
              <strong>Suporte:</strong> suporte@forzara.app
            </p>
            <p>
              <strong>Termos de uso:</strong> disponível em breve
            </p>
            <p>
              <strong>Política de privacidade:</strong> disponível em breve
            </p>
            <p>
              <strong>LGPD:</strong> seus dados são tratados conforme a Lei
              13.709/2018.
            </p>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-slate-800">
            © {new Date().getFullYear()} FORZARA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

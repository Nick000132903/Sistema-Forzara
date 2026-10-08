export default function ModalFornecedores({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Novo Fornecedor
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="my-5 text-gray-500 text-sm text-center">
          <p>
            Preencha as informações do fornecedor para cadastrá-lo no sistema.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors cursor-pointer">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

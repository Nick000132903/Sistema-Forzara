export default function CardFornecedores({ name, category, prazo }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-colors cursor-pointer">
      <div className="flex gap-4 items-center">
        <div className="flex rounded-full bg-purple-400/20 w-11 h-11 items-center justify-center shrink-0">
          <img
            src="./src/assets/icons/user-branco.svg"
            alt="Fornecedor"
            className="w-5 h-5"
          />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {category} · Entrega: {prazo}h
          </p>
        </div>
      </div>
      <div>
        <img
          src="./src/assets/icons/arrow-down-cinza.svg"
          alt="Ver"
          className="w-4 -rotate-90 opacity-50"
        />
      </div>
    </div>
  );
}

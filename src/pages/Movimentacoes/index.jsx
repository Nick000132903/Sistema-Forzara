import { useEffect, useState } from "react";
import { HeaderBar, SideBar } from "../../components";
import { supabase } from "../../services";

export default function Movimentacoes() {

  const [dashboard, setDashboard] = useState({
    entradas: 0,
    saidas: 0,
    produtosEstoque: 0,
    baixoEstoque: 0,
    valorTotal: 0
  });

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {

    const { data: movimentacoes, error: erroMovimentacoes } =
      await supabase
        .from("movimentacao")
        .select("tipo_movimentacao, quantidade, status");

    const { data: lotes, error: erroLotes } =
      await supabase
        .from("lote")
        .select("qt_atual, vl_unitario");

    if (erroMovimentacoes || erroLotes) {
      console.error(erroMovimentacoes || erroLotes);
      return;
    }

    const entradas = movimentacoes
      .filter(m =>
        m.tipo_movimentacao?.toLowerCase() === "entrada"
      )
      .reduce((total, m) =>
        total + Number(m.quantidade || 0), 0
      );

    const saidas = movimentacoes
      .filter(m =>
        m.tipo_movimentacao?.toLowerCase() === "saida"
      )
      .reduce((total, m) =>
        total + Number(m.quantidade || 0), 0
      );

    const lotesComEstoque = lotes.filter(
      lote => Number(lote.qt_atual || 0) > 0
    );

    const produtosEstoque = lotesComEstoque.length;

    const baixoEstoque = lotesComEstoque.filter(
      lote => Number(lote.qt_atual) <= 10
    ).length;

    const valorTotal = lotesComEstoque.reduce(
      (total, lote) =>
        total +
        Number(lote.qt_atual || 0) *
        Number(lote.vl_unitario || 0),
      0
    );

    setDashboard({
      entradas,
      saidas,
      produtosEstoque,
      baixoEstoque,
      valorTotal
    });
  }


 const buscarMovimentacoes = async () => {
  const { data, error } = await supabase
    .from("movimentacao")
    .select(`
      *,
      produto (*)
    `)
    .order("hora_movimentacao", { ascending: false })
    .limit(12);
  if (error) {
    console.log("ERRO AO BUSCAR MOVIMENTAÇÃO:", error);
    alert(error.message);
    return;
  }

  console.log("MOVIMENTAÇÕES:", data);

  setMovimentacoes(data);
};



const [movimentacoes, setMovimentacoes] = useState([]);

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  return (
    <>
      <SideBar />
      <div className="ml-60 p-6 bg-[#F8FAFC] min-h-screen">
        <HeaderBar
          page="Movimentações"
          desc={"Registro de entradas, saídas e alterações no estoque."}
        />
          <div className="p-5 w-full h-full bg-white rounded-[10px] mt-15 mb-5">
            <div className="flex justify-between pr-35">
              <h1 className="font-semibold text-[18px]">Movimentações de Estoque</h1>
              <div className="flex  gap-5">
                <button className="w-45 h-9 text-[11px] cursor-pointer flex bg-gray-200/30 rounded-[25px] items-center justify-center text-gray-600">
                  01/08/2025-31/08/2025
                  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15 7L10 12L15 17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>  
                </button>
                <button className="w-45 h-9 text-[11px] cursor-pointer flex bg-purple-700/70 rounded-[25px] items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" width="24px" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                  Nova movimentação
                </button>
            </div>
          </div>
          <div>
            <h1 className="text-[12px] font-semibold text-gray-800/90 mt-2">Total em estoque</h1>
          </div>
            <div className="flex items-center gap-5">
              <h1 className="text-[22px] font-semibold">
                {dashboard.valorTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
              })}
              </h1>
              <div className="w-60 h-7 text-[11px] flex bg-green-700/70 rounded-[25px] items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" width="18px" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
                  2,6% em relação ao mês anterior
                </div>
              </div>

        <div className="grid grid-cols-5 max-[1300px]:grid-cols-3 gap-5">

        <div className="gap-2.5 flex w-75 max-[700px]:w-2/4 p-3 h-35 bg-none border-2 mt-5 border-gray-600/10 rounded-[10px]">
          <div className="w-10 h-10 bg-green-700/20  rounded-[50px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24px" color="green" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>
          </div>
          <div>
            <div>
              <h1 className="text-[16px] text-gray-800/80 font-semibold mb-3">
                Entradas
              </h1>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-semibold">
                  {dashboard.entradas}
                </h1>
                <div className="flex">
                  <svg viewBox="0 0 24 24" fill="none" width="16px" color="green" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
                  <h1 className="text-[14px] text-green-700">
                    12%
                  </h1>
                </div>
              </div>
              <div>
                  <h1 className="text-[14px] font-semibold text-gray-800/70">
                    Itens adicionados
                  </h1>
                </div>
            </div>
          </div>
        </div>


      <div className="gap-2.5 flex w-75 max-[700px]:w-2/4 p-3 h-35 bg-none border-2 mt-5 border-gray-600/10 rounded-[10px]">
          <div className="w-10 h-10 bg-red-400/20  rounded-[50px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="24px" color="red" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
          </div>
          <div>
            <div>
              <h1 className="text-[16px] text-gray-800/80 font-semibold mb-3">
                Saídas
              </h1>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-semibold">
                  {dashboard.saidas}
                </h1>
                <div className="flex">
                  <svg viewBox="0 0 24 24" fill="none" width="16px" color="red" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
                  <h1 className="text-[14px] text-red-600">
                    8%
                  </h1>
                </div>
              </div>
              <div>
                  <h1 className="text-[14px] font-semibold text-gray-800/70">
                    Itens removidos
                  </h1>
                </div>
            </div>
          </div>
        </div>

        <div className="gap-2.5 flex w-75 max-[700px]:w-2/4 p-3 h-35 bg-none border-2 mt-5 border-gray-600/10 rounded-[10px]">
          <div className="w-10 h-10 bg-purple-700/20  rounded-[50px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" width="22px" color="purple" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>
          </div>
          <div>
            <div>
              <h1 className="text-[14px] text-gray-800/80 font-semibold mb-3">
                Produtos no estoque
              </h1>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-semibold">
                  {dashboard.produtosEstoque}
                </h1>
                <div className="flex">
                  <svg viewBox="0 0 24 24" fill="none" width="16px" color="green" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
                  <h1 className="text-[14px] text-green-700">
                    4%
                  </h1>
                </div>
              </div>
              <div>
                  <h1 className="text-[14px] font-semibold text-gray-800/70">
                    Total de itens diferentes
                  </h1>
                </div>
            </div>
          </div>
        </div>

        <div className="gap-2.5 flex w-75 max-[700px]:w-2/4 p-3 h-35 bg-none border-2 mt-5 border-gray-600/10 rounded-[10px]">
          <div className="w-10 h-10 bg-yellow-400/10  rounded-[50px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" width="22px" color="orange" stroke="currentColor" stroke-width="2"><path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
          </div>
          <div>
            <div>
              <h1 className="text-[16px] text-gray-800/80 font-semibold mb-3">
                Itens em baixo estoque
              </h1>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-semibold">
                  {dashboard.baixoEstoque}
                </h1>
                <div className="flex">
                  <svg viewBox="0 0 24 24" fill="none" width="16px" color="red " stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
                  <h1 className="text-[14px] text-red-700">
                    75%
                  </h1>
                </div>
              </div>
              <div>
                  <h1 className="text-[14px] font-semibold text-gray-800/70">
                    Requerem atenção
                  </h1>
                </div>
            </div>
          </div>
        </div>

        <div className=" flex w-75 p-3 h-35 bg-none border-2 mt-5 border-gray-600/10 rounded-[10px]">
          <div className="w-10 h-10 bg-blue-700/20  rounded-[50px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" width="22px" color="blue" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <div>
            <div className="ml-2">
              <h1 className="text-[16px] text-gray-800/80 font-semibold mb-3">
               Valor total do estoque
              </h1>
              <div className="flex items-center gap-3">
              <h1 className="text-[22px] font-semibold">
              {dashboard.valorTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
              })}
              </h1>
              <div className="flex">
              <svg viewBox="0 0 24 24" fill="none" width="16px" color="green" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>
              <h1 className="text-[14px] text-green-700">
              2,6%
               </h1>
              </div>
              </div>
              <div>
          <h1 className="text-[14px] font-semibold text-gray-800/70">
            Valor atual dos itens
          </h1>
         </div>
         </div>
         </div>
        </div>
      </div>
      </div>
      
  <div className="flex gap-4">
  <div className="w-full h-full bg-white rounded-[10px] p-3">
    <h1 className="text-[15px] font-semibold mb-1">
      Movimentações Recentes
    </h1>

    <div className="flex justify-between">
      <div>
        <input
          type="text"
          placeholder="Buscar produto, Categoria ou Fornecedor..."
          className="w-80 h-6 bg-gray-500/10 rounded-[10px] p-2 text-[10px] text-gray-700"
        />
      </div>

      <div className="flex gap-2">
        <select
          name="tipo"
          id="tipo"
          className="w-40 h-6 bg-none border border-gray-700/20 rounded-[5px] text-[11px]"
        >
          <option value="">Todos os tipos</option>
          <option value="">exemplo 1</option>
          <option value="">exemplo 2</option>
        </select>

        <button className="w-40 h-6 bg-none items-center justify-center gap-2 border border-gray-700/20 rounded-[5px] text-[10px] flex">
          <svg viewBox="0 0 24 24" fill="none" width="14px" color="black" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Ultimos 7 dias
    <svg viewBox="0 0 24 24" fill="none" width="14px" color="black" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6"/>
    </svg>
    </button>
    </div>
    </div>


    <table className="w-full">
  <thead>
    <tr className="grid grid-cols-8 mt-5 border-b border-b-gray-500/40">
      <th className="text-[14px] font-semibold mb-3 text-gray-800">
        Data/Hora
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Tipo
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Motivo
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Categoria
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Quantidade
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Valor 'R$'
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Responsável
      </th>

      <th className="text-[14px] font-semibold text-gray-800">
        Status
      </th>
    </tr>
  </thead>

  <tbody>
    {movimentacoes.map((movimentacao) => (
      <tr
        key={movimentacao.id_movimentacao}
        className="grid grid-cols-8 items-center ml-5 p-2 border-b-2 border-b-gray-300"
      >
        
        <td className="text-[10px]">
          {movimentacao.hora_movimentacao}
        </td>

        <td className="flex items-center ml-5 gap-2">
  <span
    className={`w-5 h-5 rounded-full flex  justify-center ${
      movimentacao.tipo_movimentacao?.toLowerCase() === "entrada"
        ? "bg-green-600"
        : "bg-red-600"
    }`}
  >
    <svg
      viewBox="0 0 24 24"
      width="12px"
      color="white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {movimentacao.tipo_movimentacao?.toLowerCase() === "entrada" ? (
        <path d="M12 19V5M6 11l6-6 6 6" />
      ) : (
        <path d="M12 5v14M18 13l-6 6-6-6" />
      )}
    </svg>
  </span>
  <span
    className={`text-[12px] font-semibold ${
      movimentacao.tipo_movimentacao?.toLowerCase() === "entrada"
        ? "text-green-600"
        : "text-red-600"
    }`}
  >
    {movimentacao.tipo_movimentacao?.toLowerCase() === "entrada"
      ? "Entrada"
      : "Saída"}
  </span>
</td>
        <td className="text-[12px] ml-2">
          {movimentacao.motivo || "—"}
        </td>

        
        <td className="text-[12px] ml-15">
          {movimentacao.produto?.categoria?.nm_categoria || "—"}
        </td>

        
        <td className="text-[12px] ml-15">
          {movimentacao.quantidade}
        </td>

        
        <td className="flex gap-1 text-[14px] ml-13">
          <h1>R$</h1>
          {movimentacao.vl_movimentacao}
        </td>

        
        <td className="text-[12px] ml-8">
          {movimentacao.responsavel}
        </td>

        
        <td>
          <div className="w-16 h-6 rounded-full bg-green-700 flex items-center justify-center ml-13">
            <span className="text-[10px] text-white font-semibold">
              {movimentacao.status}
            </span>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    
    
  </div>
 
    <div className="w-1/4">

    <div className=" bg-white w-full p-4 mb-3 rounded-[10px]">
      <h1 className="text-[12px] mb-1 font-semibold">
        exemplo
      </h1>
      <div className="w-full p-3 bg-green-300/10 rounded-[10px]">
        <div className="flex gap-2">
          <div className="w-9 h-9 flex items-center justify-center bg-green-400/20 rounded-[50px]">
          <svg width="22" height="22" color="green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-5 10-16Z"/><path d="M4 21c3-5 7-8 12-11"/></svg>
          </div>
          <div>
            <h1 className="text-[12px] mb-1 font-semibold">
              Hortifrúti
            </h1>
            <p className="text-[12px]">
              R$ 2.000,00
            </p>
          </div>
        </div>
        <div className="flex justify-end">
        <div className="w-12 h-6 flex items-center justify-center bg-green-700/30 rounded-[10px]">
          <h1 className="text-[11px] text-green-800">
              +1.2%
          </h1>
        </div>
    </div>
    </div>
    </div>

<div className=" bg-white w-full p-4 mb-3 rounded-[10px]">
      <h1 className="text-[12px] mb-1 font-semibold">
        exemplo
      </h1>
      <div className="w-full p-3 bg-blue-400/10 rounded-[10px]">
        <div className="flex gap-2">
          <div className="w-9 h-9 flex items-center justify-center bg-blue-700/30 rounded-[50px]">
          <svg width="24" height="24" color="blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6"/><path d="M10 2v4l-2 3v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9l-2-3V2"/><path d="M8 10h8"/></svg>
          </div>
          <div>
            <h1 className="text-[12px] mb-1 font-semibold">
              Laticínios
            </h1>
            <p className="text-[12px]">
              R$ 980,00
            </p>
          </div>
        </div>
        <div className="flex justify-end">
        <div className="w-12 h-6 flex items-center justify-center bg-green-700/30 rounded-[10px]">
          <h1 className="text-[11px] text-green-800">
              +3.4%
          </h1>
        </div>
    </div>
    </div>
    </div>

<div className=" bg-white w-full p-4 mb-3 rounded-[10px]">
      <h1 className="text-[12px] mb-2 font-semibold">
        exemplo
      </h1>
      <div className="w-full p-3 bg-red-500/10 rounded-[10px]">
        <div className="flex gap-2">
          <div className="w-9 h-9 flex items-center justify-center bg-red-700/30 rounded-[50px]">
          <svg width="26" height="26" color="red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8c-1.5-2.5-4-4-7-4-4.5 0-8 3-8 7 0 3 2 5 5 5 2 0 3-1 4-2 1-1 2-2 4-2 2 0 3-1 3-4 0-1-.5-2-1-4Z"/><circle cx="9" cy="11" r="2"/></svg>
          </div>
          <div>
            <h1 className="text-[12px] mb-1 font-semibold">
              Carnes
            </h1>
            <p className="text-[12px]">
              R$ 1.450,00
            </p>
          </div>
        </div>
        <div className="flex justify-end">
        <div className="w-12 h-6 flex items-center justify-center bg-red-800/20 rounded-[10px]">
          <h1 className="text-[11px] text-red-600">
              -1.8%
          </h1>
        </div>
    </div>
    </div>
    </div>

    <div className=" bg-white w-full p-4 mb-3 rounded-[10px]">
      <h1 className="text-[12px] mb-2 font-semibold">
        exemplo
      </h1>
      <div className="w-full p-3 bg-purple-500/10 rounded-[10px]">
        <div className="flex gap-2">
          <div className="w-9 h-9 flex items-center justify-center bg-purple-700/30 rounded-[50px]">
          <svg width="22" height="22" color="purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
          </div>
          <div>
            <h1 className="text-[12px] mb-1 font-semibold">
              Mercearia
            </h1>
            <p className="text-[12px]">
              R$ 780,00
            </p>
          </div>
        </div>
        <div className="flex justify-end">
        <div className="w-12 h-6 flex items-center justify-center bg-green-700/30 rounded-[10px]">
          <h1 className="text-[11px] text-green-800">
              +1.2%
          </h1>
        </div>
    </div>
    </div>
    </div>

    </div>

</div>
</div>
    </>
  );
}
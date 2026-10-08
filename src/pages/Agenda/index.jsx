import { HeaderBar, Layout, SideBar } from "../../components";
import ProfileIcon from "../../assets/icons/profile-roxo.svg";

const agendamentos = [
  { hora: "08:00", nome: "Ana Julia", tipo: "Reposição", status: "Confirmado" },
  {
    hora: "10:00",
    nome: "Yuri Alberto",
    tipo: "Reposição",
    status: "Pendente",
  },
  {
    hora: "10:30",
    nome: "Roger Guedes",
    tipo: "Reposição",
    status: "Cancelado",
  },
  { hora: "11:00", disponivel: true },
];

const statusStyle = {
  Confirmado: "bg-green-500/15 text-green-700",
  Pendente: "bg-yellow-300/15 text-yellow-600",
  Cancelado: "bg-red-500/15 text-red-700",
};

export default function Agenda() {
  return (
    <>
      <SideBar />
      <Layout>
        <HeaderBar
          page="Agenda de Logística"
          desc="Agende e organize suas operações"
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center justify-between mt-6 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-base md:text-lg font-semibold text-gray-800">
              Quarta-Feira, 02 de setembro
            </h1>
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold rounded-md bg-green-500/15 text-green-700">
              Hoje
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1 h-9">
              <button className="px-4 h-7 text-xs rounded-md bg-white font-semibold text-gray-800 shadow-sm cursor-pointer">
                Dia
              </button>
              <button className="px-4 h-7 text-xs rounded-md font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
                Semana
              </button>
              <button className="px-4 h-7 text-xs rounded-md font-medium text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
                Mês
              </button>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 h-9 text-xs rounded-xl font-semibold cursor-pointer transition-colors shadow-sm">
              Novo Agendamento
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          {agendamentos.map((item, i) => (
            <div
              key={i}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-5">
                <h1 className="font-semibold text-sm text-gray-800 w-14 shrink-0">
                  {item.hora}
                </h1>

                <div className="w-px h-10 bg-gray-200 shrink-0"></div>

                {item.disponivel ? (
                  <h1 className="font-normal text-sm text-gray-400">
                    Horário disponível
                  </h1>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-purple-400/20 rounded-full flex justify-center items-center shrink-0">
                      <img src={ProfileIcon} alt="Perfil" className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-sm text-gray-800 leading-tight">
                        {item.nome}
                      </h1>
                      <p className="text-gray-400 text-xs leading-tight mt-0.5">
                        {item.tipo}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {!item.disponivel && (
                <div
                  className={`inline-flex items-center justify-center px-3 h-7 rounded-lg text-xs font-semibold shrink-0 ${statusStyle[item.status]}`}
                >
                  {item.status}
                </div>
              )}
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
}

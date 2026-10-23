import Layout from "../../components/Geral/Layout";

export default function EmConstrucao({ titulo = "Em construção" }) {
  return (
    <Layout page={titulo} desc="Esta tela está sendo construída.">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {titulo}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
          Esta tela será entregue em um próximo lote.
        </p>
      </div>
    </Layout>
  );
}

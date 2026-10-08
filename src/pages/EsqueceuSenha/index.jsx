import { useState } from "react";
import { Link } from "react-router-dom";

import EmailIcon from "/icons/mail-roxo.svg";
import { authService } from "../../services/authService";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="bg-[url(/images/bg-login-preto.png)] bg-cover w-screen h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-[#a703e7]/40 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#a703e7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={EmailIcon} alt="E-mail" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            Verifique seu E-mail
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            Enviamos as instruções para redefinir sua senha para o e-mail
            informado.
          </p>
          <Link
            to="/login"
            className="inline-block text-[#dc82ff] text-sm font-medium hover:underline"
          >
            Voltar para o Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url(/images/bg-login-preto.png)] bg-cover w-screen h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-[#a703e7]/40 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Redefinir <span className="text-[#a703e7]">Senha</span>
          <span className="animate-pulse-fast text-[#a703e7]">.</span>
        </h2>
        <p className="text-center text-slate-400 text-sm mb-6">
          Enviaremos um link de redefinição para o seu e-mail.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-white">
              E-mail
            </label>
            <div className="relative flex items-center">
              <img
                src={EmailIcon}
                alt="E-mail"
                className="absolute left-3 w-5 h-5 pointer-events-none"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border border-[#a703e7] rounded-lg text-sm text-white placeholder-slate-400/70 focus:outline-none focus:border-[#c32aff] focus:ring-2 focus:ring-[#b700ff]/20"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-[#a703e7] text-white font-medium text-sm rounded-lg shadow-md hover:bg-[#c83cff] disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-[#dc82ff] hover:underline"
          >
            Lembrou a senha? Faça login
          </Link>
        </div>
      </div>
    </main>
  );
}

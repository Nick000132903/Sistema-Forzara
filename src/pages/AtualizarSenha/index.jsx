import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PasswordIcon from "/icons/lock-roxo.svg";
import CheckIcon from "/icons/check-circle-verde.svg";
import { supabase } from "../../lib/supabaseClient";

export default function AtualizarSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Erro ao atualizar a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="bg-[url(/images/bg-login-preto.png)] bg-cover w-screen h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-[#a703e7]/40 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={CheckIcon} alt="Sucesso" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">
            Senha Atualizada
          </h2>
          <p className="text-slate-300 text-sm">
            Redirecionando para o login...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url(/images/bg-login-preto.png)] bg-cover w-screen h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-[#a703e7]/40 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Definir <span className="text-[#a703e7]">Nova Senha</span>
          <span className="animate-pulse-fast text-[#a703e7]">.</span>
        </h2>
        <p className="text-center text-slate-400 text-sm mb-6">
          Escolha uma nova senha segura para sua conta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-white">
              Nova Senha
            </label>
            <div className="relative flex items-center">
              <img
                src={PasswordIcon}
                alt="Senha"
                className="absolute left-3 w-5 h-5 pointer-events-none"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border border-[#a703e7] rounded-lg text-sm text-white placeholder-slate-400/70 focus:outline-none focus:border-[#c32aff] focus:ring-2 focus:ring-[#b700ff]/20"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm text-white">
              Confirme a Nova Senha
            </label>
            <div className="relative flex items-center">
              <img
                src={PasswordIcon}
                alt="Confirmar Senha"
                className="absolute left-3 w-5 h-5 pointer-events-none"
              />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border border-[#a703e7] rounded-lg text-sm text-white placeholder-slate-400/70 focus:outline-none focus:border-[#c32aff] focus:ring-2 focus:ring-[#b700ff]/20"
                placeholder="Repita a senha"
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
            {isLoading ? "Salvando..." : "Atualizar Senha"}
          </button>
        </form>
      </div>
    </main>
  );
}

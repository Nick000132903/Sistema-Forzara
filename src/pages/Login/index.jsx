import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import EmailIcon from "../../assets/icons/mail-roxo.svg";
import PasswordIcon from "../../assets/icons/lock-roxo.svg";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      window.sessionStorage.setItem(
        "supabase_remember_me",
        rememberMe ? "true" : "false",
      );
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      if (error.message.includes("Invalid login credentials")) {
        setErro("E-mail ou senha incorretos. Tente novamente.");
      } else if (error.message.includes("Email not confirmed")) {
        setErro("E-mail não confirmado. Verifique sua caixa de entrada.");
      } else {
        setErro("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[url(./src/assets/images/bg-login-preto.png)] bg-cover w-screen h-screen flex items-center pl-30">
      <section className="p-8 sm:p-10 flex flex-col items-start w-full">
        {erro && (
          <div className="w-full max-w-xs mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {erro}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs flex flex-col items-center gap-4"
        >
          <h2 className="text-4xl font-bold mb-2 text-white">
            Faça Seu{" "}
            <span className="text-[#a703e7]">
              Login<span className="animate-pulse-fast">.</span>
            </span>
          </h2>
          <div className="w-full flex flex-col gap-3 text-white">
            <div className="flex flex-col gap-1">
              <label htmlFor="idPessoal" className="text-sm">
                E-mail
              </label>
              <div className="relative flex items-center">
                <img
                  src={EmailIcon}
                  alt="E-mail"
                  className="absolute left-3 w-5 h-5 pointer-events-none"
                />
                <input
                  className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border border-[#a703e7] rounded-lg text-sm placeholder-slate-400/70 focus:outline-none focus:border-[#c32aff] focus:ring-2 focus:ring-[#b700ff]/20"
                  type="email"
                  id="idPessoal"
                  placeholder="Seu e-mail cadastrado"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="psw" className="text-sm">
                Senha
              </label>
              <div className="relative flex items-center">
                <img
                  src={PasswordIcon}
                  alt="Senha"
                  className="absolute left-3 w-5 h-5 pointer-events-none"
                />
                <input
                  className="w-full pl-10 pr-3.5 py-2.5 bg-transparent border border-[#a703e7] rounded-lg text-sm placeholder-slate-400/70 focus:outline-none focus:border-[#c32aff] focus:ring-2 focus:ring-[#b700ff]/20"
                  type="password"
                  id="psw"
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-between text-[10px] mt-1 gap-4">
            <label className="text-sm flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#b700ff] rounded border-slate-300 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Lembrar senha
            </label>
            <Link
              to="/esqueceu-senha"
              className="text-[#dc82ff] text-sm font-medium hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <button
            className="w-full mt-2 px-4 py-2.5 bg-[#a703e7] text-white font-medium text-sm rounded-lg shadow-md hover:bg-[#c83cff] disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

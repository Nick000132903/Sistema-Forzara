import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Agenda from "../pages/Agenda";
import AtualizarSenha from "../pages/AtualizarSenha";
import Configuracoes from "../pages/Configuracoes";
import Dashboard from "../pages/Dashboard";
import EsqueceuSenha from "../pages/EsqueceuSenha";
import Estoque from "../pages/Estoque";
import Fornecedores from "../pages/Fornecedores";
import Login from "../pages/Login";
import Movimentacoes from "../pages/Movimentacoes";
import Relatorios from "../pages/Relatorios";

const Aprovacoes = lazy(() => import("../pages/Aprovacoes"));
const CMVDetalhado = lazy(() => import("../pages/CMVDetalhado"));

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

const protect = (element) => <PrivateRoute>{element}</PrivateRoute>;

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/" element={protect(<Dashboard />)} />
        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/estoque" element={protect(<Estoque />)} />
        <Route path="/fornecedores" element={protect(<Fornecedores />)} />
        <Route path="/movimentacoes" element={protect(<Movimentacoes />)} />
        <Route path="/relatorios" element={protect(<Relatorios />)} />
        <Route path="/agenda" element={protect(<Agenda />)} />
        <Route path="/configuracoes" element={protect(<Configuracoes />)} />

        <Route path="/aprovacoes" element={protect(<Aprovacoes />)} />
        <Route path="/cmv" element={protect(<CMVDetalhado />)} />

        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
        <Route path="/atualizar-senha" element={<AtualizarSenha />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

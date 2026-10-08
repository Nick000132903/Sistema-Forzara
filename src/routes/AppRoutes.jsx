import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Configuracoes from "../pages/Configuracoes";
import Dashboard from "../pages/Dashboard";
import Estoque from "../pages/Estoque";
import Fornecedores from "../pages/Fornecedores";
import Login from "../pages/Login";
import Movimentacoes from "../pages/Movimentacoes";
import Relatorios from "../pages/Relatorios";
import Agenda from "../pages/Agenda";
import EsqueceuSenha from "../pages/EsqueceuSenha";
import AtualizarSenha from "../pages/AtualizarSenha";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <PrivateRoute>
            <Estoque />
          </PrivateRoute>
        }
      />
      <Route
        path="/fornecedores"
        element={
          <PrivateRoute>
            <Fornecedores />
          </PrivateRoute>
        }
      />
      <Route
        path="/movimentacoes"
        element={
          <PrivateRoute>
            <Movimentacoes />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <PrivateRoute>
            <Agenda />
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Configuracoes />
          </PrivateRoute>
        }
      />
      <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
      <Route path="/atualizar-senha" element={<AtualizarSenha />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

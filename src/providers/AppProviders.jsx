import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { EmpresaProvider } from "../contexts/EmpresaContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SidebarProvider } from "../contexts/SidebarContext";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <EmpresaProvider>{children}</EmpresaProvider>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

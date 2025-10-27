import { Link, NavLink, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/Auth/LoginPage";
import { ProfilePage } from "./pages/Collaborator/ProfilePage";
import { EditProfilePage } from "./pages/Collaborator/EditProfilePage";
import { ProjectListPage } from "./pages/Projects/ProjectListPage";
import { MyApplicationsPage } from "./pages/Applications/MyApplicationsPage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export default function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p>Carregando autenticacao...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const displayName = user?.full_name || user?.email;

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Colab Connect
        </Link>
        <nav className="app-nav">
          <NavLink to="/" className={navLinkClass} end>
            Meu perfil
          </NavLink>
          <NavLink to="/edit" className={navLinkClass}>
            Editar perfil
          </NavLink>
          <NavLink to="/projects" className={navLinkClass}>
            Projetos
          </NavLink>
          <NavLink to="/applications" className={navLinkClass}>
            Minhas candidaturas
          </NavLink>
        </nav>
        <div className="auth-status">
          <span className="auth-identity">{displayName}</span>
          <button type="button" className="logout-button" onClick={logout}>
            Sair
          </button>
        </div>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/edit" element={<EditProfilePage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/applications" element={<MyApplicationsPage />} />
        </Routes>
      </main>
    </div>
  );
}

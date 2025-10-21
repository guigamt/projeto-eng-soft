import { Link, NavLink, Route, Routes } from "react-router-dom";

import { ProfilePage } from "./pages/Collaborator/ProfilePage";
import { EditProfilePage } from "./pages/Collaborator/EditProfilePage";
import { ProjectListPage } from "./pages/Projects/ProjectListPage";
import { MyApplicationsPage } from "./pages/Applications/MyApplicationsPage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export default function App() {
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


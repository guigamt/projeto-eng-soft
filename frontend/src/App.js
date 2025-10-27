import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/Auth/LoginPage";
import { ProfilePage } from "./pages/Collaborator/ProfilePage";
import { EditProfilePage } from "./pages/Collaborator/EditProfilePage";
import { ProjectListPage } from "./pages/Projects/ProjectListPage";
import { MyApplicationsPage } from "./pages/Applications/MyApplicationsPage";
const navLinkClass = ({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link";
export default function App() {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "loading-screen", children: _jsx("p", { children: "Carregando autenticacao..." }) }));
    }
    if (!isAuthenticated) {
        return _jsx(LoginPage, {});
    }
    const displayName = user?.full_name || user?.email;
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsx(Link, { to: "/", className: "brand", children: "Colab Connect" }), _jsxs("nav", { className: "app-nav", children: [_jsx(NavLink, { to: "/", className: navLinkClass, end: true, children: "Meu perfil" }), _jsx(NavLink, { to: "/edit", className: navLinkClass, children: "Editar perfil" }), _jsx(NavLink, { to: "/projects", className: navLinkClass, children: "Projetos" }), _jsx(NavLink, { to: "/applications", className: navLinkClass, children: "Minhas candidaturas" })] }), _jsxs("div", { className: "auth-status", children: [_jsx("span", { className: "auth-identity", children: displayName }), _jsx("button", { type: "button", className: "logout-button", onClick: logout, children: "Sair" })] })] }), _jsx("main", { className: "app-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/edit", element: _jsx(EditProfilePage, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectListPage, {}) }), _jsx(Route, { path: "/applications", element: _jsx(MyApplicationsPage, {}) })] }) })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { ProfilePage } from "./pages/Collaborator/ProfilePage";
import { EditProfilePage } from "./pages/Collaborator/EditProfilePage";
import { ProjectListPage } from "./pages/Projects/ProjectListPage";
import { MyApplicationsPage } from "./pages/Applications/MyApplicationsPage";
const navLinkClass = ({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link";
export default function App() {
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsx(Link, { to: "/", className: "brand", children: "Colab Connect" }), _jsxs("nav", { className: "app-nav", children: [_jsx(NavLink, { to: "/", className: navLinkClass, end: true, children: "Meu perfil" }), _jsx(NavLink, { to: "/edit", className: navLinkClass, children: "Editar perfil" }), _jsx(NavLink, { to: "/projects", className: navLinkClass, children: "Projetos" }), _jsx(NavLink, { to: "/applications", className: navLinkClass, children: "Minhas candidaturas" })] })] }), _jsx("main", { className: "app-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/edit", element: _jsx(EditProfilePage, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectListPage, {}) }), _jsx(Route, { path: "/applications", element: _jsx(MyApplicationsPage, {}) })] }) })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../../api/applications";
const statusLabels = {
    SUBMITTED: "Enviada",
    REVIEWING: "Em analise",
    ACCEPTED: "Aceita",
    DECLINED: "Recusada",
    WITHDRAWN: "Retirada"
};
export function MyApplicationsPage() {
    const applicationsQuery = useQuery({
        queryKey: ["applications", "me"],
        queryFn: applicationsApi.listMine
    });
    if (applicationsQuery.isLoading) {
        return _jsx("p", { children: "Carregando candidaturas..." });
    }
    if (applicationsQuery.isError) {
        return _jsx("p", { children: "Ocorreu um erro ao carregar suas candidaturas." });
    }
    const applications = applicationsQuery.data ?? [];
    return (_jsxs("section", { className: "applications-page", children: [_jsx("h1", { children: "Minhas candidaturas" }), _jsx("p", { children: "Acompanhe o status das candidaturas enviadas." }), _jsxs("ul", { className: "applications-list", children: [applications.map((application) => (_jsxs("li", { className: "application-card", children: [_jsxs("p", { children: [_jsx("strong", { children: "Projeto:" }), " #", application.project_id] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", statusLabels[application.status]] }), _jsxs("p", { children: [_jsx("strong", { children: "Enviado em:" }), " ", new Date(application.created_at).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Pitch:" }), " ", application.pitch] })] }, application.id))), applications.length === 0 && (_jsx("li", { children: "Envie uma candidatura para que ela apareca aqui." }))] })] }));
}

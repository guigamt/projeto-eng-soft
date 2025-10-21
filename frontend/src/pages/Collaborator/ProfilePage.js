import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { collaboratorApi } from "../../api/collaborator";
export function ProfilePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["collaborator", "profile"],
        queryFn: collaboratorApi.get,
        retry: (failureCount, err) => {
            const status = err?.response?.status;
            if (status === 404) {
                return false;
            }
            return failureCount < 2;
        }
    });
    if (isLoading) {
        return _jsx("p", { children: "Carregando perfil..." });
    }
    if (error && error?.response?.status === 404) {
        return (_jsxs("div", { className: "empty-state", children: [_jsx("h2", { children: "Vamos criar seu perfil?" }), _jsx("p", { children: "Ainda nao encontramos informacoes do seu perfil. Clique abaixo para iniciar." }), _jsx(Link, { to: "/edit", className: "button", children: "Criar perfil" })] }));
    }
    if (!data) {
        return _jsx("p", { children: "Ocorreu um erro ao carregar seu perfil." });
    }
    return (_jsxs("section", { className: "profile-page", children: [_jsxs("header", { children: [_jsx("h1", { children: data.headline ?? "Colaborador sem headline" }), _jsx("p", { children: data.bio ?? "Atualize sua bio para destacar seus diferenciais." })] }), _jsxs("section", { children: [_jsx("h2", { children: "Resumo" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Cidade:" }), " ", data.location_city ? `${data.location_city}/${data.location_state}` : "Nao informada"] }), _jsxs("li", { children: [_jsx("strong", { children: "Disponibilidade:" }), " ", data.availability_hours_per_week
                                        ? `${data.availability_hours_per_week} horas por semana`
                                        : "Nao informada"] }), _jsxs("li", { children: [_jsx("strong", { children: "Modelo de trabalho:" }), " ", data.work_mode ?? "Nao informado"] })] })] }), _jsxs("section", { children: [_jsx("h2", { children: "Habilidades" }), _jsxs("ul", { children: [data.skills.map((skill) => (_jsxs("li", { children: [skill.name, " - nivel ", skill.level] }, skill.id))), data.skills.length === 0 && _jsx("li", { children: "Nenhuma habilidade cadastrada." })] })] }), _jsxs("section", { children: [_jsx("h2", { children: "Areas de interesse" }), _jsxs("ul", { children: [data.interests.map((interest) => (_jsx("li", { children: interest.label }, interest.id))), data.interests.length === 0 && _jsx("li", { children: "Nenhum interesse cadastrado." })] })] }), _jsxs("section", { children: [_jsx("h2", { children: "Portifolio" }), _jsxs("ul", { children: [data.portfolio_items.map((item) => (_jsxs("li", { children: [_jsx("a", { href: item.url, target: "_blank", rel: "noreferrer", children: item.title }), item.description && _jsx("p", { children: item.description })] }, item.id))), data.portfolio_items.length === 0 && (_jsx("li", { children: "Adicione links para seus trabalhos mais recentes." }))] })] })] }));
}

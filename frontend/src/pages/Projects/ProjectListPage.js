import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../../api/applications";
import { projectsApi } from "../../api/projects";
export function ProjectListPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [pitch, setPitch] = useState("");
    const projectsQuery = useQuery({
        queryKey: ["projects"],
        queryFn: projectsApi.list
    });
    const applicationMutation = useMutation({
        mutationFn: (payload) => applicationsApi.create({
            project_id: payload.projectId,
            pitch: payload.pitch
        }),
        onSuccess: () => {
            setSelectedProject(null);
            setPitch("");
            queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
        }
    });
    const filteredProjects = useMemo(() => {
        if (!projectsQuery.data) {
            return [];
        }
        return projectsQuery.data.filter((project) => {
            const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                project.headline.toLowerCase().includes(search.toLowerCase());
            const matchesTag = selectedTag
                ? project.tags.includes(selectedTag)
                : true;
            return matchesSearch && matchesTag;
        });
    }, [projectsQuery.data, search, selectedTag]);
    if (projectsQuery.isLoading) {
        return _jsx("p", { children: "Carregando projetos..." });
    }
    if (projectsQuery.isError) {
        return _jsx("p", { children: "Ocorreu um erro ao carregar projetos." });
    }
    return (_jsxs("section", { className: "projects-page", children: [_jsxs("header", { children: [_jsx("h1", { children: "Projetos disponiveis" }), _jsx("p", { children: "Explore ideias que combinam com seus interesses e habilidades." })] }), _jsxs("div", { className: "filters", children: [_jsx("input", { placeholder: "Buscar por nome ou headline", value: search, onChange: (event) => setSearch(event.target.value) }), _jsxs("select", { value: selectedTag, onChange: (event) => setSelectedTag(event.target.value), children: [_jsx("option", { value: "", children: "Todas as tags" }), Array.from(new Set(projectsQuery.data?.flatMap((project) => project.tags) ?? [])).map((tag) => (_jsx("option", { value: tag, children: tag }, tag)))] })] }), _jsx("ul", { className: "project-list", children: filteredProjects.map((project) => (_jsxs("li", { className: "project-card", children: [_jsxs("header", { children: [_jsx("h2", { children: project.name }), _jsx("p", { children: project.headline })] }), _jsx("p", { children: project.description }), _jsxs("p", { children: [_jsx("strong", { children: "Responsavel:" }), " ", project.owner] }), _jsxs("p", { children: [_jsx("strong", { children: "Slots abertos:" }), " ", project.slots] }), _jsxs("p", { children: [_jsx("strong", { children: "Modelo:" }), " ", project.remote ? "Remoto" : "Local", project.location && ` - ${project.location}`] }), _jsx("div", { className: "tags", children: project.tags.map((tag) => (_jsx("span", { className: "tag", children: tag }, tag))) }), _jsx("button", { type: "button", onClick: () => setSelectedProject(project), children: "Candidatar-se" })] }, project.id))) }), filteredProjects.length === 0 && (_jsx("p", { children: "Nenhum projeto corresponde aos filtros selecionados." })), selectedProject && (_jsx("div", { className: "application-modal", children: _jsxs("div", { className: "modal-content", children: [_jsxs("h2", { children: ["Candidatura para ", selectedProject.name] }), _jsxs("form", { onSubmit: (event) => {
                                event.preventDefault();
                                if (!pitch.trim()) {
                                    return;
                                }
                                applicationMutation.mutate({
                                    projectId: selectedProject.id,
                                    pitch
                                });
                            }, children: [_jsx("textarea", { rows: 5, placeholder: "Escreva seu pitch com motivacoes, experiencias e disponibilidade.", value: pitch, onChange: (event) => setPitch(event.target.value) }), _jsxs("div", { className: "modal-actions", children: [_jsx("button", { type: "submit", disabled: applicationMutation.isPending, children: applicationMutation.isPending
                                                ? "Enviando..."
                                                : "Enviar pitch" }), _jsx("button", { type: "button", onClick: () => setSelectedProject(null), children: "Cancelar" })] })] })] }) }))] }));
}

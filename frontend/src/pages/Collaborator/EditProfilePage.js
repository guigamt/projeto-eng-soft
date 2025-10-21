import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../../api/applications";
import { collaboratorApi } from "../../api/collaborator";
import { ProfileForm } from "../../components/ProfileForm";
import { SkillSelector } from "../../components/SkillSelector";
import { TagSelector } from "../../components/TagSelector";
export function EditProfilePage() {
    const queryClient = useQueryClient();
    const [applicationPitch, setApplicationPitch] = useState("");
    const [applicationProjectId, setApplicationProjectId] = useState(1);
    const [portfolioForm, setPortfolioForm] = useState({
        title: "",
        url: "",
        description: ""
    });
    const profileQuery = useQuery({
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
    const upsertProfileMutation = useMutation({
        mutationFn: async (payload) => {
            if (profileQuery.data) {
                return collaboratorApi.update(payload);
            }
            return collaboratorApi.create(payload);
        },
        onSuccess: (profile) => {
            queryClient.setQueryData(["collaborator", "profile"], profile);
        }
    });
    const addSkillMutation = useMutation({
        mutationFn: ({ name, level }) => collaboratorApi.addSkill({ name, level }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const removeSkillMutation = useMutation({
        mutationFn: (id) => collaboratorApi.removeSkill(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const addInterestMutation = useMutation({
        mutationFn: ({ slug, label }) => collaboratorApi.addInterest({ slug, label }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const removeInterestMutation = useMutation({
        mutationFn: (id) => collaboratorApi.removeInterest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const addPortfolioMutation = useMutation({
        mutationFn: (payload) => collaboratorApi.addPortfolioItem(payload),
        onSuccess: () => {
            setPortfolioForm({ title: "", url: "", description: "" });
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const removePortfolioMutation = useMutation({
        mutationFn: (id) => collaboratorApi.removePortfolioItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
        }
    });
    const createApplicationMutation = useMutation({
        mutationFn: () => applicationsApi.create({
            project_id: applicationProjectId,
            pitch: applicationPitch
        }),
        onSuccess: () => {
            setApplicationPitch("");
            queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
        }
    });
    const loadingProfile = profileQuery.isLoading && !profileQuery.error;
    const profileNotFound = profileQuery.error && profileQuery.error?.response?.status === 404;
    const hasProfile = Boolean(profileQuery.data);
    const handlePortfolioSubmit = (event) => {
        event.preventDefault();
        if (!portfolioForm.title || !portfolioForm.url) {
            return;
        }
        addPortfolioMutation.mutate(portfolioForm);
    };
    const handleApplicationSubmit = (event) => {
        event.preventDefault();
        if (!applicationPitch.trim() || !hasProfile) {
            return;
        }
        createApplicationMutation.mutate();
    };
    return (_jsxs("section", { className: "edit-profile-page", children: [_jsxs("header", { children: [_jsx("h1", { children: profileNotFound ? "Crie seu perfil" : "Edite seu perfil" }), _jsx("p", { children: "Centralize suas informacoes de colaborador. Use os campos abaixo para manter dados atualizados." })] }), _jsx(ProfileForm, { initialValues: profileQuery.data, onSubmit: async (values) => {
                    await upsertProfileMutation.mutateAsync(values);
                }, submitLabel: profileQuery.data ? "Atualizar perfil" : "Criar perfil", isSaving: upsertProfileMutation.isPending }), !loadingProfile && hasProfile && (_jsxs(_Fragment, { children: [_jsx(SkillSelector, { skills: profileQuery.data?.skills ?? [], onAdd: async (name, level) => {
                            await addSkillMutation.mutateAsync({ name, level });
                        }, onRemove: async (id) => {
                            await removeSkillMutation.mutateAsync(id);
                        }, isLoading: addSkillMutation.isPending || removeSkillMutation.isPending }), _jsx(TagSelector, { interests: profileQuery.data?.interests ?? [], onAdd: async (slug, label) => {
                            await addInterestMutation.mutateAsync({ slug, label });
                        }, onRemove: async (id) => {
                            await removeInterestMutation.mutateAsync(id);
                        } }), _jsxs("section", { className: "portfolio-section", children: [_jsx("h3", { children: "Portifolio" }), _jsxs("form", { onSubmit: handlePortfolioSubmit, className: "portfolio-form", children: [_jsx("input", { placeholder: "Titulo", value: portfolioForm.title, onChange: (event) => setPortfolioForm((prev) => ({
                                            ...prev,
                                            title: event.target.value
                                        })) }), _jsx("input", { placeholder: "URL", value: portfolioForm.url, onChange: (event) => setPortfolioForm((prev) => ({
                                            ...prev,
                                            url: event.target.value
                                        })) }), _jsx("textarea", { placeholder: "Descricao", value: portfolioForm.description ?? "", onChange: (event) => setPortfolioForm((prev) => ({
                                            ...prev,
                                            description: event.target.value
                                        })) }), _jsx("button", { type: "submit", disabled: addPortfolioMutation.isPending, children: addPortfolioMutation.isPending
                                            ? "Adicionando..."
                                            : "Adicionar item" })] }), _jsxs("ul", { children: [profileQuery.data?.portfolio_items?.map((item) => (_jsxs("li", { children: [_jsx("a", { href: item.url, target: "_blank", rel: "noreferrer", children: item.title }), _jsx("button", { type: "button", onClick: () => removePortfolioMutation.mutate(item.id), children: "Remover" })] }, item.id))), (profileQuery.data?.portfolio_items?.length ?? 0) === 0 && (_jsx("li", { children: "Nenhum projeto cadastrado ainda." }))] })] })] })), _jsxs("section", { className: "application-form", children: [_jsx("h3", { children: "Enviar candidatura rapida" }), _jsxs("form", { onSubmit: handleApplicationSubmit, children: [_jsxs("label", { children: ["Projeto ID", _jsx("input", { type: "number", min: 1, value: applicationProjectId, onChange: (event) => setApplicationProjectId(Number(event.target.value)) })] }), _jsxs("label", { children: ["Pitch", _jsx("textarea", { rows: 4, value: applicationPitch, onChange: (event) => setApplicationPitch(event.target.value) })] }), _jsx("button", { type: "submit", disabled: createApplicationMutation.isPending || !hasProfile, children: createApplicationMutation.isPending
                                    ? "Enviando..."
                                    : "Enviar candidatura" })] }), !hasProfile && (_jsx("p", { children: "Crie seu perfil para liberar candidaturas. As informacoes do pitch ficam salvas para quando voce criar o perfil." }))] })] }));
}

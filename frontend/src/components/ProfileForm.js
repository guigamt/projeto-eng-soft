import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { WorkMode } from "../types/enums";
const workModeOptions = [
    { value: WorkMode.REMOTE, label: "Remoto" },
    { value: WorkMode.HYBRID, label: "Hibrido" },
    { value: WorkMode.ONSITE, label: "Presencial" }
];
export function ProfileForm({ initialValues, onSubmit, submitLabel = "Salvar", isSaving }) {
    const [formState, setFormState] = useState({
        headline: initialValues?.headline ?? "",
        bio: initialValues?.bio ?? "",
        location_city: initialValues?.location_city ?? "",
        location_state: initialValues?.location_state ?? "",
        availability_hours_per_week: initialValues?.availability_hours_per_week ?? undefined,
        work_mode: initialValues?.work_mode ?? undefined
    });
    const handleChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: field === "availability_hours_per_week"
                ? Number(value) || undefined
                : value
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSubmit(formState);
    };
    return (_jsxs("form", { className: "profile-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "headline", children: "Headline" }), _jsx("input", { id: "headline", name: "headline", value: formState.headline ?? "", onChange: (event) => handleChange("headline", event.target.value), placeholder: "Produto, IA, UX..." })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "bio", children: "Bio" }), _jsx("textarea", { id: "bio", name: "bio", rows: 4, value: formState.bio ?? "", onChange: (event) => handleChange("bio", event.target.value), placeholder: "Conte sua jornada em algumas linhas." })] }), _jsxs("div", { className: "field-grid", children: [_jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "location_city", children: "Cidade" }), _jsx("input", { id: "location_city", name: "location_city", value: formState.location_city ?? "", onChange: (event) => handleChange("location_city", event.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "location_state", children: "Estado" }), _jsx("input", { id: "location_state", name: "location_state", maxLength: 2, value: formState.location_state ?? "", onChange: (event) => handleChange("location_state", event.target.value.toUpperCase()) })] })] }), _jsxs("div", { className: "field-grid", children: [_jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "availability_hours_per_week", children: "Disponibilidade (h/semana)" }), _jsx("input", { id: "availability_hours_per_week", type: "number", min: 0, max: 168, value: formState.availability_hours_per_week ?? "", onChange: (event) => handleChange("availability_hours_per_week", event.target.value) })] }), _jsxs("div", { className: "field", children: [_jsx("label", { htmlFor: "work_mode", children: "Modelo de trabalho" }), _jsxs("select", { id: "work_mode", value: formState.work_mode ?? "", onChange: (event) => handleChange("work_mode", event.target.value), children: [_jsx("option", { value: "", children: "Selecione" }), workModeOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] })] })] }), _jsx("button", { type: "submit", disabled: isSaving, children: isSaving ? "Salvando..." : submitLabel })] }));
}

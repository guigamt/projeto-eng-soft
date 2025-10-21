import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
const defaultTags = [
    { slug: "ia", label: "Inteligencia Artificial" },
    { slug: "backend", label: "Backend" },
    { slug: "frontend", label: "Frontend" },
    { slug: "educacao", label: "Educacao" },
    { slug: "mobile", label: "Mobile" },
    { slug: "ux", label: "UX / UI" },
    { slug: "psicologia", label: "Psicologia" },
    { slug: "datascience", label: "Data Science" },
    { slug: "sustentabilidade", label: "Sustentabilidade" }
];
export function TagSelector({ interests, onAdd, onRemove }) {
    const [selectedTag, setSelectedTag] = useState("ia");
    const remainingTags = useMemo(() => {
        const currentSlugs = new Set(interests.map((interest) => interest.slug));
        return defaultTags.filter((tag) => !currentSlugs.has(tag.slug));
    }, [interests]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const tagInfo = defaultTags.find((tag) => tag.slug === selectedTag) ?? defaultTags[0];
        await onAdd(tagInfo.slug, tagInfo.label);
    };
    return (_jsxs("section", { className: "tag-selector", children: [_jsx("h3", { children: "Areas de interesse" }), _jsxs("form", { onSubmit: handleSubmit, className: "tag-form", children: [_jsxs("select", { value: selectedTag, onChange: (event) => setSelectedTag(event.target.value), children: [remainingTags.map((tag) => (_jsx("option", { value: tag.slug, children: tag.label }, tag.slug))), remainingTags.length === 0 && (_jsx("option", { value: "", children: "Todas as tags ja foram adicionadas" }))] }), _jsx("button", { type: "submit", disabled: remainingTags.length === 0, children: "Adicionar" })] }), _jsxs("ul", { className: "tag-list", children: [interests.map((interest) => (_jsxs("li", { children: [interest.label, _jsx("button", { type: "button", onClick: () => onRemove(interest.id), children: "Remover" })] }, interest.id))), interests.length === 0 && _jsx("li", { children: "Nenhum interesse cadastrado." })] })] }));
}

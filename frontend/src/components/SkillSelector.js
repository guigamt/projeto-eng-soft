import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function SkillSelector({ skills, onAdd, onRemove, isLoading }) {
    const [name, setName] = useState("");
    const [level, setLevel] = useState(3);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            return;
        }
        await onAdd(name.trim(), level);
        setName("");
        setLevel(3);
    };
    return (_jsxs("section", { className: "skill-selector", children: [_jsx("h3", { children: "Habilidades" }), _jsxs("form", { onSubmit: handleSubmit, className: "skill-form", children: [_jsx("input", { value: name, onChange: (event) => setName(event.target.value), placeholder: "Nome da habilidade" }), _jsx("input", { type: "number", min: 1, max: 5, value: level, onChange: (event) => setLevel(Number(event.target.value)) }), _jsx("button", { type: "submit", disabled: isLoading, children: isLoading ? "Adicionando..." : "Adicionar" })] }), _jsxs("ul", { className: "skill-list", children: [skills.map((skill) => (_jsxs("li", { className: "skill-item", children: [_jsxs("span", { children: [skill.name, " (N\u00EDvel ", skill.level, ")"] }), _jsx("button", { type: "button", onClick: () => onRemove(skill.id), disabled: isLoading, children: "Remover" })] }, skill.id))), skills.length === 0 && _jsx("li", { children: "Nenhuma habilidade cadastrada ainda." })] })] }));
}

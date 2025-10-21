import { FormEvent, useState } from "react";

import { Skill } from "../types/collaborator";

type SkillSelectorProps = {
  skills: Skill[];
  onAdd: (name: string, level: number) => Promise<void> | void;
  onRemove: (id: number) => Promise<void> | void;
  isLoading?: boolean;
};

export function SkillSelector({
  skills,
  onAdd,
  onRemove,
  isLoading
}: SkillSelectorProps) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(3);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    await onAdd(name.trim(), level);
    setName("");
    setLevel(3);
  };

  return (
    <section className="skill-selector">
      <h3>Habilidades</h3>
      <form onSubmit={handleSubmit} className="skill-form">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome da habilidade"
        />
        <input
          type="number"
          min={1}
          max={5}
          value={level}
          onChange={(event) => setLevel(Number(event.target.value))}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adicionando..." : "Adicionar"}
        </button>
      </form>

      <ul className="skill-list">
        {skills.map((skill) => (
          <li key={skill.id} className="skill-item">
            <span>
              {skill.name} (Nível {skill.level})
            </span>
            <button
              type="button"
              onClick={() => onRemove(skill.id)}
              disabled={isLoading}
            >
              Remover
            </button>
          </li>
        ))}
        {skills.length === 0 && <li>Nenhuma habilidade cadastrada ainda.</li>}
      </ul>
    </section>
  );
}


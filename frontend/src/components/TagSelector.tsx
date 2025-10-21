import { FormEvent, useMemo, useState } from "react";

import { Interest } from "../types/collaborator";
import { ProjectTag } from "../types/project";

type TagSelectorProps = {
  interests: Interest[];
  onAdd: (slug: ProjectTag, label: string) => Promise<void> | void;
  onRemove: (id: number) => Promise<void> | void;
};

const defaultTags: { slug: ProjectTag; label: string }[] = [
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

export function TagSelector({ interests, onAdd, onRemove }: TagSelectorProps) {
  const [selectedTag, setSelectedTag] = useState<ProjectTag>("ia");

  const remainingTags = useMemo(() => {
    const currentSlugs = new Set(interests.map((interest) => interest.slug));
    return defaultTags.filter((tag) => !currentSlugs.has(tag.slug));
  }, [interests]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tagInfo =
      defaultTags.find((tag) => tag.slug === selectedTag) ?? defaultTags[0];
    await onAdd(tagInfo.slug, tagInfo.label);
  };

  return (
    <section className="tag-selector">
      <h3>Areas de interesse</h3>
      <form onSubmit={handleSubmit} className="tag-form">
        <select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value as ProjectTag)}
        >
          {remainingTags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.label}
            </option>
          ))}
          {remainingTags.length === 0 && (
            <option value="">Todas as tags ja foram adicionadas</option>
          )}
        </select>
        <button type="submit" disabled={remainingTags.length === 0}>
          Adicionar
        </button>
      </form>
      <ul className="tag-list">
        {interests.map((interest) => (
          <li key={interest.id}>
            {interest.label}
            <button type="button" onClick={() => onRemove(interest.id)}>
              Remover
            </button>
          </li>
        ))}
        {interests.length === 0 && <li>Nenhum interesse cadastrado.</li>}
      </ul>
    </section>
  );
}


import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { applicationsApi } from "../../api/applications";
import { projectsApi } from "../../api/projects";
import { Project } from "../../types/project";

export function ProjectListPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pitch, setPitch] = useState("");

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.list
  });

  const applicationMutation = useMutation({
    mutationFn: (payload: { projectId: number; pitch: string }) =>
      applicationsApi.create({
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
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.headline.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag
        ? project.tags.includes(selectedTag as any)
        : true;
      return matchesSearch && matchesTag;
    });
  }, [projectsQuery.data, search, selectedTag]);

  if (projectsQuery.isLoading) {
    return <p>Carregando projetos...</p>;
  }

  if (projectsQuery.isError) {
    return <p>Ocorreu um erro ao carregar projetos.</p>;
  }

  return (
    <section className="projects-page">
      <header>
        <h1>Projetos disponiveis</h1>
        <p>Explore ideias que combinam com seus interesses e habilidades.</p>
      </header>

      <div className="filters">
        <input
          placeholder="Buscar por nome ou headline"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value)}
        >
          <option value="">Todas as tags</option>
          {Array.from(
            new Set(projectsQuery.data?.flatMap((project) => project.tags) ?? [])
          ).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <ul className="project-list">
        {filteredProjects.map((project) => (
          <li key={project.id} className="project-card">
            <header>
              <h2>{project.name}</h2>
              <p>{project.headline}</p>
            </header>
            <p>{project.description}</p>
            <p>
              <strong>Responsavel:</strong> {project.owner}
            </p>
            <p>
              <strong>Slots abertos:</strong> {project.slots}
            </p>
            <p>
              <strong>Modelo:</strong> {project.remote ? "Remoto" : "Local"}
              {project.location && ` - ${project.location}`}
            </p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelectedProject(project)}
            >
              Candidatar-se
            </button>
          </li>
        ))}
      </ul>

      {filteredProjects.length === 0 && (
        <p>Nenhum projeto corresponde aos filtros selecionados.</p>
      )}

      {selectedProject && (
        <div className="application-modal">
          <div className="modal-content">
            <h2>Candidatura para {selectedProject.name}</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!pitch.trim()) {
                  return;
                }
                applicationMutation.mutate({
                  projectId: selectedProject.id,
                  pitch
                });
              }}
            >
              <textarea
                rows={5}
                placeholder="Escreva seu pitch com motivacoes, experiencias e disponibilidade."
                value={pitch}
                onChange={(event) => setPitch(event.target.value)}
              />
              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={applicationMutation.isPending}
                >
                  {applicationMutation.isPending
                    ? "Enviando..."
                    : "Enviar pitch"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


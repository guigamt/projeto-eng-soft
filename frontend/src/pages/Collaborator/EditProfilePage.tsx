import { FormEvent, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { applicationsApi } from "../../api/applications";
import { collaboratorApi } from "../../api/collaborator";
import { ProfileForm } from "../../components/ProfileForm";
import { SkillSelector } from "../../components/SkillSelector";
import { TagSelector } from "../../components/TagSelector";
import {
  CollaboratorPayload,
  PortfolioPayload
} from "../../types/collaborator";
import { ProjectTag } from "../../types/project";

export function EditProfilePage() {
  const queryClient = useQueryClient();
  const [applicationPitch, setApplicationPitch] = useState("");
  const [applicationProjectId, setApplicationProjectId] = useState(1);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioPayload>({
    title: "",
    url: "",
    description: ""
  });

  const profileQuery = useQuery({
    queryKey: ["collaborator", "profile"],
    queryFn: collaboratorApi.get,
    retry: (failureCount, err: unknown) => {
      const status = (err as any)?.response?.status;
      if (status === 404) {
        return false;
      }
      return failureCount < 2;
    }
  });

  const upsertProfileMutation = useMutation({
    mutationFn: async (payload: CollaboratorPayload) => {
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
    mutationFn: ({ name, level }: { name: string; level: number }) =>
      collaboratorApi.addSkill({ name, level }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const removeSkillMutation = useMutation({
    mutationFn: (id: number) => collaboratorApi.removeSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const addInterestMutation = useMutation({
    mutationFn: ({ slug, label }: { slug: ProjectTag; label: string }) =>
      collaboratorApi.addInterest({ slug, label }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const removeInterestMutation = useMutation({
    mutationFn: (id: number) => collaboratorApi.removeInterest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const addPortfolioMutation = useMutation({
    mutationFn: (payload: PortfolioPayload) =>
      collaboratorApi.addPortfolioItem(payload),
    onSuccess: () => {
      setPortfolioForm({ title: "", url: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const removePortfolioMutation = useMutation({
    mutationFn: (id: number) => collaboratorApi.removePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator", "profile"] });
    }
  });

  const createApplicationMutation = useMutation({
    mutationFn: () =>
      applicationsApi.create({
        project_id: applicationProjectId,
        pitch: applicationPitch
      }),
    onSuccess: () => {
      setApplicationPitch("");
      queryClient.invalidateQueries({ queryKey: ["applications", "me"] });
    }
  });

  const loadingProfile =
    profileQuery.isLoading && !profileQuery.error;
  const profileNotFound =
    profileQuery.error && (profileQuery.error as any)?.response?.status === 404;
  const hasProfile = Boolean(profileQuery.data);

  const handlePortfolioSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portfolioForm.title || !portfolioForm.url) {
      return;
    }
    addPortfolioMutation.mutate(portfolioForm);
  };

  const handleApplicationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!applicationPitch.trim() || !hasProfile) {
      return;
    }
    createApplicationMutation.mutate();
  };

  return (
    <section className="edit-profile-page">
      <header>
        <h1>{profileNotFound ? "Crie seu perfil" : "Edite seu perfil"}</h1>
        <p>
          Centralize suas informacoes de colaborador. Use os campos abaixo para
          manter dados atualizados.
        </p>
      </header>

      <ProfileForm
        initialValues={profileQuery.data}
        onSubmit={async (values) => {
          await upsertProfileMutation.mutateAsync(values);
        }}
        submitLabel={profileQuery.data ? "Atualizar perfil" : "Criar perfil"}
        isSaving={upsertProfileMutation.isPending}
      />

      {!loadingProfile && hasProfile && (
        <>
          <SkillSelector
            skills={profileQuery.data?.skills ?? []}
            onAdd={async (name, level) => {
              await addSkillMutation.mutateAsync({ name, level });
            }}
            onRemove={async (id) => {
              await removeSkillMutation.mutateAsync(id);
            }}
            isLoading={
              addSkillMutation.isPending || removeSkillMutation.isPending
            }
          />

          <TagSelector
            interests={profileQuery.data?.interests ?? []}
            onAdd={async (slug, label) => {
              await addInterestMutation.mutateAsync({ slug, label });
            }}
            onRemove={async (id) => {
              await removeInterestMutation.mutateAsync(id);
            }}
          />

          <section className="portfolio-section">
            <h3>Portifolio</h3>
            <form onSubmit={handlePortfolioSubmit} className="portfolio-form">
              <input
                placeholder="Titulo"
                value={portfolioForm.title}
                onChange={(event) =>
                  setPortfolioForm((prev) => ({
                    ...prev,
                    title: event.target.value
                  }))
                }
              />
              <input
                placeholder="URL"
                value={portfolioForm.url}
                onChange={(event) =>
                  setPortfolioForm((prev) => ({
                    ...prev,
                    url: event.target.value
                  }))
                }
              />
              <textarea
                placeholder="Descricao"
                value={portfolioForm.description ?? ""}
                onChange={(event) =>
                  setPortfolioForm((prev) => ({
                    ...prev,
                    description: event.target.value
                  }))
                }
              />
              <button type="submit" disabled={addPortfolioMutation.isPending}>
                {addPortfolioMutation.isPending
                  ? "Adicionando..."
                  : "Adicionar item"}
              </button>
            </form>

            <ul>
              {profileQuery.data?.portfolio_items?.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                  <button
                    type="button"
                    onClick={() => removePortfolioMutation.mutate(item.id)}
                  >
                    Remover
                  </button>
                </li>
              ))}
              {(profileQuery.data?.portfolio_items?.length ?? 0) === 0 && (
                <li>Nenhum projeto cadastrado ainda.</li>
              )}
            </ul>
          </section>
        </>
      )}

      <section className="application-form">
        <h3>Enviar candidatura rapida</h3>
        <form onSubmit={handleApplicationSubmit}>
          <label>
            Projeto ID
            <input
              type="number"
              min={1}
              value={applicationProjectId}
              onChange={(event) =>
                setApplicationProjectId(Number(event.target.value))
              }
            />
          </label>
          <label>
            Pitch
            <textarea
              rows={4}
              value={applicationPitch}
              onChange={(event) => setApplicationPitch(event.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={createApplicationMutation.isPending || !hasProfile}
          >
            {createApplicationMutation.isPending
              ? "Enviando..."
              : "Enviar candidatura"}
          </button>
        </form>
        {!hasProfile && (
          <p>
            Crie seu perfil para liberar candidaturas. As informacoes do pitch
            ficam salvas para quando voce criar o perfil.
          </p>
        )}
      </section>
    </section>
  );
}

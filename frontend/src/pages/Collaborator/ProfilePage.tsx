import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { collaboratorApi } from "../../api/collaborator";

export function ProfilePage() {
  const { data, isLoading, error } = useQuery({
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

  if (isLoading) {
    return <p>Carregando perfil...</p>;
  }

  if (error && (error as any)?.response?.status === 404) {
    return (
      <div className="empty-state">
        <h2>Vamos criar seu perfil?</h2>
        <p>
          Ainda nao encontramos informacoes do seu perfil. Clique abaixo para
          iniciar.
        </p>
        <Link to="/edit" className="button">
          Criar perfil
        </Link>
      </div>
    );
  }

  if (!data) {
    return <p>Ocorreu um erro ao carregar seu perfil.</p>;
  }

  return (
    <section className="profile-page">
      <header>
        <h1>{data.headline ?? "Colaborador sem headline"}</h1>
        <p>{data.bio ?? "Atualize sua bio para destacar seus diferenciais."}</p>
      </header>

      <section>
        <h2>Resumo</h2>
        <ul>
          <li>
            <strong>Cidade:</strong>{" "}
            {data.location_city ? `${data.location_city}/${data.location_state}` : "Nao informada"}
          </li>
          <li>
            <strong>Disponibilidade:</strong>{" "}
            {data.availability_hours_per_week
              ? `${data.availability_hours_per_week} horas por semana`
              : "Nao informada"}
          </li>
          <li>
            <strong>Modelo de trabalho:</strong>{" "}
            {data.work_mode ?? "Nao informado"}
          </li>
        </ul>
      </section>

      <section>
        <h2>Habilidades</h2>
        <ul>
          {data.skills.map((skill) => (
            <li key={skill.id}>
              {skill.name} - nivel {skill.level}
            </li>
          ))}
          {data.skills.length === 0 && <li>Nenhuma habilidade cadastrada.</li>}
        </ul>
      </section>

      <section>
        <h2>Areas de interesse</h2>
        <ul>
          {data.interests.map((interest) => (
            <li key={interest.id}>{interest.label}</li>
          ))}
          {data.interests.length === 0 && <li>Nenhum interesse cadastrado.</li>}
        </ul>
      </section>

      <section>
        <h2>Portifolio</h2>
        <ul>
          {data.portfolio_items.map((item) => (
            <li key={item.id}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              {item.description && <p>{item.description}</p>}
            </li>
          ))}
          {data.portfolio_items.length === 0 && (
            <li>Adicione links para seus trabalhos mais recentes.</li>
          )}
        </ul>
      </section>
    </section>
  );
}


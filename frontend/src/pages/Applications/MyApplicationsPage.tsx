import { useQuery } from "@tanstack/react-query";

import { applicationsApi } from "../../api/applications";
import { ApplicationStatus } from "../../types/application";

const statusLabels: Record<ApplicationStatus, string> = {
  SUBMITTED: "Enviada",
  REVIEWING: "Em analise",
  ACCEPTED: "Aceita",
  DECLINED: "Recusada",
  WITHDRAWN: "Retirada"
};

export function MyApplicationsPage() {
  const applicationsQuery = useQuery({
    queryKey: ["applications", "me"],
    queryFn: applicationsApi.listMine
  });

  if (applicationsQuery.isLoading) {
    return <p>Carregando candidaturas...</p>;
  }

  if (applicationsQuery.isError) {
    return <p>Ocorreu um erro ao carregar suas candidaturas.</p>;
  }

  const applications = applicationsQuery.data ?? [];

  return (
    <section className="applications-page">
      <h1>Minhas candidaturas</h1>
      <p>Acompanhe o status das candidaturas enviadas.</p>
      <ul className="applications-list">
        {applications.map((application) => (
          <li key={application.id} className="application-card">
            <p>
              <strong>Projeto:</strong> #{application.project_id}
            </p>
            <p>
              <strong>Status:</strong> {statusLabels[application.status]}
            </p>
            <p>
              <strong>Enviado em:</strong>{" "}
              {new Date(application.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Pitch:</strong> {application.pitch}
            </p>
          </li>
        ))}
        {applications.length === 0 && (
          <li>Envie uma candidatura para que ela apareca aqui.</li>
        )}
      </ul>
    </section>
  );
}


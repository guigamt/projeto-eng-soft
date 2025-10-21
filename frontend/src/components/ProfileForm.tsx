import { FormEvent, useState } from "react";

import { CollaboratorPayload } from "../types/collaborator";
import { WorkMode } from "../types/enums";

type ProfileFormProps = {
  initialValues?: CollaboratorPayload;
  onSubmit: (values: CollaboratorPayload) => Promise<void> | void;
  submitLabel?: string;
  isSaving?: boolean;
};

const workModeOptions: { value: WorkMode; label: string }[] = [
  { value: WorkMode.REMOTE, label: "Remoto" },
  { value: WorkMode.HYBRID, label: "Hibrido" },
  { value: WorkMode.ONSITE, label: "Presencial" }
];

export function ProfileForm({
  initialValues,
  onSubmit,
  submitLabel = "Salvar",
  isSaving
}: ProfileFormProps) {
  const [formState, setFormState] = useState<CollaboratorPayload>({
    headline: initialValues?.headline ?? "",
    bio: initialValues?.bio ?? "",
    location_city: initialValues?.location_city ?? "",
    location_state: initialValues?.location_state ?? "",
    availability_hours_per_week:
      initialValues?.availability_hours_per_week ?? undefined,
    work_mode: initialValues?.work_mode ?? undefined
  });

  const handleChange = (field: keyof CollaboratorPayload, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]:
        field === "availability_hours_per_week"
          ? Number(value) || undefined
          : value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="headline">Headline</label>
        <input
          id="headline"
          name="headline"
          value={formState.headline ?? ""}
          onChange={(event) => handleChange("headline", event.target.value)}
          placeholder="Produto, IA, UX..."
        />
      </div>

      <div className="field">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formState.bio ?? ""}
          onChange={(event) => handleChange("bio", event.target.value)}
          placeholder="Conte sua jornada em algumas linhas."
        />
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="location_city">Cidade</label>
          <input
            id="location_city"
            name="location_city"
            value={formState.location_city ?? ""}
            onChange={(event) =>
              handleChange("location_city", event.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="location_state">Estado</label>
          <input
            id="location_state"
            name="location_state"
            maxLength={2}
            value={formState.location_state ?? ""}
            onChange={(event) =>
              handleChange("location_state", event.target.value.toUpperCase())
            }
          />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="availability_hours_per_week">
            Disponibilidade (h/semana)
          </label>
          <input
            id="availability_hours_per_week"
            type="number"
            min={0}
            max={168}
            value={formState.availability_hours_per_week ?? ""}
            onChange={(event) =>
              handleChange("availability_hours_per_week", event.target.value)
            }
          />
        </div>

        <div className="field">
          <label htmlFor="work_mode">Modelo de trabalho</label>
          <select
            id="work_mode"
            value={formState.work_mode ?? ""}
            onChange={(event) =>
              handleChange("work_mode", event.target.value as WorkMode)
            }
          >
            <option value="">Selecione</option>
            {workModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}


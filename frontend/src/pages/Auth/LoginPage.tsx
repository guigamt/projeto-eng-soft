import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";

import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth";

type AuthMode = "login" | "register";

const roles: Array<{ value: UserRole; label: string }> = [
  { value: "COLLABORATOR", label: "Colaborador" },
  { value: "IDEALIZER", label: "Idealizador" }
];

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("COLLABORATOR");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleMode = () => {
    setMode((value) => (value === "login" ? "register" : "login"));
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        return;
      }

      await authApi.register({
        email,
        password,
        full_name: fullName || undefined,
        role
      });
      setSuccess("Conta criada com sucesso! Realizando login...");
      await login(email, password);
    } catch (err) {
      if (isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(
          detail ??
            (mode === "login"
              ? "Credenciais invalidas. Verifique e tente novamente."
              : "Nao foi possivel criar a conta. Tente novamente.")
        );
      } else {
        setError(
          mode === "login"
            ? "Nao foi possivel realizar o login. Tente novamente."
            : "Nao foi possivel criar a conta. Tente novamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting;
  const isRegister = mode === "register";

  return (
    <div className="auth-wrapper">
      <section className="auth-card">
        <h1>{isRegister ? "Crie sua conta" : "Bem vindo ao Colab Connect"}</h1>
        <p>
          {isRegister
            ? "Complete os dados abaixo para comecar a colaborar."
            : "Entre com seu e mail para acessar a plataforma."}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            required
            disabled={disabled}
          />

          {isRegister && (
            <>
              <label htmlFor="fullName">Nome completo</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Como devemos te chamar?"
                disabled={disabled}
              />

              <label htmlFor="role">Como deseja participar?</label>
              <select
                id="role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                disabled={disabled}
              >
                {roles.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required
            disabled={disabled}
          />

          {isRegister && (
            <>
              <label htmlFor="confirmPassword">Confirme a senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="********"
                required
                disabled={disabled}
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" disabled={disabled}>
            {disabled
              ? isRegister
                ? "Enviando..."
                : "Entrando..."
              : isRegister
              ? "Criar conta"
              : "Entrar"}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? (
            <>
              <span>Ja possui uma conta?</span>
              <button
                type="button"
                className="auth-secondary"
                onClick={handleToggleMode}
              >
                Fazer login
              </button>
            </>
          ) : (
            <>
              <span>Ainda nao tem acesso?</span>
              <button
                type="button"
                className="auth-secondary"
                onClick={handleToggleMode}
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { isAxiosError } from "axios";
import { useState } from "react";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
const roles = [
    { value: "COLLABORATOR", label: "Colaborador" },
    { value: "IDEALIZER", label: "Idealizador" }
];
export function LoginPage() {
    const { login, isLoading } = useAuth();
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("COLLABORATOR");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    const handleToggleMode = () => {
        setMode((value) => (value === "login" ? "register" : "login"));
        setError(null);
        setSuccess(null);
        setPassword("");
        setConfirmPassword("");
    };
    const handleSubmit = async (event) => {
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
        }
        catch (err) {
            if (isAxiosError(err)) {
                const detail = err.response?.data?.detail;
                setError(detail ??
                    (mode === "login"
                        ? "Credenciais invalidas. Verifique e tente novamente."
                        : "Nao foi possivel criar a conta. Tente novamente."));
            }
            else {
                setError(mode === "login"
                    ? "Nao foi possivel realizar o login. Tente novamente."
                    : "Nao foi possivel criar a conta. Tente novamente.");
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const disabled = isLoading || isSubmitting;
    const isRegister = mode === "register";
    return (_jsx("div", { className: "auth-wrapper", children: _jsxs("section", { className: "auth-card", children: [_jsx("h1", { children: isRegister ? "Crie sua conta" : "Bem vindo ao Colab Connect" }), _jsx("p", { children: isRegister
                        ? "Complete os dados abaixo para comecar a colaborar."
                        : "Entre com seu e mail para acessar a plataforma." }), _jsxs("form", { className: "auth-form", onSubmit: handleSubmit, children: [_jsx("label", { htmlFor: "email", children: "E-mail" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "seu@email.com", required: true, disabled: disabled }), isRegister && (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: "fullName", children: "Nome completo" }), _jsx("input", { id: "fullName", type: "text", value: fullName, onChange: (event) => setFullName(event.target.value), placeholder: "Como devemos te chamar?", disabled: disabled }), _jsx("label", { htmlFor: "role", children: "Como deseja participar?" }), _jsx("select", { id: "role", value: role, onChange: (event) => setRole(event.target.value), disabled: disabled, children: roles.map((item) => (_jsx("option", { value: item.value, children: item.label }, item.value))) })] })), _jsx("label", { htmlFor: "password", children: "Senha" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "********", required: true, disabled: disabled }), isRegister && (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirme a senha" }), _jsx("input", { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value), placeholder: "********", required: true, disabled: disabled })] })), error && _jsx("p", { className: "auth-error", children: error }), success && _jsx("p", { className: "auth-success", children: success }), _jsx("button", { type: "submit", disabled: disabled, children: disabled
                                ? isRegister
                                    ? "Enviando..."
                                    : "Entrando..."
                                : isRegister
                                    ? "Criar conta"
                                    : "Entrar" })] }), _jsx("div", { className: "auth-toggle", children: isRegister ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "Ja possui uma conta?" }), _jsx("button", { type: "button", className: "auth-secondary", onClick: handleToggleMode, children: "Fazer login" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: "Ainda nao tem acesso?" }), _jsx("button", { type: "button", className: "auth-secondary", onClick: handleToggleMode, children: "Criar conta" })] })) })] }) }));
}

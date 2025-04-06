import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Register = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const navigate = useNavigate();

  const handleRegister = (e: Event) => {
    e.preventDefault();
    if (password() === confirmPassword()) {
      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } else {
      alert("As senhas não coincidem!");
    }
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-900">
      <div class="p-8 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-md w-96">
        <h2 class="text-2xl mb-6 text-center">Criar nova conta</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="E-mail"
            class="w-full mb-4 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            class="w-full mb-4 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            class="w-full mb-4 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cadastrar
          </button>
        </form>
        <div class="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
          Já tem uma conta?{" "}
          <a href="/" class="text-blue-500 dark:text-blue-400">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

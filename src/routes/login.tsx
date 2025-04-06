import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const Login = () => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = (e: Event) => {
    e.preventDefault();
    if (username() === "user" && password() === "user") {
      localStorage.setItem("authenticated", "true");
      navigate("/home");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-900">
      <div class="p-8 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-md w-96">
        <h2 class="text-2xl mb-6 text-center">Bem-vindo!</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuário"
            class="w-full mb-4 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            class="w-full mb-4 p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
        <div class="mt-4 text-center text-sm">
          <a href="#" class="text-blue-500 dark:text-blue-400">
            Esqueci minha senha
          </a>
        </div>
        <div class="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
          Não tem uma conta?{" "}
          <a href="/register" class="text-blue-500 dark:text-blue-400">
            Criar nova conta
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

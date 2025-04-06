import { createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

const images = [
  "/001.jpg",
  "/002.jpg",
  "/003.jpg",
  "/004.jpg",
  "/005.jpg",
  "/006.jpg",
];

const Login = () => {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
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

  let intervalId: number;

  onMount(() => {
    intervalId = setInterval(() => {
      setCurrentImageIndex((index) => (index + 1) % images.length);
    }, 3000);
  });

  onCleanup(() => clearInterval(intervalId));

  return (
    <div
      class="relative flex flex-col items-center justify-center h-screen"
      style={{
        "background-image": `url(${images[currentImageIndex()]})`,
        "background-size": "cover",
        "background-position": "center",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div class="absolute inset-0 bg-blue-900 opacity-50 z-0"></div>
      <div class="relative p-8 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-md w-96 backdrop-blur-sm z-10">
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

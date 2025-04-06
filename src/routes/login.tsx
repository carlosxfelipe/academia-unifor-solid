import { createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Eye, EyeOff, User, Lock } from "lucide-solid";

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
  const [isPasswordVisible, setIsPasswordVisible] = createSignal(false);
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
      <div class="relative p-8 bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-white/40 rounded-xl shadow-xl w-96 backdrop-blur-xl z-10 transition-all duration-300">
        <h2 class="text-2xl mb-6 text-center text-gray-900 dark:text-white">
          Bem-vindo!
        </h2>
        <form onSubmit={handleLogin} class="space-y-4">
          {/* Input de Usuário */}
          <div class="flex items-center w-full border border-transparent rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white shadow-sm focus-within:ring focus-within:ring-blue-500 transition-all duration-300 backdrop-blur-sm">
            <User class="ml-3 text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Usuário"
              class="flex-1 p-3 bg-transparent focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          {/* Input de Senha */}
          <div class="flex items-center w-full border border-transparent rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white shadow-sm focus-within:ring focus-within:ring-blue-500 transition-all duration-300 backdrop-blur-sm">
            <Lock class="ml-3 text-gray-500 dark:text-gray-400" size={20} />
            <input
              type={isPasswordVisible() ? "text" : "password"}
              placeholder="Senha"
              class="flex-1 p-3 bg-transparent focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <button
              type="button"
              class="mr-3 text-gray-500 dark:text-gray-400"
              onClick={() => setIsPasswordVisible(!isPasswordVisible())}
            >
              {isPasswordVisible() ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            class="w-full p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
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

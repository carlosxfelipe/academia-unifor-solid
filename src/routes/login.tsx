import { createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Eye, EyeOff, User, Lock } from "lucide-solid";
import { UniforLogo } from "~/components/UniforLogo";
// import users from "../../mocks/users.json";
import { useUser } from "~/contexts/UserContext";
import { useIsMobile } from "~/hooks/useIsMobile";

const images = [
  "/001.jpg",
  "/002.jpg",
  "/003.jpg",
  "/004.jpg",
  "/005.jpg",
  "/006.jpg",
];

const Login = () => {
  const isMobile = useIsMobile();

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  const [isPasswordVisible, setIsPasswordVisible] = createSignal(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  // const handleLogin = (e: Event) => {
  //   e.preventDefault();

  //   const user = users.find(
  //     (u) => u.email === username() && u.password === password()
  //   );

  //   if (user) {
  //     localStorage.setItem("authenticated", "true");
  //     localStorage.setItem("user", JSON.stringify(user)); // salva o usuário logado
  //     setUser(user);
  //     navigate("/home");
  //   } else {
  //     alert("Usuário ou senha inválidos!");
  //   }
  // };

  const handleLogin = async (e: Event) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://academia-unifor-fastapi.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username(),
            password: password(),
          }),
        }
      );

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/home");
      } else {
        alert("Usuário ou senha inválidos!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
      console.error(error);
    }
  };

  let intervalId: ReturnType<typeof setInterval>;

  onMount(() => {
    intervalId = setInterval(() => {
      setCurrentImageIndex((index) => (index + 1) % images.length);
    }, 3000);
  });

  onCleanup(() => clearInterval(intervalId));

  return (
    <div class="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      {!isMobile() &&
        images.map((img, i) => (
          <div
            class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              "background-image": `url(${img})`,
              opacity: i === currentImageIndex() ? 1 : 0,
            }}
          />
        ))}
      <div class="absolute inset-0 bg-blue-900 opacity-50 z-0"></div>
      <div class="relative p-8 bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-white/40 rounded-xl shadow-xl w-96 backdrop-blur-xl z-10 transition-all duration-300">
        <div class="flex justify-center mb-4 text-gray-900 dark:text-white">
          <UniforLogo height={100} color="currentColor" />
        </div>
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

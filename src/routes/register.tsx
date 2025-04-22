import { createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { UniforLogo } from "~/components/UniforLogo";
import { Mail, Lock } from "lucide-solid";
import { useIsMobile } from "~/hooks/useIsMobile";

const images = [
  "/001.jpg",
  "/002.jpg",
  "/003.jpg",
  "/004.jpg",
  "/005.jpg",
  "/006.jpg",
];

const Register = () => {
  const isMobile = useIsMobile();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  const navigate = useNavigate();

  // const handleRegister = (e: Event) => {
  //   e.preventDefault();
  //   if (password() === confirmPassword()) {
  //     alert("Cadastro realizado com sucesso!");
  //     navigate("/");
  //   } else {
  //     alert("As senhas não coincidem!");
  //   }
  // };

  const handleRegister = async (e: Event) => {
    e.preventDefault();

    if (!email() || !password() || !confirmPassword()) {
      alert("Preencha todos os campos.");
      return;
    }

    if (password() !== confirmPassword()) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(
        "https://academia-unifor-fastapi.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: email().split("@")[0], // apenas para preencher algo
            email: email(),
            password: password(),
            phone: null,
            address: null,
            birthDate: null,
            avatarUrl: null,
            isAdmin: false,
            workouts: [],
          }),
        }
      );

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/");
      } else {
        const error = await response.json();
        alert(`Erro: ${error.detail || "Não foi possível cadastrar."}`);
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
      console.error(err);
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
      <div
        class={`relative z-10 transition-all duration-300 ${
          isMobile()
            ? "w-full h-full p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl"
            : "p-8 bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-white/40 rounded-xl shadow-xl w-96 backdrop-blur-xl"
        }`}
      >
        <div class="flex justify-center mb-4 text-gray-900 dark:text-white">
          <UniforLogo height={100} color="currentColor" />
        </div>
        <h2 class="text-2xl mb-6 text-center text-gray-900 dark:text-white">
          Criar nova conta
        </h2>
        <form onSubmit={handleRegister} class="space-y-4">
          {/* Input de E-mail */}
          <div class="flex items-center w-full border border-transparent rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white shadow-sm focus-within:ring focus-within:ring-blue-500 transition-all duration-300 backdrop-blur-sm">
            <Mail class="ml-3 text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              class="flex-1 p-3 bg-transparent focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          {/* Input de Senha */}
          <div class="flex items-center w-full border border-transparent rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white shadow-sm focus-within:ring focus-within:ring-blue-500 transition-all duration-300 backdrop-blur-sm">
            <Lock class="ml-3 text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Senha"
              class="flex-1 p-3 bg-transparent focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          {/* Input de Confirmar Senha */}
          <div class="flex items-center w-full border border-transparent rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white shadow-sm focus-within:ring focus-within:ring-blue-500 transition-all duration-300 backdrop-blur-sm">
            <Lock class="ml-3 text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Confirmar Senha"
              class="flex-1 p-3 bg-transparent focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </div>
          <button
            type="submit"
            class="w-full p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
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

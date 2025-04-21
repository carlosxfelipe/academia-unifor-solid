import Layout from "~/components/Layout";
import { useNavigate } from "@solidjs/router";
import { useUser } from "~/contexts/UserContext";
import { createEffect } from "solid-js";

export default function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  createEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!user.isAdmin) {
      navigate("/home", { replace: true });
    }
  });

  if (!user || !user.isAdmin) {
    return null; // evita mostrar a página enquanto redireciona
  }

  return (
    <Layout>
      <h1 class="text-2xl font-bold text-center text-blue-600">
        Painel do Administrador
      </h1>
      <p class="text-center mt-4 text-gray-700 dark:text-gray-300">
        Bem-vindo, {user.name}!
      </p>
    </Layout>
  );
}

import { createEffect, createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useUser } from "~/contexts/UserContext";
import Layout from "~/components/Layout";
import { API_BASE } from "~/lib/api";

const API_KEY = import.meta.env.VITE_API_KEY;

const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
};

export default function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [users] = createResource(fetchUsers);

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

      <Show when={users.loading}>
        <p class="mt-6 text-center text-gray-500">Carregando usuários...</p>
      </Show>

      <Show
        when={users()}
        fallback={
          <p class="text-center mt-6 text-red-500">Erro ao carregar usuários</p>
        }
      >
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={users()}>
            {(u) => (
              <div class="p-4 bg-white dark:bg-gray-700 rounded-xl shadow">
                <p>
                  <strong>Nome:</strong> {u.name}
                </p>
                <p>
                  <strong>Email:</strong> {u.email}
                </p>
                <p>
                  <strong>Admin:</strong> {u.isAdmin ? "Sim" : "Não"}
                </p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Layout>
  );
}

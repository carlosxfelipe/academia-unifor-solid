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
              <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center text-center">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  class="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3"
                />
                <h2 class="text-lg font-semibold text-blue-600">{u.name}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  {u.email}
                </p>

                <table class="text-sm text-left w-full mt-2">
                  <tbody class="text-gray-600 dark:text-gray-300">
                    <tr>
                      <td class="font-medium">Telefone:</td>
                      <td>{u.phone || "-"}</td>
                    </tr>
                    <tr>
                      <td class="font-medium">Endereço:</td>
                      <td>{u.address || "-"}</td>
                    </tr>
                    <tr>
                      <td class="font-medium">Nascimento:</td>
                      <td>{u.birthDate || "-"}</td>
                    </tr>
                    <tr>
                      <td class="font-medium">Admin:</td>
                      <td>
                        <span
                          class={`px-2 py-1 rounded-full text-xs font-bold ${
                            u.isAdmin
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {u.isAdmin ? "Sim" : "Não"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </For>
        </div>
      </Show>
    </Layout>
  );
}

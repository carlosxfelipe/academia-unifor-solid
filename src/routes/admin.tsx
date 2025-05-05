import {
  createSignal,
  createEffect,
  createResource,
  For,
  Show,
  onCleanup,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useUser } from "~/contexts/UserContext";
import Layout from "~/components/Layout";
import { API_BASE } from "~/lib/api";
import { getRandomColor } from "~/lib/utils";

type Exercise = {
  id: number;
  name: string;
  reps: string;
  notes: string | null;
};

type Workout = {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  avatarUrl: string;
  isAdmin: boolean;
  workouts: Workout[];
};

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
  const [selectedUser, setSelectedUser] = createSignal<User | null>(null);
  const [searchTerm, setSearchTerm] = createSignal("");
  const filteredUsers = (): User[] => {
    const term = searchTerm().toLowerCase();
    const allUsers = users() as User[] | undefined;
    return (
      allUsers?.filter(
        (u: User) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      ) || []
    );
  };

  const handleClickOutside = (e: MouseEvent) => {
    const modal = document.getElementById("user-modal");
    if (modal && !modal.contains(e.target as Node)) {
      setSelectedUser(null);
    }
  };

  createEffect(() => {
    if (selectedUser()) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    onCleanup(() =>
      document.removeEventListener("mousedown", handleClickOutside)
    );
  });

  createEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!user.isAdmin) {
      navigate("/home", { replace: true });
    }
  });

  if (!user || !user.isAdmin) {
    return null;
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
        <div class="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            class="mb-6 w-full max-w-md px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none"
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={filteredUsers()}>
            {(u) => (
              <div
                class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)] flex flex-col items-center text-center"
                onClick={() => setSelectedUser(u)}
              >
                <Show
                  when={u.avatarUrl}
                  fallback={
                    <div
                      class="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow"
                      style={`background-color: ${getRandomColor(u.id)}`}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  }
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    class="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3"
                  />
                </Show>
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
                              : "bg-yellow-100 text-yellow-700"
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

      {/* Modal */}
      <Show when={selectedUser()}>
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            id="user-modal"
            class="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-lg w-full relative shadow-xl"
          >
            <button
              class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>
            <h2 class="text-xl font-bold text-blue-600 mb-4">
              {selectedUser()?.name} - Treinos
            </h2>
            <Show
              when={(() => {
                const user = selectedUser();
                return (
                  user &&
                  Array.isArray(user.workouts) &&
                  user.workouts.length > 0
                );
              })()}
              fallback={<p>Sem treinos cadastrados.</p>}
            >
              <For each={selectedUser()?.workouts}>
                {(workout) => (
                  <div class="mb-4">
                    <h3 class="font-semibold text-blue-500">{workout.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {workout.description || "Sem descrição"}
                    </p>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                      <For each={workout.exercises}>
                        {(ex) => (
                          <li>
                            <strong>{ex.name}</strong> - {ex.reps}
                            {ex.notes && ` (${ex.notes})`}
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>
    </Layout>
  );
}

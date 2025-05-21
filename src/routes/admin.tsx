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
import { formatDateForDisplay } from "~/lib/dateUtils";
import { authHeaders, jsonHeaders } from "~/lib/authHeaders";

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

const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: authHeaders,
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
};

const removeAdminStatus = async (userId: number) => {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify({ isAdmin: false }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar o status de admin");
  return res.json();
};

const toggleAdminStatus = async (userId: number, isAdmin: boolean) => {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify({ isAdmin }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar status de admin");
  return res.json();
};

export default function AdminPage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [users, { refetch }] = createResource(fetchUsers);
  const [selectedUser, setSelectedUser] = createSignal<User | null>(null);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [exerciseFields, setExerciseFields] = createSignal([
    { name: "", reps: "", notes: "" },
  ]);
  const [editingWorkout, setEditingWorkout] = createSignal<Workout | null>(
    null
  );
  const [workoutName, setWorkoutName] = createSignal("");
  const [workoutDescription, setWorkoutDescription] = createSignal("");

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

  const addExerciseField = () => {
    setExerciseFields([...exerciseFields(), { name: "", reps: "", notes: "" }]);
  };

  const removeExerciseField = (index: number) => {
    const updated = exerciseFields().filter((_, i) => i !== index);
    setExerciseFields(updated);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const modal = document.getElementById("user-modal");
    if (modal && !modal.contains(e.target as Node)) {
      setSelectedUser(null);
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setExerciseFields(
      workout.exercises.map((ex) => ({
        name: ex.name,
        reps: ex.reps,
        notes: ex.notes || "",
      }))
    );
    setWorkoutName(workout.name);
    setWorkoutDescription(workout.description || "");
  };

  const handleDeleteWorkout = async (workoutId: number) => {
    const confirmed = window.confirm("Deseja realmente excluir este treino?");
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE}/workouts/${workoutId}`, {
        method: "DELETE",
        headers: jsonHeaders,
      });

      // Refetch dos usuários após exclusão
      await refetch();
      setSelectedUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          workouts: prev.workouts.filter((w) => w.id !== workoutId),
        };
      });
    } catch (err) {
      alert("Erro ao excluir treino");
      console.error(err);
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
    const currentUser = user();
    if (!currentUser) {
      navigate("/login", { replace: true });
    } else if (!currentUser.isAdmin) {
      navigate("/home", { replace: true });
    }
  });

  if (!user() || !user()?.isAdmin) {
    return null;
  }

  const isEditing = !!editingWorkout();

  return (
    <Layout>
      <h1 class="text-2xl font-bold text-center text-blue-600">
        Painel do Administrador
      </h1>
      <div class="mt-4 flex justify-center">
        <button
          class="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          onClick={async () => {
            const confirmed = window.confirm(
              "Tem certeza que deseja deixar de ser administrador? Essa ação não poderá ser desfeita."
            );
            if (!confirmed) return;

            const currentUser = user();
            if (!currentUser) return;

            try {
              const updatedUser = await removeAdminStatus(currentUser.id);
              setUser(updatedUser);
              alert("Você deixou de ser administrador.");
              navigate("/home", { replace: true });
            } catch (err) {
              alert("Erro ao remover status de admin.");
              console.error(err);
            }
          }}
        >
          Deixar de ser Admin
        </button>
      </div>
      <p class="text-center mt-4 text-gray-700 dark:text-gray-300">
        Bem-vindo, {user()?.name}!
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
                // onClick={() => setSelectedUser(u)}
              >
                <Show
                  when={u.avatarUrl}
                  fallback={
                    <div
                      class="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow"
                      style={`background-color: ${getRandomColor(u.id)}`}
                      onClick={() => setSelectedUser(u)}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  }
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    class="w-20 h-20 rounded-full border-4 border-blue-500 shadow mb-3"
                    onClick={() => setSelectedUser(u)}
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
                      <td>{formatDateForDisplay(u.birthDate) || "-"}</td>
                    </tr>
                    <tr>
                      <td class="font-medium">Admin:</td>
                      <td>
                        <div class="flex items-center gap-3">
                          <span
                            class={`px-2 py-1 rounded-full text-xs font-bold ${
                              u.isAdmin
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {u.isAdmin ? "Sim" : "Não"}
                          </span>

                          {/* Switch para alterar status de admin */}
                          <Show when={u.id !== user()?.id}>
                            <label class="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={u.isAdmin}
                                onChange={async (e) => {
                                  try {
                                    const updated = await toggleAdminStatus(
                                      u.id,
                                      e.currentTarget.checked
                                    );

                                    setSelectedUser((prev) =>
                                      prev && prev.id === updated.id
                                        ? { ...prev, isAdmin: updated.isAdmin }
                                        : prev
                                    );

                                    await refetch();
                                  } catch (err) {
                                    alert("Erro ao atualizar status de admin.");
                                    console.error(err);
                                  }
                                }}
                                class="sr-only peer"
                              />
                              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300"></div>
                              <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                            </label>
                          </Show>
                        </div>
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
            class="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-5xl w-full relative shadow-xl"
          >
            <button
              class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
              onClick={() => {
                setSelectedUser(null);
                setEditingWorkout(null);
                setWorkoutName("");
                setWorkoutDescription("");
                setExerciseFields([{ name: "", reps: "", notes: "" }]);
              }}
            >
              ×
            </button>

            <div class="flex flex-col lg:flex-row gap-6 mt-6">
              {/* Lista de treinos */}
              <div class="flex-1 overflow-y-auto max-h-[60vh] pr-2">
                <h2 class="text-xl font-bold text-blue-600 mb-4">
                  {selectedUser()?.name} - Treinos
                </h2>
                <Show
                  when={selectedUser()?.workouts?.length}
                  fallback={<p>Sem treinos cadastrados.</p>}
                >
                  <For each={selectedUser()?.workouts}>
                    {(workout) => (
                      <div class="mb-4 border-b border-gray-300 pb-2">
                        <div class="flex justify-between items-center">
                          <h3 class="font-semibold text-blue-500">
                            {workout.name}
                          </h3>
                          <div class="flex gap-2">
                            <button
                              class="text-sm text-yellow-500"
                              onClick={() => handleEditWorkout(workout)}
                            >
                              Editar
                            </button>
                            <button
                              class="text-sm text-red-500"
                              onClick={() => handleDeleteWorkout(workout.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                          {workout.description || "Sem descrição"}
                        </p>
                        <ul class="list-disc ml-5 text-sm">
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

              {/* Formulário novo treino */}
              <div class="w-full lg:w-1/3 overflow-y-auto max-h-[60vh] pr-2">
                <h3 class="text-lg font-bold text-green-600 mb-2">
                  Novo Treino
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const exercises = exerciseFields().map((_, index) => ({
                      name: formData.get(`name-${index}`),
                      reps: formData.get(`reps-${index}`),
                      notes: formData.get(`notes-${index}`),
                    }));

                    const newWorkout = {
                      name: workoutName(),
                      description: workoutDescription(),
                      exercises,
                    };

                    const isEditingNow = !!editingWorkout();

                    try {
                      const res = await fetch(
                        isEditingNow
                          ? `${API_BASE}/workouts/${editingWorkout()?.id}`
                          : `${API_BASE}/workouts/user/${selectedUser()?.id}`,
                        {
                          method: isEditingNow ? "PUT" : "POST",
                          headers: jsonHeaders,
                          body: JSON.stringify(newWorkout),
                        }
                      );

                      if (!res.ok) {
                        throw new Error("Erro ao salvar treino");
                      }

                      const savedWorkout = await res.json();

                      setSelectedUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              workouts: isEditingNow
                                ? prev.workouts.map((w) =>
                                    w.id === savedWorkout.id ? savedWorkout : w
                                  )
                                : [...prev.workouts, savedWorkout],
                            }
                          : null
                      );

                      setExerciseFields([{ name: "", reps: "", notes: "" }]);
                      setEditingWorkout(null);
                      setWorkoutName("");
                      setWorkoutDescription("");
                      form.reset();
                    } catch (err) {
                      alert("Erro ao salvar treino");
                      console.error(err);
                    }
                  }}
                >
                  <input
                    name="name"
                    placeholder="Nome do treino"
                    class="mb-2 w-full px-3 py-2 rounded border"
                    required
                    value={workoutName()}
                    onInput={(e) => setWorkoutName(e.currentTarget.value)}
                  />
                  <input
                    name="description"
                    placeholder="Descrição"
                    class="mb-4 w-full px-3 py-2 rounded border"
                    value={workoutDescription()}
                    onInput={(e) =>
                      setWorkoutDescription(e.currentTarget.value)
                    }
                  />

                  <For each={exerciseFields()}>
                    {(ex, index) => (
                      <div class="mb-2 border p-2 rounded bg-gray-100 dark:bg-gray-800">
                        <input
                          name={`name-${index()}`}
                          placeholder="Nome do exercício"
                          class="w-full mb-1 px-2 py-1 rounded border"
                          required
                          value={ex.name}
                          onInput={(e) => {
                            const updated = [...exerciseFields()];
                            updated[index()].name = e.currentTarget.value;
                            setExerciseFields(updated);
                          }}
                        />
                        <input
                          name={`reps-${index()}`}
                          placeholder="Repetições"
                          class="w-full mb-1 px-2 py-1 rounded border"
                          required
                          value={ex.reps}
                          onInput={(e) => {
                            const updated = [...exerciseFields()];
                            updated[index()].reps = e.currentTarget.value;
                            setExerciseFields(updated);
                          }}
                        />
                        <input
                          name={`notes-${index()}`}
                          placeholder="Notas (opcional)"
                          class="w-full mb-1 px-2 py-1 rounded border"
                          value={ex.notes}
                          onInput={(e) => {
                            const updated = [...exerciseFields()];
                            updated[index()].notes = e.currentTarget.value;
                            setExerciseFields(updated);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExerciseField(index())}
                          class="text-xs text-red-500 hover:underline"
                        >
                          Remover exercício
                        </button>
                      </div>
                    )}
                  </For>

                  <div class="flex flex-col">
                    <button
                      type="button"
                      onClick={addExerciseField}
                      class="text-sm text-blue-600 hover:underline mb-2 self-start"
                    >
                      + Adicionar exercício
                    </button>

                    <button
                      type="submit"
                      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                    >
                      {isEditing ? "Salvar Alterações" : "Criar Treino"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Layout>
  );
}

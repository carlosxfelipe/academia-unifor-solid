import { createEffect, createSignal, Show } from "solid-js";
import Layout from "~/components/Layout";
import { useUser } from "~/contexts/UserContext";
import { Mail, Phone, MapPin, Calendar, ShieldCheck } from "lucide-solid";
import { API_BASE } from "~/lib/api";
import { jsonHeaders } from "~/lib/authHeaders";

function formatDateForDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

type Exercise = {
  name: string;
  reps?: string;
  notes?: string;
};

type Workout = {
  name: string;
  description?: string;
  exercises: Exercise[];
};

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [isFormOpen, setIsFormOpen] = createSignal(false);

  function formatDateForInput(date: string): string {
    if (!date) return "";
    if (date.includes("-")) return date; // já está no formato ISO
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }

  const [formData, setFormData] = createSignal({
    name: user()?.name || "",
    email: user()?.email || "",
    password: "",
    phone: user()?.phone || "",
    address: user()?.address || "",
    birthDate: formatDateForInput(user()?.birthDate || ""),
    avatarUrl: user()?.avatarUrl || "",
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const raw = formData();
    const payload: Partial<typeof raw> = { ...raw };

    if (!payload.password) delete payload.password;

    const res = await fetch(`${API_BASE}/users/${user()?.id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setIsFormOpen(false);
    } else {
      alert("Erro ao atualizar dados");
    }
  }

  createEffect(() => {
    if (isFormOpen()) {
      const u = user();
      if (u !== null) {
        setFormData({
          name: u.name || "",
          email: u.email || "",
          password: "",
          phone: u.phone || "",
          address: u.address || "",
          birthDate: formatDateForInput(u.birthDate || ""),
          avatarUrl: u.avatarUrl || "",
        });
      }
    }
  });

  if (!user()) {
    return (
      <Layout>
        <p>Usuário não autenticado</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Show when={user()}>
        {(u) => (
          <>
            <div class="bg-slate-50 dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-10 transition-colors">
              <div class="flex flex-col items-center text-center">
                <img
                  src={u().avatarUrl || "/avatar.jpg"}
                  alt={u().name}
                  class="w-28 h-28 rounded-full shadow-md mb-4"
                />
                <h2 class="text-2xl font-bold mb-1">{u().name}</h2>
                {u().isAdmin && (
                  <div class="flex items-center text-blue-500 text-sm font-semibold mt-1">
                    <ShieldCheck class="w-4 h-4 mr-1" />
                    Administrador
                  </div>
                )}
                <button
                  class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsFormOpen(true)}
                >
                  Editar Perfil
                </button>
              </div>

              <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-gray-700 dark:text-gray-300">
                {u().email && (
                  <div class="flex items-center">
                    <Mail class="w-5 h-5 mr-2 text-blue-500" />
                    <span>{u().email}</span>
                  </div>
                )}
                {u().phone && (
                  <div class="flex items-center">
                    <Phone class="w-5 h-5 mr-2 text-blue-500" />
                    <span>{u().phone}</span>
                  </div>
                )}
                {u().address && (
                  <div class="flex items-center">
                    <MapPin class="w-5 h-5 mr-2 text-blue-500" />
                    <span>{u().address}</span>
                  </div>
                )}
                {u().birthDate && (
                  <div class="flex items-center">
                    <Calendar class="w-5 h-5 mr-2 text-blue-500" />
                    <span>{formatDateForDisplay(u().birthDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div class="space-y-8">
              {u().workouts?.length > 0 ? (
                u().workouts.map((workout: Workout) => (
                  <div class="bg-slate-50 dark:bg-gray-900 p-6 rounded-xl shadow-md transition-colors">
                    <h3 class="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {workout.name}
                    </h3>
                    <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {workout.description}
                    </p>
                    <ul class="list-disc list-inside space-y-3 text-base text-gray-800 dark:text-gray-200">
                      {workout.exercises.map((ex) => (
                        <li>
                          <strong>{ex.name}</strong>
                          {ex.reps && ` — ${ex.reps}`}
                          {ex.notes && (
                            <p class="text-sm text-gray-500 dark:text-gray-400 ml-2 mt-1">
                              {ex.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p class="text-center text-gray-500 text-lg">
                  Nenhum treino cadastrado.
                </p>
              )}
            </div>
          </>
        )}
      </Show>

      <Show when={isFormOpen()}>
        <div
          class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
          onClick={() => setIsFormOpen(false)}
        >
          <form
            class="bg-white dark:bg-zinc-900 p-6 rounded shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2 class="text-xl font-bold mb-4">Editar Perfil</h2>

            <div class="space-y-3">
              <input
                class="w-full border px-3 py-2 rounded"
                placeholder="Nome"
                value={formData().name}
                onInput={(e) =>
                  setFormData({ ...formData(), name: e.currentTarget.value })
                }
              />
              <input
                class="w-full border px-3 py-2 rounded"
                placeholder="Email"
                value={formData().email}
                onInput={(e) =>
                  setFormData({ ...formData(), email: e.currentTarget.value })
                }
              />
              <input
                class="w-full border px-3 py-2 rounded"
                type="password"
                placeholder="Nova senha"
                value={formData().password || ""}
                onInput={(e) =>
                  setFormData({
                    ...formData(),
                    password: e.currentTarget.value,
                  })
                }
              />
              <input
                class="w-full border px-3 py-2 rounded"
                placeholder="Telefone"
                value={formData().phone}
                onInput={(e) =>
                  setFormData({ ...formData(), phone: e.currentTarget.value })
                }
              />
              <input
                class="w-full border px-3 py-2 rounded"
                placeholder="Endereço"
                value={formData().address}
                onInput={(e) =>
                  setFormData({
                    ...formData(),
                    address: e.currentTarget.value,
                  })
                }
              />
              <input
                class="w-full border px-3 py-2 rounded"
                type="url"
                placeholder="URL da imagem de perfil"
                value={formData().avatarUrl}
                onInput={(e) =>
                  setFormData({
                    ...formData(),
                    avatarUrl: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button
                type="button"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsFormOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </Show>
    </Layout>
  );
}

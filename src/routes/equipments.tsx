import { createSignal, createMemo, createResource, For, Show } from "solid-js";
import Layout from "~/components/Layout";
import { API_BASE } from "~/lib/api";
import { useUser } from "~/contexts/UserContext";
import { authHeaders, jsonHeaders } from "~/lib/authHeaders";

async function fetchEquipment() {
  const res = await fetch(`${API_BASE}/equipment`);
  if (!res.ok) throw new Error("Erro ao buscar equipamentos");
  return res.json();
}

interface Equipment {
  id: number;
  category: string;
  name: string;
  brand: string;
  model: string;
  quantity: number;
  image: string;
  operational: boolean;
}

interface GroupedCategory {
  category: string;
  items: Equipment[];
}

function groupByCategory(data: Equipment[]): GroupedCategory[] {
  const grouped: Record<string, Equipment[]> = {};
  data.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items,
  }));
}

export default function EquipmentsPage() {
  const { user } = useUser();
  const [search, setSearch] = createSignal("");
  const [selectedEquipment, setSelectedEquipment] =
    createSignal<Equipment | null>(null);
  const [formData, setFormData] = createSignal<Partial<Equipment>>({});
  const [equipment, { refetch }] = createResource<Equipment[]>(fetchEquipment);
  const [isFormOpen, setIsFormOpen] = createSignal(false);

  const filteredData = createMemo(() => {
    const query = search().toLowerCase();
    const rawData = equipment();
    if (!rawData) return [];

    const grouped = groupByCategory(rawData);
    return grouped
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  });

  async function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja deletar este equipamento?")) {
      await fetch(`${API_BASE}/equipment/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      refetch();
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const method = selectedEquipment() ? "PUT" : "POST";
    const url = selectedEquipment()
      ? `${API_BASE}/equipment/${selectedEquipment()!.id}`
      : `${API_BASE}/equipment`;

    const dataToSend = { ...formData() };

    // Se for POST (criar), remova o `id` se ele existir
    if (method === "POST") {
      delete dataToSend.id;
    }

    await fetch(url, {
      method,
      headers: jsonHeaders,
      body: JSON.stringify(dataToSend),
    });

    setSelectedEquipment(null);
    setFormData({});
    refetch();
    setIsFormOpen(false);
  }

  function openForm(equipment?: Equipment) {
    if (equipment) {
      setSelectedEquipment(equipment);
      setFormData(equipment);
    } else {
      setSelectedEquipment(null);
      setFormData({});
    }
    setIsFormOpen(true);
  }

  return (
    <Layout>
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Equipamentos</h1>
        <input
          type="text"
          placeholder="Buscar por nome..."
          class="mb-6 w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none"
          onInput={(e) => setSearch(e.currentTarget.value)}
        />

        <Show when={user()?.isAdmin}>
          <button
            class="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => openForm()}
          >
            Cadastrar Novo Equipamento
          </button>
        </Show>

        <Show when={equipment()} fallback={<p>Carregando equipamentos...</p>}>
          <>
            <For
              each={filteredData()}
              fallback={<p>Nenhum equipamento encontrado.</p>}
            >
              {(category) => (
                <div class="mb-10">
                  <h2 class="text-xl font-semibold mb-4">
                    {category.category}
                  </h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <For each={category.items}>
                      {(item) => (
                        <div class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white text-black dark:bg-zinc-900 dark:text-white">
                          <img
                            src={
                              item.image ||
                              "https://img.icons8.com/ios7/600w/no-image.png"
                            }
                            alt={item.name}
                            class="w-full h-40 object-contain mb-2"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://img.icons8.com/ios7/600w/no-image.png")
                            }
                          />
                          <h3 class="text-lg font-bold">{item.name}</h3>
                          <p class="text-sm">
                            <strong>Marca:</strong> {item.brand}
                          </p>
                          <p class="text-sm">
                            <strong>Modelo:</strong> {item.model}
                          </p>
                          <p class="text-sm">
                            <strong>Quantidade:</strong> {item.quantity}
                          </p>
                          <Show when={!item.operational}>
                            <span class="inline-block mt-2 text-sm bg-red-500 text-white px-2 py-1 rounded">
                              Fora de operação
                            </span>
                          </Show>

                          <Show when={user()?.isAdmin}>
                            <div class="flex gap-2 mt-2">
                              <button
                                class="text-sm text-yellow-500 hover:underline"
                                onClick={() => openForm(item)}
                              >
                                Editar
                              </button>
                              <button
                                class="text-sm text-red-500 hover:underline"
                                onClick={() => handleDelete(item.id)}
                              >
                                Deletar
                              </button>
                            </div>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </>
        </Show>

        <Show when={isFormOpen()}>
          <div
            class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
            onClick={() => {
              setSelectedEquipment(null);
              setFormData({});
              setIsFormOpen(false);
            }}
          >
            <form
              class="bg-white dark:bg-zinc-900 p-6 rounded shadow-md w-full max-w-md"
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 class="text-xl font-bold mb-4">
                {selectedEquipment()
                  ? "Editar Equipamento"
                  : "Novo Equipamento"}
              </h2>

              <div class="space-y-2">
                <input
                  class="w-full border px-3 py-2 rounded"
                  placeholder="Nome"
                  value={formData().name || ""}
                  onInput={(e) =>
                    setFormData({ ...formData(), name: e.currentTarget.value })
                  }
                  required
                />
                <input
                  class="w-full border px-3 py-2 rounded"
                  placeholder="Marca"
                  value={formData().brand || ""}
                  onInput={(e) =>
                    setFormData({ ...formData(), brand: e.currentTarget.value })
                  }
                />
                <input
                  class="w-full border px-3 py-2 rounded"
                  placeholder="Modelo"
                  value={formData().model || ""}
                  onInput={(e) =>
                    setFormData({ ...formData(), model: e.currentTarget.value })
                  }
                />
                <input
                  class="w-full border px-3 py-2 rounded"
                  placeholder="Imagem (URL)"
                  value={formData().image || ""}
                  onInput={(e) =>
                    setFormData({ ...formData(), image: e.currentTarget.value })
                  }
                />
                <input
                  class="w-full border px-3 py-2 rounded"
                  type="number"
                  placeholder="Quantidade"
                  value={formData().quantity || 0}
                  onInput={(e) =>
                    setFormData({
                      ...formData(),
                      quantity: Number(e.currentTarget.value),
                    })
                  }
                />
                <input
                  class="w-full border px-3 py-2 rounded"
                  placeholder="Categoria"
                  value={formData().category || ""}
                  onInput={(e) =>
                    setFormData({
                      ...formData(),
                      category: e.currentTarget.value,
                    })
                  }
                />
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData().operational ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData(),
                        operational: e.currentTarget.checked,
                      })
                    }
                  />
                  Em operação
                </label>
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEquipment(null);
                    setFormData({});
                    setIsFormOpen(false);
                  }}
                  class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
      </div>
    </Layout>
  );
}

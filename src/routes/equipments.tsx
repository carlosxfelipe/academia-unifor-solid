import { createSignal, createMemo, createResource, For, Show } from "solid-js";
import Layout from "~/components/Layout";

async function fetchEquipment() {
  const res = await fetch(
    "https://academia-unifor-fastapi.onrender.com/equipment"
  );
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
  const [search, setSearch] = createSignal("");
  const [equipment] = createResource<Equipment[]>(fetchEquipment);

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

  return (
    <Layout fluid>
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Equipamentos</h1>
        <input
          type="text"
          placeholder="Buscar por nome..."
          class="mb-6 w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none"
          onInput={(e) => setSearch(e.currentTarget.value)}
        />

        <Show
          when={equipment()}
          fallback={
            <div class="min-h-[500px] flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">Carregando...</p>
            </div>
          }
        >
          <For
            each={filteredData()}
            fallback={<p>Nenhum equipamento encontrado.</p>}
          >
            {(category) => (
              <div class="mb-10">
                <h2 class="text-xl font-semibold mb-4">{category.category}</h2>
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
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </Layout>
  );
}

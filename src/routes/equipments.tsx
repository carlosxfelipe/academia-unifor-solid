import { createSignal, createMemo } from "solid-js";
import Layout from "~/components/Layout";
import equipmentData from "../../mocks/equipment.json";

export default function EquipmentsPage() {
  const [search, setSearch] = createSignal("");

  const filteredData = createMemo(() => {
    const query = search().toLowerCase();
    return equipmentData.gymEquipment
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
          class="mb-6 w-full p-2 rounded border border-gray-300"
          onInput={(e) => setSearch(e.currentTarget.value)}
        />

        {filteredData().map((category) => (
          <div class="mb-10">
            <h2 class="text-xl font-semibold mb-4">{category.category}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <div class="border rounded-lg p-4 shadow bg-white text-black dark:bg-black dark:text-white">
                  <img
                    src={item.image}
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
                  {item.operational === false && (
                    <span class="inline-block mt-2 text-sm bg-red-500 text-white px-2 py-1 rounded">
                      Fora de operação
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

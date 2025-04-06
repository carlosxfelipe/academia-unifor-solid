import { createSignal, onCleanup } from "solid-js";

function getStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  const time = now.getHours() * 60 + now.getMinutes();

  const openingWeek = 5 * 60 + 30; // 5:30 AM
  const closingWeek = 22 * 60 + 30; // 10:30 PM
  const openingSat = 8 * 60; // 8:00 AM
  const closingSat = 12 * 60; // 12:00 PM

  if (day >= 1 && day <= 5) {
    if (time >= openingWeek && time <= closingWeek) {
      return "Aberta";
    }
  } else if (day === 6) {
    if (time >= openingSat && time <= closingSat) {
      return "Aberta";
    }
  }

  return "Fechada";
}

export default function StatusIndicator() {
  const [status, setStatus] = createSignal(getStatus());

  const interval = setInterval(() => {
    setStatus(getStatus());
  }, 60000); // Atualiza a cada 1 minuto

  onCleanup(() => clearInterval(interval));

  return (
    <div class="mt-4 mb-4 text-center">
      <div
        class={`p-4 rounded-md ${
          status() === "Aberta"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        Academia está atualmente: <strong>{status()}</strong>
      </div>
    </div>
  );
}

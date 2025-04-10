import { createSignal, onCleanup } from "solid-js";

function getStatusAndTimeLeft() {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openingWeek = 5 * 60 + 30; // 5:30 AM
  const closingWeek = 22 * 60 + 30; // 10:30 PM
  const openingSat = 8 * 60; // 8:00 AM
  const closingSat = 12 * 60; // 12:00 PM

  let isOpen = false;
  let minutesLeft = 0;

  if (day >= 1 && day <= 5) {
    if (currentMinutes >= openingWeek && currentMinutes <= closingWeek) {
      isOpen = true;
      minutesLeft = closingWeek - currentMinutes;
    }
  } else if (day === 6) {
    if (currentMinutes >= openingSat && currentMinutes <= closingSat) {
      isOpen = true;
      minutesLeft = closingSat - currentMinutes;
    }
  }

  return {
    status: isOpen ? "Aberta" : "Fechada",
    timeLeft: isOpen ? minutesLeft : null,
  };
}

export default function StatusIndicator() {
  const [statusInfo, setStatusInfo] = createSignal(getStatusAndTimeLeft());

  const interval = setInterval(() => {
    setStatusInfo(getStatusAndTimeLeft());
  }, 60000); // atualiza a cada 1 min

  onCleanup(() => clearInterval(interval));

  const formatTimeLeft = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}min`;
  };

  return (
    <div class="mt-4 mb-4 text-center">
      <div
        class={`p-4 rounded-md ${
          statusInfo().status === "Aberta"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        Academia está atualmente: <strong>{statusInfo().status}</strong>
        {statusInfo().status === "Aberta" && (
          <div class="mt-1 text-sm">
            Fecha em: <strong>{formatTimeLeft(statusInfo().timeLeft!)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

import { createSignal, Show } from "solid-js";
import { Send, MessageCircle } from "lucide-solid";

export default function FloatingChat() {
  const [open, setOpen] = createSignal(false);
  const [messages, setMessages] = createSignal([
    {
      sender: "Bot",
      message: getGreeting() + " Qual a sua dúvida relacionada a exercícios?",
    },
  ]);
  const [input, setInput] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  async function sendMessage() {
    const trimmed = input().trim();
    if (!trimmed) return;

    setMessages([...messages(), { sender: "Você", message: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://academia-unifor-fastapi.onrender.com/gemini/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: trimmed }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const reply =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Resposta indisponível.";
        setMessages([...messages(), { sender: "Bot", message: reply }]);
      } else {
        setMessages([
          ...messages(),
          { sender: "Bot", message: "Erro ao obter resposta." },
        ]);
      }
    } catch (e) {
      setMessages([
        ...messages(),
        { sender: "Bot", message: "Erro de conexão com o servidor." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div class="fixed bottom-5 right-5 z-50">
      <Show when={!open()}>
        <button
          onClick={() => setOpen(true)}
          class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105"
        >
          <MessageCircle size={26} />
        </button>
      </Show>

      <Show when={open()}>
        <div class="w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col animate-fade-in">
          <div class="flex justify-between items-center bg-blue-600 text-white px-4 py-3 rounded-t-2xl">
            <span class="font-semibold">Chat com a Academia</span>
            <button
              onClick={() => setOpen(false)}
              class="hover:bg-blue-700 hover:scale-105 px-2 py-1 rounded transition"
            >
              ✖
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-2">
            {messages().map((msg) => (
              <div
                class={`text-sm ${
                  msg.sender === "Você" ? "text-right" : "text-left"
                }`}
              >
                <div
                  class={`inline-block px-3 py-2 rounded-xl ${
                    msg.sender === "Você"
                      ? "bg-blue-100 dark:bg-blue-700 text-blue-900 dark:text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              </div>
            ))}
            {isLoading() && (
              <div class="text-center text-sm text-gray-500">Carregando...</div>
            )}
          </div>

          <div class="p-3 border-t dark:border-gray-700 flex gap-2">
            <input
              type="text"
              class="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none"
              placeholder="Digite aqui..."
              value={input()}
              onInput={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full transition disabled:opacity-50"
              disabled={isLoading()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia!";
  if (hour < 18) return "Boa tarde!";
  return "Boa noite!";
}

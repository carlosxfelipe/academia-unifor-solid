import { createSignal, Show } from "solid-js";
import { Send, MessageCircle } from "lucide-solid";
import "./FloatingChat.css";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: trimmed }] }],
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
    <div class="fixed bottom-4 right-4 z-50">
      {/* Botão para abrir */}
      <Show when={!open()}>
        <button
          onClick={() => setOpen(true)}
          class="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle size={24} />
        </button>
      </Show>

      {/* Janela de chat */}
      <Show when={open()}>
        <div class="w-80 h-96 bg-white dark:bg-gray-800 border rounded-xl shadow-lg flex flex-col">
          <div class="flex justify-between items-center bg-blue-600 text-white px-4 py-2 rounded-t-xl">
            <span>Chat</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div class="flex-1 overflow-y-auto p-2 space-y-2">
            {messages().map((msg) => (
              <div
                class={`self-${
                  msg.sender === "Você" ? "end text-right" : "start"
                }`}
              >
                <div
                  class={`inline-block p-2 rounded-xl text-sm ${
                    msg.sender === "Você"
                      ? "bg-blue-200 dark:bg-blue-700"
                      : "bg-gray-300 dark:bg-gray-700"
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

          <div class="p-2 border-t flex gap-2">
            <input
              type="text"
              class="flex-1 p-2 rounded-lg border dark:bg-gray-900 dark:text-white"
              placeholder="Digite sua pergunta..."
              value={input()}
              onInput={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              class="bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600"
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

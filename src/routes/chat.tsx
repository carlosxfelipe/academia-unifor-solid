import { createSignal } from "solid-js";
import { Send } from "lucide-solid";
import Layout from "~/components/Layout";

export default function ChatPage() {
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
    <Layout fluid>
      <h1 class="text-2xl font-bold mb-4 text-center">
        Pergunte sobre Treinos
      </h1>
      <div class="flex flex-col gap-4 max-w-2xl mx-auto">
        <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {messages().map((msg) => (
            <div
              class={`self-${msg.sender === "Você" ? "end" : "start"} bg-${
                msg.sender === "Você"
                  ? "blue-200 dark:bg-blue-700"
                  : "gray-300 dark:bg-gray-700"
              } p-3 rounded-xl text-sm`}
            >
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>

        {isLoading() && (
          <div class="text-center text-gray-500">Carregando...</div>
        )}

        <div class="flex gap-2">
          <input
            type="text"
            class="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
            placeholder="Digite sua pergunta..."
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading()}
          >
            <Send size={20} />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia!";
  if (hour < 18) return "Boa tarde!";
  return "Boa noite!";
}

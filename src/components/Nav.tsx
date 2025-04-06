import { useLocation } from "@solidjs/router";
import { Home, Info } from "lucide-solid";

export default function Nav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "border-blue-200"
      : "border-transparent hover:border-blue-200";

  return (
    <nav class="bg-blue-500">
      <div class="w-full flex items-center justify-between p-3 text-white">
        <span class="text-2xl font-bold tracking-wide">Academia Unifor</span>
        <ul class="flex items-center space-x-6">
          <li class={`border-b-2 ${active("/")}`}>
            <a href="/" class="flex items-center gap-1">
              <Home size={18} /> Home
            </a>
          </li>
          <li class={`border-b-2 ${active("/about")}`}>
            <a href="/about" class="flex items-center gap-1">
              <Info size={18} /> Sobre
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

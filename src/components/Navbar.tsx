import { useLocation } from "@solidjs/router";
import { Home, User, LogOut } from "lucide-solid";
import { UniforLogo } from "./UniforLogo";

export default function Navbar() {
  const location = useLocation();

  const active = (path: string) =>
    path === location.pathname
      ? "border-blue-200"
      : "border-transparent hover:border-blue-200";

  return (
    <nav class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl transition-all duration-300">
      <div class="w-full flex items-center justify-between p-3 text-gray-900 dark:text-white">
        <span class="flex items-center text-2xl font-bold tracking-wide">
          <UniforLogo height={40} color="currentColor" />
          <span class="ml-2">Academia</span>
        </span>
        <ul class="flex items-center space-x-6">
          <li class={`border-b ${active("/home")}`}>
            <a href="/home" class="flex items-center gap-1">
              <Home size={18} />
              <span class="hidden sm:inline">Início</span>
            </a>
          </li>
          <li class={`border-b ${active("/profile")}`}>
            <a href="/profile" class="flex items-center gap-1">
              <User size={18} />
              <span class="hidden sm:inline">Perfil</span>
            </a>
          </li>
          <li class="border-b border-transparent hover:border-blue-200">
            <a href="/login" class="flex items-center gap-1">
              <LogOut size={18} />
              <span class="hidden sm:inline">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

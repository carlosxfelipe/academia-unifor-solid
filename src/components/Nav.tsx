import { useLocation } from "@solidjs/router";
import { Home, User, LogOut } from "lucide-solid";

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
          <li class={`border-b-2 ${active("/home")}`}>
            <a href="/home" class="flex items-center gap-1">
              <Home size={18} /> Início
            </a>
          </li>
          <li class={`border-b-2 ${active("/profile")}`}>
            <a href="/profile" class="flex items-center gap-1">
              <User size={18} /> Perfil
            </a>
          </li>
          <li class="border-b-2 border-transparent hover:border-blue-200">
            <a href="/login" class="flex items-center gap-1">
              <LogOut size={18} /> Sair
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

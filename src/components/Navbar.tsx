import { useLocation, useNavigate } from "@solidjs/router";
import { Home, User, LogOut, Dumbbell, Settings } from "lucide-solid";
import { UniforLogo } from "./UniforLogo";
import { useUser } from "~/contexts/UserContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const active = (path: string) =>
    path === location.pathname
      ? "border-blue-200"
      : "border-transparent hover:border-blue-200";

  const logout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <nav class="bg-blue-700 text-white backdrop-blur-xl shadow-xl transition-all duration-300">
      <div class="w-full flex items-center justify-between p-3">
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
          <li class={`border-b ${active("/equipments")}`}>
            <a href="/equipments" class="flex items-center gap-1">
              <Dumbbell size={18} />
              <span class="hidden sm:inline">Equipamentos</span>
            </a>
          </li>
          <li class={`border-b ${active("/profile")}`}>
            <a href="/profile" class="flex items-center gap-1">
              <User size={18} />
              <span class="hidden sm:inline">Perfil</span>
            </a>
          </li>
          <li class="border-b border-transparent hover:border-blue-200">
            <button
              onClick={logout}
              class="flex items-center gap-1 focus:outline-none"
            >
              <LogOut size={18} />
              <span class="hidden sm:inline">Sair</span>
            </button>
          </li>
          {user?.isAdmin && (
            <li class={`border-b ${active("/admin")}`}>
              <a href="/admin" class="flex items-center gap-1">
                <Settings size={18} />
                <span class="hidden sm:inline">Admin</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

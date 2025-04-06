import { Phone, Briefcase, Headphones, FileText, Shield } from "lucide-solid";
import { UniforLogo } from "./UniforLogo";

export default function Footer() {
  return (
    <footer class="bg-blue-700 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Ícones à esquerda */}
        <div class="flex space-x-4">
          <a href="#" aria-label="Fale Conosco" class="hover:text-gray-300">
            <Phone size={18} />
          </a>
          <a href="#" aria-label="Trabalhe Conosco" class="hover:text-gray-300">
            <Briefcase size={18} />
          </a>
          <a href="#" aria-label="Suporte Ao Vivo" class="hover:text-gray-300">
            <Headphones size={18} />
          </a>
          <a
            href="#"
            aria-label="Contratos e Licenças"
            class="hover:text-gray-300"
          >
            <FileText size={18} />
          </a>
          <a
            href="#"
            aria-label="Política de Privacidade"
            class="hover:text-gray-300"
          >
            <Shield size={18} />
          </a>
        </div>

        {/* Texto ao centro */}
        <div class="text-center text-sm leading-5 mt-4 md:mt-0 md:flex-1 md:px-8">
          <p>Fundação Edson Queiroz | Universidade de Fortaleza</p>
          <p>
            Central de Atendimento: (85) 3477-3000 | (85) 99246-6625 (WhatsApp)
          </p>
          <p>
            Av. Washington Soares, 1321 - Edson Queiroz - CEP 60811-905 -
            Fortaleza / CE - Brasil
          </p>
        </div>

        {/* Logo à direita */}
        <div class="mt-4 md:mt-0">
          <UniforLogo height={50} color="currentColor" />
        </div>
      </div>
    </footer>
  );
}

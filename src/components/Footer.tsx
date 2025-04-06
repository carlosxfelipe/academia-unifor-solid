export default function Footer() {
  return (
    <footer class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-xl transition-all duration-300">
      <div class="w-full flex flex-col items-center justify-center p-3 text-gray-900 dark:text-white">
        <p class="mt-2 text-sm">
          &copy; {new Date().getFullYear()} Unifor Academia. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}

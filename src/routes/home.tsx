import Nav from "~/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main class="text-gray-700 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center">
        <div class="p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-7xl w-full mx-auto mt-4">
          <h1 class="text-5xl text-blue-500 dark:text-blue-400 font-bold mb-8 text-left">
            Bem-vindo a Início!
          </h1>

          <p class="mt-4 mb-8 text-gray-700 dark:text-gray-300 text-left">
            Nisi minim et anim sint qui et proident cillum.
          </p>
        </div>
      </main>
    </>
  );
}

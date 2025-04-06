import { A } from "@solidjs/router";

export default function About() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4 bg-gray-100 min-h-screen">
      <div class="p-12 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-16">
        <h1 class="text-5xl text-blue-500 font-bold mb-8">Sobre o Projeto</h1>
        <p class="mt-4 mb-8 text-gray-700">
          Visite{" "}
          <a
            href="https://solidjs.com"
            target="_blank"
            class="text-blue-500 hover:underline"
          >
            solidjs.com
          </a>{" "}
          para aprender como construir apps com SolidJS.
        </p>
        <p class="my-4 text-gray-700">
          <A href="/" class="text-blue-500 hover:underline">
            Home
          </A>
          {" - "}
          <span>About Page</span>
        </p>
      </div>
    </main>
  );
}

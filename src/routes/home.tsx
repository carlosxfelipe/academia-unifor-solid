import Nav from "~/components/Nav";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

export default function Home() {
  return (
    <>
      <Nav />
      <main class="text-gray-700 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center">
        <div class="p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-7xl w-full mx-auto mt-4">
          <Heading level={1}>Bem-vindo a Perfil!</Heading>

          <Paragraph>Nisi minim et anim sint qui et proident cillum.</Paragraph>
        </div>
      </main>
    </>
  );
}

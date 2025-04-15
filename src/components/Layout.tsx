import { Component } from "solid-js";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingChat from "./FloatingChat";

interface LayoutProps {
  children: any;
  fluid?: boolean; // desliga apenas os estilos de largura máxima
  unstyled?: boolean; // desliga todos os estilos
}

const Layout: Component<LayoutProps> = (props) => {
  if (props.unstyled) {
    return (
      <>
        <Navbar />
        {props.children}
        <Footer />
        <FloatingChat />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main class="text-gray-700 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center">
        <div
          class={`p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md ${
            props.fluid ? "" : "max-w-7xl w-full mx-auto"
          } mt-4`}
        >
          {props.children}
        </div>
      </main>
      <Footer />
      <FloatingChat />
    </>
  );
};

export default Layout;

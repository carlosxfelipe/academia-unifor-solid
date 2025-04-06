import { Component } from "solid-js";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: any;
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <>
      <Navbar />
      <main class="text-gray-700 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center">
        <div class="p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-7xl w-full mx-auto mt-4">
          {props.children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;

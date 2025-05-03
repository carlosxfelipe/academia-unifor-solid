import { createSignal, onCleanup, onMount } from "solid-js";

export function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = createSignal(false);

  const checkMobile = () => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
    }
  };

  onMount(() => {
    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", checkMobile);
    }
  });

  return isMobile;
}

import { createSignal, onCleanup, onMount } from "solid-js";

export function useIsMobile(breakpoint = 480) {
  const [isMobile, setIsMobile] = createSignal(false);

  const checkMobile = () => {
    setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
  };

  onMount(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onCleanup(() => {
    window.removeEventListener("resize", checkMobile);
  });

  return isMobile;
}

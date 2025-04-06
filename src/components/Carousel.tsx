import { createSignal, onMount, onCleanup } from "solid-js";

const images = [
  "/001.jpg",
  "/002.jpg",
  "/003.jpg",
  "/004.jpg",
  "/005.jpg",
  "/006.jpg",
];

export const Carousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  let intervalId: number;

  onMount(() => {
    intervalId = setInterval(() => {
      setCurrentImageIndex((index) => (index + 1) % images.length);
    }, 3000);
  });

  onCleanup(() => clearInterval(intervalId));

  return (
    <div class="overflow-hidden w-full h-64 my-4">
      <div
        class="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentImageIndex() * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            src={img}
            alt={`Imagem ${index + 1}`}
            class="w-full h-64 object-cover flex-shrink-0 rounded-lg opacity-60"
          />
        ))}
      </div>
    </div>
  );
};

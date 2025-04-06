import { createEffect } from "solid-js";

export default function NotFound() {
  createEffect(() => {
    window.location.href = "/login";
  });

  return null;
}

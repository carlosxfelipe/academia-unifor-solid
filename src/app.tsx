import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { UserProvider } from "./contexts/UserContext";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <UserProvider>
          <Suspense>{props.children}</Suspense>
        </UserProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

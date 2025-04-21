import { createContext, useContext, createSignal, JSX } from "solid-js";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  [key: string]: any;
};

type UserContextType = {
  user: () => User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>();

export function UserProvider(props: { children: JSX.Element }) {
  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const [user, setUser] = createSignal<User | null>(storedUser);

  const setAndPersistUser = (newUser: User | null) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: setAndPersistUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }

  return {
    user: context.user(),
    setUser: context.setUser,
  };
}

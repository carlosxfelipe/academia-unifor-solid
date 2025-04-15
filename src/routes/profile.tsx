import Layout from "~/components/Layout";
import { useUser } from "~/contexts/UserContext";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <Layout>
        <p>Usuário não autenticado</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div class="text-center">
        <img src={user.avatarUrl} class="w-24 h-24 mx-auto rounded-full mb-4" />
        <h2 class="text-xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>
    </Layout>
  );
}

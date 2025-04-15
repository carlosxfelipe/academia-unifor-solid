import Layout from "~/components/Layout";
import { useUser } from "~/contexts/UserContext";

type Exercise = {
  name: string;
  reps?: string;
  notes?: string;
};

type Workout = {
  name: string;
  description?: string;
  exercises: Exercise[];
};

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
      <div class="text-center mb-8">
        <img src={user.avatarUrl} class="w-24 h-24 mx-auto rounded-full mb-4" />
        <h2 class="text-xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>

      <div class="space-y-6">
        {user.workouts?.length > 0 ? (
          user.workouts.map((workout: Workout) => (
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {workout.name}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {workout.description}
              </p>
              <ul class="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
                {workout.exercises.map((ex) => (
                  <li>
                    <strong>{ex.name}</strong>
                    {ex.reps && ` — ${ex.reps}`}
                    {ex.notes && (
                      <span class="block text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {ex.notes}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p class="text-center text-gray-500">Nenhum treino cadastrado.</p>
        )}
      </div>
    </Layout>
  );
}

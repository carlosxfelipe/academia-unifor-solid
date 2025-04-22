import Layout from "~/components/Layout";
import { useUser } from "~/contexts/UserContext";
import { Mail, Phone, MapPin, Calendar, ShieldCheck } from "lucide-solid";

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
      <div class="bg-slate-50 dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-10 transition-colors">
        <div class="flex flex-col items-center text-center">
          <img
            src={user.avatarUrl || "/avatar.jpg"}
            alt={user.name}
            class="w-28 h-28 rounded-full shadow-md mb-4"
          />
          <h2 class="text-2xl font-bold mb-1">{user.name}</h2>
          {user.isAdmin && (
            <div class="flex items-center text-blue-500 text-sm font-semibold mt-1">
              <ShieldCheck class="w-4 h-4 mr-1" />
              Administrador
            </div>
          )}
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-gray-700 dark:text-gray-300">
          {user.email && (
            <div class="flex items-center">
              <Mail class="w-5 h-5 mr-2 text-blue-500" />
              <span>{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div class="flex items-center">
              <Phone class="w-5 h-5 mr-2 text-blue-500" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.address && (
            <div class="flex items-center">
              <MapPin class="w-5 h-5 mr-2 text-blue-500" />
              <span>{user.address}</span>
            </div>
          )}
          {user.birthDate && (
            <div class="flex items-center">
              <Calendar class="w-5 h-5 mr-2 text-blue-500" />
              <span>{user.birthDate}</span>
            </div>
          )}
        </div>
      </div>

      <div class="space-y-8">
        {user.workouts?.length > 0 ? (
          user.workouts.map((workout: Workout) => (
            <div class="bg-slate-50 dark:bg-gray-900 p-6 rounded-xl shadow-md transition-colors">
              <h3 class="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                {workout.name}
              </h3>
              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {workout.description}
              </p>
              <ul class="list-disc list-inside space-y-3 text-base text-gray-800 dark:text-gray-200">
                {workout.exercises.map((ex) => (
                  <li>
                    <strong>{ex.name}</strong>
                    {ex.reps && ` — ${ex.reps}`}
                    {ex.notes && (
                      <p class="text-sm text-gray-500 dark:text-gray-400 ml-2 mt-1">
                        {ex.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p class="text-center text-gray-500 text-lg">
            Nenhum treino cadastrado.
          </p>
        )}
      </div>
    </Layout>
  );
}

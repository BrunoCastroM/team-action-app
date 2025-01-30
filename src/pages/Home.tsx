import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

type TeamCount = {
  teamId: string;
  total: number;
};

type CategoryTime = {
  category: string;
  totalTime: number;
};

export default function Home() {
  const [nextTrainings, setNextTrainings] = useState<any[]>([]);
  const [trainingsCount, setTrainingsCount] = useState<TeamCount[]>([]);
  const [exercisesTime, setExercisesTime] = useState<CategoryTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  async function fetchAllDashboardData() {
    try {
      setLoading(true);
      // 1) Próximos treinos
      const resNext = await api.get('/trainings/next', { params: { limit: 5 } });
      setNextTrainings(resNext.data);

      // 2) Stats: Treinos por team
      const resCount = await api.get('/stats/trainingsCountByTeam');
      setTrainingsCount(resCount.data);

      // 3) Stats: tempo de exercícios por categoria
      const resTime = await api.get('/stats/exercisesTimeByCategory');
      setExercisesTime(resTime.data);
    } catch (err: any) {
      toast.error(`Erro ao carregar Dashboard: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Carregando Dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Próximos Treinos */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Próximos Treinos</h2>
        {nextTrainings.length === 0 ? (
          <p>Nenhum treino futuro encontrado.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {nextTrainings.map((t) => (
              <li key={t.id} className="border p-2 rounded bg-white">
                <strong>{t.title}</strong> — {t.team?.name && <span>{t.team.name}</span>} <br />
                Início: {new Date(t.startDate).toLocaleString()} | Fim:{' '}
                {new Date(t.endDate).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Stats: Treinos por team */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Treinos por Time</h2>
        {trainingsCount.length === 0 ? (
          <p>Nenhum registro.</p>
        ) : (
          <table className="min-w-full border bg-white">
            <thead>
              <tr>
                <th className="p-2 border">Team ID</th>
                <th className="p-2 border">Total Treinos</th>
              </tr>
            </thead>
            <tbody>
              {trainingsCount.map((item) => (
                <tr key={item.teamId}>
                  <td className="p-2 border">{item.teamId}</td>
                  <td className="p-2 border">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Stats: Tempo de Exercícios por categoria */}
      <section className="mb-8">
        <h2 className="text-xl font-bold">Tempo de Exercícios por Categoria</h2>
        {exercisesTime.length === 0 ? (
          <p>Nenhum exercício encontrado.</p>
        ) : (
          <table className="min-w-full border bg-white">
            <thead>
              <tr>
                <th className="p-2 border">Categoria</th>
                <th className="p-2 border">Total (min)</th>
              </tr>
            </thead>
            <tbody>
              {exercisesTime.map((cat) => (
                <tr key={cat.category}>
                  <td className="p-2 border">{cat.category}</td>
                  <td className="p-2 border">{cat.totalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

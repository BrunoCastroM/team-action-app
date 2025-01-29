// src/pages/stats/StatsPage.tsx

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Import das libs do Recharts
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Tipos (ajuste como quiser)
type TrainingsCount = {
  teamId: string;
  teamName: string;
  total: number;
};

type ExercisesTime = {
  category: string;
  totalTime: number;
};

type ExercisesCount = {
  category: string;
  total: number;
};

type ExercisesAvgTime = {
  category: string;
  avgTime: number;
};

type AttendanceByTeam = {
  teamId: string;
  teamName: string;
  presente: number;
  ausente: number;
  justificado: number;
};

export default function StatsPage() {
  const [trainingsCount, setTrainingsCount] = useState<TrainingsCount[]>([]);
  const [exercisesTime, setExercisesTime] = useState<ExercisesTime[]>([]);
  const [exercisesCount, setExercisesCount] = useState<ExercisesCount[]>([]);
  const [exercisesAvg, setExercisesAvg] = useState<ExercisesAvgTime[]>([]);
  const [attendanceTeam, setAttendanceTeam] = useState<AttendanceByTeam[]>([]);

  const [loading, setLoading] = useState(true);

  // Cores para gráficos
  const COLORS = ['#8884D8', '#82CA9D', '#FFBB28', '#FF8042', '#66CCFF', '#FF6666'];

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      // 1) treinos por time
      const res1 = await api.get('/stats/trainingsCountByTeam');
      setTrainingsCount(res1.data); // => [ { teamId, teamName, total }, ... ]

      // 2) tempo total de exercícios por categoria
      const res2 = await api.get('/stats/exercisesTimeByCategory');
      setExercisesTime(res2.data); // => [ { category, totalTime }, ... ]

      // 3) total de Exercícios por categoria
      const res3 = await api.get('/stats/exercisesCountByCategory');
      setExercisesCount(res3.data); // => [ { category, total }, ... ]

      // 4) média de tempo de Exercícios (suggestedTime) por categoria
      const res4 = await api.get('/stats/avgExerciseTimeByCategory');
      setExercisesAvg(res4.data); // => [ { category, avgTime }, ... ]

      // 5) attendance por time
      const res5 = await api.get('/stats/attendanceByTeam');
      setAttendanceTeam(res5.data); // => [ { teamId, teamName, presente, ausente, justificado }, ... ]
    } catch (err: any) {
      toast.error(`Erro ao buscar estatísticas: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Carregando estatísticas...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estatísticas</h1>

      {/* 1) TABELA: Treinos por Time com nome do time */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Treinos por Time</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Total Treinos</th>
            </tr>
          </thead>
          <tbody>
            {trainingsCount.map((tc) => (
              <tr key={tc.teamId} className="border-b">
                <td className="p-2">{tc.teamName}</td>
                <td className="p-2">{tc.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2) GRÁFICO: Tempo de Exercícios por Categoria (PieChart) */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Tempo de Exercícios (min) por Categoria</h2>
        {/* Preparando data p/ Recharts */}
        <PieChart width={400} height={300}>
          <Pie
            data={exercisesTime}
            dataKey="totalTime"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {exercisesTime.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </section>

      {/* 3) CARDS: Total de Exercícios por Categoria */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Quantidade de Exercícios por Categoria</h2>
        <div className="grid grid-cols-3 gap-4">
          {exercisesCount.map((ec) => (
            <div
              key={ec.category}
              className="bg-white border rounded shadow p-4 flex flex-col items-center"
            >
              <div className="text-md font-semibold mb-2">{ec.category}</div>
              <div className="text-2xl font-bold">{ec.total}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GRÁFICO: Média de Tempo (suggestedTime) por Categoria (BarChart) */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Média de Tempo por Categoria (min)</h2>
        <BarChart
          width={500}
          height={300}
          data={exercisesAvg}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgTime" fill="#8884d8" />
        </BarChart>
      </section>

      {/* TABELA: Presença por Time (exibe teamName)*/}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Presenças/Ausências por Time</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Presente</th>
              <th className="p-2 text-left">Ausente</th>
              <th className="p-2 text-left">Justificado</th>
            </tr>
          </thead>
          <tbody>
            {attendanceTeam.map((a) => (
              <tr key={a.teamId} className="border-b">
                <td className="p-2">{a.teamName}</td>
                <td className="p-2">{a.presente}</td>
                <td className="p-2">{a.ausente}</td>
                <td className="p-2">{a.justificado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

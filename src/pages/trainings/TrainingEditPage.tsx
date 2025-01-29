import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

type Team = { id: string; name: string };
type Pavilion = { id: string; name: string };

export default function TrainingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States para selects e inputs
  const [teams, setTeams] = useState<Team[]>([]);
  const [pavilions, setPavilions] = useState<Pavilion[]>([]);

  // Campos do form
  const [teamId, setTeamId] = useState('');
  const [pavilionId, setPavilionId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [repeatType, setRepeatType] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(
    'none'
  );
  const [repeatUntil, setRepeatUntil] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega a lista de teams e pavilions
    api
      .get('/teams')
      .then((resp) => setTeams(resp.data))
      .catch((err) => console.error(err));

    api
      .get('/pavilions')
      .then((resp) => setPavilions(resp.data))
      .catch((err) => console.error(err));

    if (!id) {
      setLoading(false);
      return;
    }

    // Carregar dados do treino
    api
      .get(`/trainings/${id}`)
      .then((resp) => {
        const tr = resp.data;
        // Ajustar states
        setTeamId(tr.teamId);
        setPavilionId(tr.pavilionId || '');
        setTitle(tr.title);
        setDescription(tr.description || '');
        // Ajustar datas
        // se "tr.startDate" for 2025-02-20T17:00:00.000Z => .slice(0,16) => '2025-02-20T17:00'
        setStartDate(tr.startDate.slice(0, 16));
        setEndDate(tr.endDate.slice(0, 16));
        setRepeatType(tr.repeatType || 'none');
        // Se houver repeatUntil
        if (tr.repeatUntil) {
          // .toISOString().slice(0,10) => 'YYYY-MM-DD'
          const isoDate = new Date(tr.repeatUntil).toISOString().slice(0, 10);
          setRepeatUntil(isoDate);
        }
      })
      .catch((err) => {
        toast.error(`Erro ao buscar treino: ${err.response?.data?.error || err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    try {
      await api.put(`/trainings/${id}`, {
        teamId,
        pavilionId: pavilionId || null,
        title,
        description: description || null,
        startDate,
        endDate,
        repeatType,
        repeatUntil: repeatUntil ? repeatUntil : null,
      });
      toast.success('Treino atualizado!');
      navigate('/trainings');
    } catch (err: any) {
      toast.error(`Erro ao atualizar treino: ${err.response?.data?.error || err.message}`);
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Editar Treino</h1>
      <form onSubmit={handleUpdate} className="max-w-sm space-y-4">
        {/* Selecione Equipe */}
        <div>
          <label className="block mb-1 text-gray-700">Equipe</label>
          <select
            className="border p-2 w-full"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">Selecione uma equipe</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selecione Local (Pavilion) */}
        <div>
          <label className="block mb-1 text-gray-700">Local (Pavilion)</label>
          <select
            className="border p-2 w-full"
            value={pavilionId}
            onChange={(e) => setPavilionId(e.target.value)}
          >
            <option value="">Sem local</option>
            {pavilions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Título</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Descrição</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Início</label>
          <input
            type="datetime-local"
            className="border p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Fim</label>
          <input
            type="datetime-local"
            className="border p-2 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Repetição</label>
          <select
            className="border p-2 w-full"
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value as any)}
          >
            <option value="none">Nenhuma</option>
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        {repeatType !== 'none' && (
          <div>
            <label className="block mb-1 text-gray-700">Repetir até</label>
            <input
              type="date"
              className="border p-2 w-full"
              value={repeatUntil}
              onChange={(e) => setRepeatUntil(e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}

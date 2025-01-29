// src/pages/exercises/ExerciseEditPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

type Team = {
  id: string;
  name: string;
};

export default function ExerciseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ataque');
  const [visibility, setVisibility] = useState<'privado' | 'clube' | 'comunidade'>('privado');
  const [description, setDescription] = useState('');
  const [suggestedTime, setSuggestedTime] = useState<number | ''>('');
  const [teamId, setTeamId] = useState(''); // Para guardar qual time do exercise, se 'clube'

  // Para listar no dropdown
  const [teams, setTeams] = useState<Team[]>([]);

  // Carregando o exercise
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar times pro dropdown
    api
      .get('/teams')
      .then((resp) => setTeams(resp.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Buscar o exercise atual
    if (!id) return;
    api
      .get(`/exercises/${id}`)
      .then((resp) => {
        const ex = resp.data;
        setName(ex.name);
        setCategory(ex.category);
        setVisibility(ex.visibility);
        setDescription(ex.description || '');
        setSuggestedTime(ex.suggestedTime ?? '');

        // Se for 'clube'
        if (ex.visibility === 'clube' && ex.teamId) {
          setTeamId(ex.teamId);
        } else {
          setTeamId(''); // se não for clube
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao buscar exercício: ${err.response?.data?.error || err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Salvar
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    try {
      const body = {
        name,
        category,
        visibility,
        description: description || null,
        suggestedTime: suggestedTime === '' ? null : suggestedTime,
        teamId: visibility === 'clube' ? teamId : null,
      };

      await api.put(`/exercises/${id}`, body);
      toast.success('Exercício atualizado!');
      navigate('/exercises');
    } catch (err: any) {
      toast.error(`Erro ao atualizar exercício: ${err.response?.data?.error || err.message}`);
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Editar Exercício</h1>
      <form onSubmit={handleUpdate} className="max-w-sm space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Nome</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Categoria</label>
          <select
            className="border p-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Ataque">Ataque</option>
            <option value="Defesa">Defesa</option>
            <option value="Físico">Físico</option>
            {/* etc. */}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Visibilidade</label>
          <select
            className="border p-2 w-full"
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value as any);
              // se trocar p/ outro que não seja 'clube', limpamos teamId
              if (e.target.value !== 'clube') {
                setTeamId('');
              }
            }}
          >
            <option value="privado">Privado</option>
            <option value="clube">Clube</option>
            <option value="comunidade">Comunidade</option>
          </select>
        </div>

        {/* Se 'clube', exibir dropdown */}
        {visibility === 'clube' && (
          <div>
            <label className="block mb-1 text-gray-700">Time (Clube)</label>
            <select
              className="border p-2 w-full"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">Selecione um time</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-1 text-gray-700">Descrição</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Tempo sugerido (min)</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={suggestedTime}
            onChange={(e) =>
              setSuggestedTime(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}

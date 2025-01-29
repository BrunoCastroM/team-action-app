// src/pages/exercises/ExerciseCreatePage.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type Team = {
  id: string;
  name: string;
};

export default function ExerciseCreatePage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ataque');
  const [visibility, setVisibility] = useState<'privado' | 'clube' | 'comunidade'>('privado');
  const [teamId, setTeamId] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedTime, setSuggestedTime] = useState<number | ''>('');
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // carrega times para exibir no dropdown
    api
      .get('/teams')
      .then((resp) => setTeams(resp.data))
      .catch((err) => console.error(err));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post('/exercises', {
        name,
        category,
        visibility,
        description,
        suggestedTime: suggestedTime ? Number(suggestedTime) : null,
        teamId: visibility === 'clube' ? teamId : null,
        // O creatorId é preenchido no back, pois pegamos do token (req.userId)
      });
      toast.success('Exercício criado com sucesso!');
      navigate('/exercises'); // se tiver listagem
    } catch (err: any) {
      toast.error(`Erro ao criar exercício: ${err.response?.data?.error || err.message}`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Criar Exercício</h1>
      <form onSubmit={handleSave} className="max-w-sm space-y-4">
        <div>
          <label>Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="Ataque">Ataque</option>
            <option value="Defesa">Defesa</option>
            <option value="Físico">Físico</option>
            {/* etc... */}
          </select>
        </div>

        <div>
          <label>Visibilidade</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
            className="border p-2 w-full"
          >
            <option value="privado">Privado</option>
            <option value="clube">Clube</option>
            <option value="comunidade">Comunidade</option>
          </select>
        </div>

        {/* Se visibility=clube, exibe dropdown de Times */}
        {visibility === 'clube' && (
          <div>
            <label>Time (Clube)</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="border p-2 w-full"
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
          <label>Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
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
          Salvar
        </button>
      </form>
    </div>
  );
}

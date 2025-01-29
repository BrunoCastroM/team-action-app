import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type UserTeam = {
  id: string;
  userId: string;
  teamId: string;
  user: User;
};

type Team = {
  id: string;
  name: string;
  userTeams?: UserTeam[]; // Definido para exibir
};

export default function TeamMembersPage() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Carrega as info do time (com userTeams + user)
  useEffect(() => {
    if (!id) return;
    api
      .get(`/teams/${id}`)
      .then((resp) => {
        setTeam(resp.data); // virá com userTeams: [ { user: {...} } ]
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao buscar time: ${err.response?.data?.error || err.message}`);
      });
  }, [id]);

  // Carrega usuários
  useEffect(() => {
    api
      .get('/users')
      .then((resp) => setAllUsers(resp.data))
      .catch((err) => console.error(err));
  }, []);

  async function handleAttach(e: React.FormEvent) {
    e.preventDefault();
    if (!id) {
      toast.error('TeamId inválido.');
      return;
    }
    if (!selectedUserId) {
      toast.error('Selecione um usuário.');
      return;
    }
    try {
      await api.post('/teams/attach-user', {
        teamId: id,
        userId: selectedUserId,
      });
      toast.success('Usuário adicionado ao time!');

      // Recarrega para refletir a adição
      const resp = await api.get(`/teams/${id}`);
      setTeam(resp.data);
    } catch (err: any) {
      toast.error(`Erro ao anexar user: ${err.response?.data?.error || err.message}`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Gerenciar Membros do Time</h1>

      {team && (
        <p className="mb-4">
          Time: <strong>{team.name}</strong>
        </p>
      )}

      {/* FORM: attach user */}
      <form onSubmit={handleAttach} className="max-w-sm space-y-4 mb-6">
        <label className="block mb-1 text-gray-700">Usuário</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Selecione um usuário</option>
          {allUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} - {user.email} ({user.role})
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Adicionar ao Time
        </button>
      </form>

      {/* Exibir quem já está no time */}
      {team?.userTeams && team.userTeams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Membros do Time:</h2>
          <ul className="list-disc list-inside">
            {team.userTeams.map((ut) => (
              <li key={ut.id}>
                {ut.user.name} ({ut.user.email}) - {ut.user.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

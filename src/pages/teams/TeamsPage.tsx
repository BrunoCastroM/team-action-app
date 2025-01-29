// src/pages/teams/TeamsPage.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

type Team = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    api
      .get('/teams')
      .then((resp) => {
        setTeams(resp.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = async (teamId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este time?')) return;
    try {
      await api.delete(`/teams/${teamId}`);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch (err) {
      console.error(err);
      alert('Erro ao remover time.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Times</h1>
      <Link
        to="/teams/create"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Criar Time
      </Link>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="border-b">
              <td className="p-2">{team.id}</td>
              <td className="p-2">{team.name}</td>
              <td className="p-2">
                <Link to={`/teams/${team.id}/edit`} className="mr-2 text-blue-500 underline">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="mr-2 text-red-500 underline"
                >
                  Remover
                </button>
                {/* NOVO BOTÃO: Gerenciar Membros */}
                <Link to={`/teams/${team.id}/members`} className="text-green-500 underline">
                  Membros
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

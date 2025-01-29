import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

type Exercise = {
  id: string;
  name: string;
  category: string;
  visibility: string;
  description?: string | null;
  suggestedTime?: number | null;
  imageUrl?: string | null;
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    api
      .get('/exercises') // GET /exercises
      .then((resp) => setExercises(resp.data))
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao listar Exercícios: ${err.response?.data?.error || err.message}`);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja remover este exercício?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(exercises.filter((e) => e.id !== id));
      toast.success('Exercício removido com sucesso!');
    } catch (err: any) {
      toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Exercícios</h1>
      <Link
        to="/exercises/create"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Criar Exercício
      </Link>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Visibilidade</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex) => (
            <tr key={ex.id} className="border-b">
              <td className="p-2">{ex.name}</td>
              <td className="p-2">{ex.category}</td>
              <td className="p-2">{ex.visibility}</td>
              <td className="p-2">
                <Link to={`/exercises/${ex.id}/edit`} className="mr-2 text-blue-500 underline">
                  Editar
                </Link>
                <button onClick={() => handleDelete(ex.id)} className="text-red-500 underline">
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

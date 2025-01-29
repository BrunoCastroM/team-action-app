import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type Pavilion = {
  id: string;
  name: string;
  address?: string;
};

export default function PavilionsPage() {
  const [pavilions, setPavilions] = useState<Pavilion[]>([]);

  useEffect(() => {
    api
      .get('/pavilions')
      .then((resp) => setPavilions(resp.data))
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao listar pavilhões: ${err.response?.data?.error || err.message}`);
      });
  }, []);

  const handleDelete = async (pavilionId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este pavilhão?')) return;
    try {
      await api.delete(`/pavilions/${pavilionId}`);
      setPavilions(pavilions.filter((p) => p.id !== pavilionId));
      toast.success('Pavilhão removido!');
    } catch (err: any) {
      toast.error(`Erro ao remover pavilhão: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Pavilhões</h1>
      <Link
        to="/pavilions/create"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Criar Pavilhão
      </Link>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Endereço</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pavilions.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.address}</td>
              <td className="p-2">
                <Link to={`/pavilions/${p.id}/edit`} className="mr-2 text-blue-500 underline">
                  Editar
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 underline">
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

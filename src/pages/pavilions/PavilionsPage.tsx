import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type Pavilion = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  street?: string;
  number?: string;
  zipCode?: string;
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
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Cidade</th>
            <th className="p-2 text-left">Rua</th>
            <th className="p-2 text-left">Número</th>
            <th className="p-2 text-left">CEP</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pavilions.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Nenhum pavilhão cadastrado.
              </td>
            </tr>
          ) : (
            pavilions.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.city || '-'}</td>
                <td className="p-2">{p.street || '-'}</td>
                <td className="p-2">{p.number || '-'}</td>
                <td className="p-2">{p.zipCode || '-'}</td>
                <td className="p-2 flex gap-2">
                  <Link to={`/pavilions/${p.id}/edit`} className="text-blue-500 underline">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 underline">
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

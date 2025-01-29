import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/teams/${id}`)
      .then((resp) => {
        setName(resp.data.name);
      })
      .catch((err) => {
        toast.error(`Erro ao buscar time: ${err.response?.data?.error || err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/teams/${id}`, { name });
      toast.success('Time atualizado com sucesso!');
      navigate('/teams');
    } catch (err: any) {
      toast.error(`Erro ao atualizar time: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Editar Time</h1>
      <form onSubmit={handleUpdate} className="max-w-sm space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Nome do Time</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}

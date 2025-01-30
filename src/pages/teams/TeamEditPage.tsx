// src/pages/teams/TeamEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function TeamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [division, setDivision] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/teams/${id}`)
      .then((resp) => {
        // Resp deve conter { division, gender, name, ... }
        setDivision(resp.data.division || '');
        setGender(resp.data.gender || '');
      })
      .catch((err) => {
        toast.error(`Erro ao buscar time: ${err.response?.data?.error || err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      // PUT /teams/:id => manda { division, gender }
      await api.put(`/teams/${id}`, { division, gender });
      toast.success('Time atualizado com sucesso!');
      navigate('/teams');
    } catch (err: any) {
      toast.error(`Erro ao atualizar time: ${err.response?.data?.error || err.message}`);
    }
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Editar Time</h1>
      <form onSubmit={handleUpdate} className="max-w-sm space-y-4">
        {/* Divisão */}
        <div>
          <label className="block mb-1 text-gray-700">Divisão</label>
          <select
            className="border p-2 w-full"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="Sub-12">Sub-12</option>
            <option value="Sub-14">Sub-14</option>
            <option value="Sub-16">Sub-16</option>
            <option value="Sub-18">Sub-18</option>
            <option value="Sub-20">Sub-20</option>
            <option value="Seniores">Seniores</option>
            <option value="Veteranos">Veteranos</option>
          </select>
        </div>

        {/* Gênero */}
        <div>
          <label className="block mb-1 text-gray-700">Gênero</label>
          <select
            className="border p-2 w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Misto">Misto</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}

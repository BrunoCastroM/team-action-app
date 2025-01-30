// src/pages/teams/TeamCreatePage.tsx
import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function TeamCreatePage() {
  const [division, setDivision] = useState('Sub-16');
  const [gender, setGender] = useState('Masculino');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Envia { division, gender } para o back-end
      await api.post('/teams', { division, gender });
      toast.success('Time criado com sucesso!');
      navigate('/teams');
    } catch (err: any) {
      toast.error(`Erro ao criar time: ${err.response?.data?.error || err.message}`);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Criar Time</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        {/* Campo Divisão (Escalão) */}
        <div>
          <label className="block mb-1 text-gray-700">Divisão (Escalão)</label>
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

        {/* Campo Gênero */}
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
          Salvar
        </button>
      </form>
    </div>
  );
}

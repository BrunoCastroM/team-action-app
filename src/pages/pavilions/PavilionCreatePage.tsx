// src/pages/pavilions/PavilionCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function PavilionCreatePage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/pavilions', {
        name,
        address,
      });
      toast.success('Pavilhão criado com sucesso!');
      navigate('/pavilions');
    } catch (err: any) {
      toast.error(`Erro ao criar pavilhão: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Criar Pavilhão</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Nome do Pavilhão</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Endereço (opcional)</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}

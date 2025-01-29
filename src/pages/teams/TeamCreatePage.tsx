import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function TeamCreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teams', { name });
      toast.success('Time criado com sucesso!');
      navigate('/teams');
    } catch (err: any) {
      toast.error(`Erro ao criar time: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Criar Time</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
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
          Salvar
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function PavilionCreatePage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [zipCode, setZipCode] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/pavilions', {
        name,
        city: city || null,
        street: street || null,
        number: number || null,
        zipCode: zipCode || null,
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
          <label>Nome do Pavilhão</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Cidade</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label>Rua</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>

        <div>
          <label>Número</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div>
          <label>Código Postal (CEP)</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}

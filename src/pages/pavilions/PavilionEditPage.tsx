import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function PavilionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    api
      .get(`/pavilions/${id}`)
      .then((resp) => {
        const pav = resp.data;
        setName(pav.name);
        setCity(pav.city || '');
        setStreet(pav.street || '');
        setNumber(pav.number || '');
        setZipCode(pav.zipCode || '');
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao buscar pavilhão: ${err.response?.data?.error || err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/pavilions/${id}`, {
        name,
        city: city || null,
        street: street || null,
        number: number || null,
        zipCode: zipCode || null,
      });
      toast.success('Pavilhão atualizado com sucesso!');
      navigate('/pavilions');
    } catch (err: any) {
      toast.error(`Erro ao atualizar pavilhão: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Editar Pavilhão</h1>
      <form onSubmit={handleUpdate} className="max-w-sm space-y-4">
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
          Atualizar
        </button>
      </form>
    </div>
  );
}

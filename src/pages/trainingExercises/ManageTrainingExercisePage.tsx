// src/pages/trainingExercises/ManageTrainingExercisePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

type Pivot = {
  id: string;
  trainingId: string;
  exerciseId: string;
  timeMinutes: number;
  phase: string | null;
  order: number | null;
  exercise?: {
    id: string;
    name: string;
    category: string;
  };
};

type Exercise = {
  id: string;
  name: string;
  category: string;
};

export default function ManageTrainingExercisePage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const [pivots, setPivots] = useState<Pivot[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Para criar um pivot
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(15);
  const [phase, setPhase] = useState('');
  const [order, setOrder] = useState<number | ''>('');

  useEffect(() => {
    if (!trainingId) return;

    // Carrega pivots do Treino
    api
      .get(`/training-exercises/by-training/${trainingId}`)
      .then((resp) => setPivots(resp.data))
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao listar pivot: ${err.response?.data?.error || err.message}`);
      });
  }, [trainingId]);

  useEffect(() => {
    // Carrega Exercícios disponíveis
    api
      .get('/exercises')
      .then((resp) => setExercises(resp.data))
      .catch((err) => console.error(err));
  }, []);

  async function handleAddPivot(e: React.FormEvent) {
    e.preventDefault();
    if (!trainingId) return;
    try {
      const body = {
        trainingId,
        exerciseId: selectedExercise,
        timeMinutes,
        phase: phase || null,
        order: order === '' ? null : order,
      };
      const resp = await api.post('/training-exercises', body);
      toast.success('Exercício adicionado ao treino!');
      setPivots([...pivots, resp.data]);
    } catch (err: any) {
      toast.error(`Erro ao adicionar: ${err.response?.data?.error || err.message}`);
    }
  }

  async function handleRemovePivot(pivotId: string) {
    if (!window.confirm('Remover este exercício do treino?')) return;
    try {
      await api.delete(`/training-exercises/${pivotId}`);
      setPivots(pivots.filter((p) => p.id !== pivotId));
      toast.success('Removido com sucesso.');
    } catch (err: any) {
      toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`);
    }
  }

  // 1) Calcula o total de timeMinutes
  const totalTime = pivots.reduce((acc, cur) => acc + cur.timeMinutes, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Exercícios do Treino</h1>

      {/* FORM p/ adicionar pivot */}
      <form onSubmit={handleAddPivot} className="max-w-sm space-y-4 mb-6">
        <div>
          <label className="block mb-1 text-gray-700">Exercício</label>
          <select
            className="border p-2 w-full"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Tempo (min)</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={timeMinutes}
            onChange={(e) => setTimeMinutes(parseInt(e.target.value, 10))}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Fase</label>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Aquecimento, Principal..."
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Ordem</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={order}
            onChange={(e) => setOrder(e.target.value ? parseInt(e.target.value, 10) : '')}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Adicionar
        </button>
      </form>

      {/* EXIBE total do tempo */}
      <p className="mb-4 font-semibold">Tempo total do Treino: {totalTime} min</p>

      {/* LISTAGEM */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Exercício</th>
            <th className="p-2 text-left">Tempo (min)</th>
            <th className="p-2 text-left">Fase</th>
            <th className="p-2 text-left">Ordem</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pivots.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">
                {p.exercise ? p.exercise.name : `exerciseId: ${p.exerciseId}`}
              </td>
              <td className="p-2">{p.timeMinutes}</td>
              <td className="p-2">{p.phase}</td>
              <td className="p-2">{p.order}</td>
              <td className="p-2">
                <button onClick={() => handleRemovePivot(p.id)} className="text-red-600 underline">
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

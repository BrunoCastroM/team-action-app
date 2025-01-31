import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'
import ExerciseDetails from './ExerciseDetails'
type Exercise = {
  id: string
  name: string
  category: string
  visibility: string
  description?: string | null
  suggestedTime?: number | null
  youtubeUrl?: string | null
  images?: { id: string; url: string }[]
  files?: { id: string; fileUrl: string; fileType?: string }[]
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // 1) Carrega a lista inicial (sem images/files)
  useEffect(() => {
    api
      .get('/exercises')
      .then((resp) => setExercises(resp.data))
      .catch((err) => {
        console.error(err)
        toast.error(`Erro ao listar Exercícios: ${err.response?.data?.error || err.message}`)
      })
  }, [])

  // 2) Deletar Exercise
  async function handleDeleteExercise(id: string) {
    if (!window.confirm('Tem certeza que deseja remover este exercício?')) return
    try {
      await api.delete(`/exercises/${id}`)
      setExercises((prev) => prev.filter((e) => e.id !== id))
      toast.success('Exercício removido com sucesso!')
    } catch (err: any) {
      toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`)
    }
  }

  // 3) Expandir/Fechar Detalhes
  async function toggleDetails(exId: string) {
    // se já está expandido => colapsar
    if (selectedExerciseId === exId) {
      setSelectedExerciseId(null)
      return
    }
    // se não está expandido => chamamos GET /exercises/:id p/ obter images/files
    try {
      setLoadingDetails(true)
      const resp = await api.get(`/exercises/${exId}`)
      const fullExercise = resp.data as Exercise

      // Atualizar no array
      setExercises((prev) =>
        prev.map((ex) => (ex.id === exId ? { ...ex, ...fullExercise } : ex))
      )
      setSelectedExerciseId(exId)
    } catch (err: any) {
      toast.error(`Erro ao obter Exercício: ${err.response?.data?.error || err.message}`)
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Exercícios</h1>

      <Link
        to="/exercises/create"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Criar Exercício
      </Link>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Categoria</th>
            <th className="p-2 text-left">Visibilidade</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex) => (
            <React.Fragment key={ex.id}>
              <tr className="border-b">
                <td className="p-2">{ex.name}</td>
                <td className="p-2">{ex.category}</td>
                <td className="p-2">{ex.visibility}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleDetails(ex.id)}
                    className="mr-2 text-green-500 underline"
                  >
                    {selectedExerciseId === ex.id ? 'Fechar' : 'Detalhes'}
                  </button>
                  <Link to={`/exercises/${ex.id}/edit`} className="mr-2 text-blue-500 underline">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteExercise(ex.id)}
                    className="text-red-500 underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>

              {/* Se for o selecionado, adicionamos outra <tr> para exibir details */}
              {selectedExerciseId === ex.id && (
                <tr>
                  <td colSpan={4} className="bg-gray-50">
                    <ExerciseDetails exercise={ex} loading={loadingDetails} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

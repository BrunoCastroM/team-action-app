import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

type Exercise = {
  id: string
  name: string
  category: string
  visibility: string
  description?: string | null
  suggestedTime?: number | null
  youtubeUrl?: string | null
  // Arrays que podem vir quando carregamos “detalhes”
  images?: Array<{
    id: string
    url: string
  }>
  files?: Array<{
    id: string
    fileUrl: string
    fileType: string | null
  }>
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null) // qual item expandido?
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    api
      .get('/exercises')
      .then((resp) => setExercises(resp.data))
      .catch((err) => {
        console.error(err)
        toast.error(`Erro ao listar Exercícios: ${err.response?.data?.error || err.message}`)
      })
  }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja remover este exercício?')) return
    try {
      await api.delete(`/exercises/${id}`)
      setExercises((prev) => prev.filter((e) => e.id !== id))
      toast.success('Exercício removido com sucesso!')
    } catch (err: any) {
      toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`)
    }
  }

  /**
   * Ao clicar “Detalhes,” aparece um quadro. Se já estiver expandido, desaparece.
   * Se não estiver expandido, chama GET /exercises/:id para pegar images, files, youtubeUrl...
   */
  async function toggleDetails(exId: string) {
    if (expandedId === exId) {
      // já está expandido => colapsar
      setExpandedId(null)
      return
    }
    // expandir => carregar details
    try {
      setLoadingDetails(true)
      const resp = await api.get(`/exercises/${exId}`)
      // resp.data => { ..., images: [...], files: [...], youtubeUrl: ...}
      const updated = resp.data as Exercise

      // atualizar a lista principal => substituindo o item com o item “detalhado”
      setExercises((prev) =>
        prev.map((ex) => (ex.id === exId ? { ...ex, ...updated } : ex))
      )

      setExpandedId(exId)
    } catch (err: any) {
      toast.error(`Erro ao carregar detalhes: ${err.response?.data?.error || err.message}`)
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
          {exercises.map((ex) => {
            const isExpanded = expandedId === ex.id
            return (
              <tr key={ex.id} className="border-b">
                <td className="p-2">{ex.name}</td>
                <td className="p-2">{ex.category}</td>
                <td className="p-2">{ex.visibility}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => toggleDetails(ex.id)}
                    className="text-green-600 underline"
                  >
                    {isExpanded ? 'Fechar' : 'Detalhes'}
                  </button>
                  <Link
                    to={`/exercises/${ex.id}/edit`}
                    className="text-blue-500 underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="text-red-500 underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Exibir Painel de Detalhes Abaixo? 
         Para exibir inline, precisamos de uma row extra, ou algo. 
         Farei de forma simples: Se expandido, mostro um <div> fora. */}
      {expandedId && (
        <ExerciseDetails
          exercise={exercises.find((e) => e.id === expandedId)!}
          loading={loadingDetails}
        />
      )}
    </div>
  )
}

/**
 * Componente que mostra: YouTube link, PDFs, Imagens
 */
function ExerciseDetails({ exercise, loading }: { exercise: Exercise; loading: boolean }) {
  if (loading) {
    return <p className="mt-4">Carregando detalhes...</p>
  }

  return (
    <div className="mt-4 border p-3 bg-gray-50">
      <h2 className="text-lg font-semibold">Detalhes de: {exercise.name}</h2>
      {/* Exibir description */}
      {exercise.description && <p className="text-sm mt-1">Desc: {exercise.description}</p>}

      {/* Se tem youtubeUrl */}
      {exercise.youtubeUrl && (
        <div className="mt-2">
          <p className="font-semibold">Vídeo YouTube:</p>
          <a
            href={exercise.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {exercise.youtubeUrl}
          </a>
        </div>
      )}

      {/* Se tem images */}
      {exercise.images && exercise.images.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">Imagens:</p>
          <div className="flex space-x-2">
            {exercise.images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Exercise Image"
                className="w-32 h-32 object-cover border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Se tem files (PDF) */}
      {exercise.files && exercise.files.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">Arquivos:</p>
          <ul className="list-disc ml-5">
            {exercise.files.map((f) => (
              <li key={f.id}>
                <a href={f.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {f.fileType ? `Baixar (${f.fileType})` : 'Baixar Arquivo'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

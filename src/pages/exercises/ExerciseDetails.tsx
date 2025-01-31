import { useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

type ImageData = {
  id: string
  url: string
}

type FileData = {
  id: string
  fileUrl: string
  fileType?: string | null
}

type Exercise = {
  id: string
  name: string
  description?: string | null
  youtubeUrl?: string | null
  images?: ImageData[]
  files?: FileData[]
}

type Props = {
  exercise: Exercise
  loading: boolean
}

export default function ExerciseDetails({ exercise, loading }: Props) {
  // Para exibir modal de imagem
  const [showModalImage, setShowModalImage] = useState<string | null>(null)

  // A cópia local de images e files
  const [localImages, setLocalImages] = useState<ImageData[]>(exercise.images || [])
  const [localFiles, setLocalFiles] = useState<FileData[]>(exercise.files || [])

  // Se ainda está carregando, exibe “carregando”
  if (loading) {
    return <p className="p-2">Carregando detalhes...</p>
  }

  function openModalImage(url: string) {
    setShowModalImage(url)
  }
  function closeModal() {
    setShowModalImage(null)
  }

  async function handleDeleteImage(imageId: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem?')) return
    try {
      await api.delete(`/exercises/images/${imageId}`)
      toast.success('Imagem excluída!')
      setLocalImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err: any) {
      toast.error(`Erro ao excluir imagem: ${err.response?.data?.error || err.message}`)
    }
  }

  async function handleDeleteFile(fileId: string) {
    if (!window.confirm('Tem certeza que deseja excluir este arquivo?')) return
    try {
      await api.delete(`/exercises/files/${fileId}`)
      toast.success('Arquivo excluído!')
      setLocalFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err: any) {
      toast.error(`Erro ao excluir arquivo: ${err.response?.data?.error || err.message}`)
    }
  }

  return (
    <div className="p-2">
      <h4 className="font-bold text-lg mb-2">Detalhes de: {exercise.name}</h4>

      {/* Descrição */}
      <p className="text-sm mb-1">
        <strong>Descrição:</strong> {exercise.description || 'Sem descrição'}
      </p>

      {/* Link YouTube */}
      {exercise.youtubeUrl && (
        <p className="mt-1">
          <strong>Vídeo YouTube: </strong>
          <a
            href={exercise.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {exercise.youtubeUrl}
          </a>
        </p>
      )}

      {/* Imagens */}
      <div className="mt-3">
        <p className="font-semibold">Imagens:</p>
        {localImages.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma imagem</p>
        ) : (
          <div className="flex flex-wrap gap-3 mt-1">
            {localImages.map((img) => (
              <div key={img.id} className="relative w-24 h-24 border">
                <img
                  src={img.url}
                  alt="exercise-img"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openModalImage(img.url)}
                />
                {/* Botão Excluir */}
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arquivos */}
      <div className="mt-3">
        <p className="font-semibold">Arquivos:</p>
        {localFiles.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum arquivo</p>
        ) : (
          <ul className="list-disc list-inside mt-1">
            {localFiles.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <a href={f.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                  {f.fileType ? `Baixar (${f.fileType})` : 'Baixar arquivo'}
                </a>
                <button
                  onClick={() => handleDeleteFile(f.id)}
                  className="text-red-600 underline text-xs"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal p/ ampliar imagem */}
      {showModalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={showModalImage}
            alt="imagem grande"
            className="max-w-3xl max-h-[90%] object-contain"
          />
        </div>
      )}
    </div>
  )
}

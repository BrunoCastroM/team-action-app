// src/pages/exercises/ExerciseMediaPage.tsx

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

export default function ExerciseMediaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  async function handleImagesUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!id) {
      toast.error('ID do exercício inválido')
      return
    }
    if (!imageFiles || imageFiles.length === 0) {
      toast.error('Selecione ao menos uma imagem')
      return
    }

    const formData = new FormData()
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('files', imageFiles[i]) // back: upload.array('files', 5)
    }

    try {
      await api.post(`/exercises/${id}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Imagens enviadas com sucesso!')
    } catch (err: any) {
      toast.error(`Erro ao enviar imagens: ${err.response?.data?.error || err.message}`)
    }
  }

  async function handlePdfUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!id) {
      toast.error('ID do exercício inválido')
      return
    }
    if (!pdfFile) {
      toast.error('Selecione um arquivo PDF')
      return
    }

    const fd = new FormData()
    fd.append('file', pdfFile) // back: upload.single('file')

    try {
      await api.post(`/exercises/${id}/upload-file`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('PDF enviado com sucesso!')
    } catch (err: any) {
      toast.error(`Erro ao enviar PDF: ${err.response?.data?.error || err.message}`)
    }
  }

  function handleGoBack() {
    // simples: voltar à listagem
    navigate('/exercises')
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Mídia do Exercício</h1>
      <p className="mb-6">Exercício ID: {id}</p>

      <form onSubmit={handleImagesUpload} className="mb-6">
        <label className="block mb-1 font-semibold">Enviar Imagens (até 5)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImageFiles(e.target.files)}
          className="mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload Imagens
        </button>
      </form>

      <form onSubmit={handlePdfUpload}>
        <label className="block mb-1 font-semibold">Enviar PDF (1 arquivo)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPdfFile(e.target.files[0])
            }
          }}
          className="mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload PDF
        </button>
      </form>

      {/* NOVO: Botão para voltar à lista de Exercícios */}
      <div className="mt-8">
        <button
          onClick={handleGoBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Voltar para Exercícios
        </button>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'

type User = {
  id: string
  name: string
  email: string
  // ...
}

type Attendance = {
  id?: string // se já existe, senão undefined
  trainingId: string
  userId: string
  status: 'presente' | 'ausente'
  notes?: string | null
  behavior?: number | null
  technique?: number | null
  attitude?: number | null
  absenceTitle?: string | null // no DB
  absenceDesc?: string | null   // no DB
}

type UserAttendanceRow = {
  user: User
  attendance: Attendance
}

export default function TrainingAttendancesPage() {
  const { trainingId } = useParams<{ trainingId: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<UserAttendanceRow[]>([])
  const [trainingTitle, setTrainingTitle] = useState('')

  useEffect(() => {
    if (!trainingId) {
      toast.error('trainingId inválido')
      return
    }
    fetchData()
  }, [trainingId])

  async function fetchData() {
    setLoading(true)
    try {
      // 1) Carregar o Treino => para exibir o .title e saber .teamId
      const respTr = await api.get(`/trainings/${trainingId}`)
      const training = respTr.data
      setTrainingTitle(training.title)
      const teamId = training.teamId

      // 2) Pegar users do time => GET /teams/:teamId
      const respTeam = await api.get(`/teams/${teamId}`)
      const team = respTeam.data
      const teamUsers: User[] = team.userTeams.map((ut: any) => ut.user)

      // 3) Pegar attendances do training => GET /attendances/training/:trainingId
      const respAtt = await api.get(`/attendances/training/${trainingId}`)
      const existingAtt = respAtt.data as Attendance[]

      // Montar rows => se user játiver attendance, usa, senão status=presente
      const newRows: UserAttendanceRow[] = teamUsers.map((u) => {
        const found = existingAtt.find((a) => a.userId === u.id)
        if (found) {
          return {
            user: u,
            attendance: {
              ...found,
              status: (found.status === 'ausente' ? 'ausente' : 'presente'),
            },
          }
        } else {
          return {
            user: u,
            attendance: {
              trainingId: trainingId!,
              userId: u.id,
              status: 'presente',
              notes: null,
              behavior: null,
              technique: null,
              attitude: null,
              absenceTitle: null,
              absenceDesc: null,
            },
          }
        }
      })
      setRows(newRows)
    } catch (err: any) {
      toast.error(`Erro ao carregar presenças: ${err.response?.data?.error || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(userId: string, newStatus: 'presente' | 'ausente') {
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: {
              ...r.attendance,
              status: newStatus,
            },
          }
        }
        return r
      })
    )
  }

  function handleAbsenceTitleChange(userId: string, val: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: {
              ...r.attendance,
              absenceTitle: val,
            },
          }
        }
        return r
      })
    )
  }

  function handleAbsenceDescChange(userId: string, val: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: {
              ...r.attendance,
              absenceDesc: val,
            },
          }
        }
        return r
      })
    )
  }

  function handleNotesChange(userId: string, val: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: {
              ...r.attendance,
              notes: val,
            },
          }
        }
        return r
      })
    )
  }

  function handleBehaviorChange(userId: string, val: string) {
    const n = val === '' ? null : parseInt(val, 10)
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: { ...r.attendance, behavior: n },
          }
        }
        return r
      })
    )
  }

  function handleTechniqueChange(userId: string, val: string) {
    const n = val === '' ? null : parseInt(val, 10)
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: { ...r.attendance, technique: n },
          }
        }
        return r
      })
    )
  }

  function handleAttitudeChange(userId: string, val: string) {
    const n = val === '' ? null : parseInt(val, 10)
    setRows((prev) =>
      prev.map((r) => {
        if (r.user.id === userId) {
          return {
            ...r,
            attendance: { ...r.attendance, attitude: n },
          }
        }
        return r
      })
    )
  }

  async function handleSaveAll() {
    try {
      for (const row of rows) {
        // se attendance.id existe => PUT /attendances/:id
        // senão => POST /attendances
        if (row.attendance.id) {
          await api.put(`/attendances/${row.attendance.id}`, {
            status: row.attendance.status,
            absenceTitle: row.attendance.absenceTitle,
            absenceDesc: row.attendance.absenceDesc,
            notes: row.attendance.notes,
            behavior: row.attendance.behavior,
            technique: row.attendance.technique,
            attitude: row.attendance.attitude,
          })
        } else {
          // create
          await api.post('/attendances', {
            trainingId: row.attendance.trainingId,
            userId: row.attendance.userId,
            status: row.attendance.status,
            absenceTitle: row.attendance.absenceTitle,
            absenceDesc: row.attendance.absenceDesc,
            notes: row.attendance.notes,
            behavior: row.attendance.behavior,
            technique: row.attendance.technique,
            attitude: row.attendance.attitude,
          })
        }
      }
      toast.success('Presenças salvas com sucesso!')
    } catch (err: any) {
      toast.error(`Erro ao salvar: ${err.response?.data?.error || err.message}`)
    }
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Presenças para Treino: {trainingTitle}</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Atleta</th>
            <th className="p-2">Status</th>
            <th className="p-2">Título Ausência</th>
            <th className="p-2">Descrição Ausência</th>
            <th className="p-2">Notas</th>
            <th className="p-2">Behavior</th>
            <th className="p-2">Technique</th>
            <th className="p-2">Attitude</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.user.id} className="border-b">
              <td className="p-2">{r.user.name}</td>
              <td className="p-2">
                <select
                  value={r.attendance.status}
                  onChange={(e) => 
                    handleStatusChange(r.user.id, e.target.value as 'presente'|'ausente')
                  }
                  className="border p-1"
                >
                  <option value="presente">Presente</option>
                  <option value="ausente">Ausente</option>
                </select>
              </td>
              {/* Se ausente => exibir title e desc */}
              <td className="p-2">
                {r.attendance.status === 'ausente' ? (
                  <input
                    type="text"
                    className="border p-1"
                    value={r.attendance.absenceTitle || ''}
                    onChange={(e) => handleAbsenceTitleChange(r.user.id, e.target.value)}
                  />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2">
                {r.attendance.status === 'ausente' ? (
                  <input
                    type="text"
                    className="border p-1"
                    value={r.attendance.absenceDesc || ''}
                    onChange={(e) => handleAbsenceDescChange(r.user.id, e.target.value)}
                  />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>

              <td className="p-2">
                <input
                  type="text"
                  className="border p-1"
                  placeholder="Notas"
                  value={r.attendance.notes || ''}
                  onChange={(e) => handleNotesChange(r.user.id, e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 w-16"
                  placeholder="Ex: 0"
                  value={r.attendance.behavior ?? ''}
                  onChange={(e) => handleBehaviorChange(r.user.id, e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 w-16"
                  placeholder="Ex: 0"
                  value={r.attendance.technique ?? ''}
                  onChange={(e) => handleTechniqueChange(r.user.id, e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  className="border p-1 w-16"
                  placeholder="Ex: 0"
                  value={r.attendance.attitude ?? ''}
                  onChange={(e) => handleAttitudeChange(r.user.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSaveAll}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Salvar
      </button>

      <button
        onClick={() => navigate('/trainings')}
        className="mt-4 ml-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Voltar
      </button>
    </div>
  )
}

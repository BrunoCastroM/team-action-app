// import { useEffect, useState } from 'react';
// import api from '../../services/api';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import CalendarView from '../../components/CalendarView';

// type Team = { id: string; name: string };
// type Training = {
//   id: string;
//   title: string;
//   startDate: string;
//   endDate: string;
// };

// export default function TrainingsPage() {
//   const [trainings, setTrainings] = useState<Training[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]); // Carregar equipes
//   const [selectedTeam, setSelectedTeam] = useState(''); // Equipe selecionada
//   const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

//   // Carregar equipes
//   useEffect(() => {
//     api
//       .get('/teams')
//       .then((resp) => setTeams(resp.data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Carregar treinos (com filtro de equipe)
//   useEffect(() => {
//     const params: any = {};
//     if (selectedTeam) {
//       params.teamId = selectedTeam; // Adiciona o filtro de equipe se estiver selecionado
//     }
//     api
//       .get('/trainings', { params })
//       .then((resp) => setTrainings(resp.data))
//       .catch((err) => {
//         console.error(err);
//         toast.error(`Erro ao carregar treinos: ${err.response?.data?.error || err.message}`);
//       });
//   }, [selectedTeam]); // Reexecuta ao mudar a equipe selecionada

//   function toggleView() {
//     setViewMode(viewMode === 'list' ? 'calendar' : 'list');
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-primary mb-4">Treinos</h1>
//       <div className="mb-4 flex gap-2">
//         <Link
//           to="/trainings/create"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Marcar Treino
//         </Link>
//         <button
//           onClick={toggleView}
//           className="bg-gray-500 text-white px-4 py-2 rounded"
//         >
//           {viewMode === 'list' ? 'Ver Calendário' : 'Ver Lista'}
//         </button>

//         {/* Filtro de equipes */}
//         <select
//           className="border p-2"
//           value={selectedTeam}
//           onChange={(e) => setSelectedTeam(e.target.value)} // Atualiza equipe selecionada
//         >
//           <option value="">Todas Equipes</option>
//           {teams.map((team) => (
//             <option key={team.id} value={team.id}>
//               {team.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {viewMode === 'list' ? (
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2 text-left">ID</th>
//               <th className="p-2 text-left">Título</th>
//               <th className="p-2 text-left">Início</th>
//               <th className="p-2 text-left">Fim</th>
//               <th className="p-2 text-left">Ações</th>
//             </tr>
//           </thead>
//           <tbody>
//             {trainings.map((training) => (
//               <tr key={training.id} className="border-b">
//                 <td className="p-2">{training.id}</td>
//                 <td className="p-2">{training.title}</td>
//                 <td className="p-2">{new Date(training.startDate).toLocaleString()}</td>
//                 <td className="p-2">{new Date(training.endDate).toLocaleString()}</td>
//                 <td className="p-2">
//                   <Link
//                     to={`/trainings/${training.id}/edit`}
//                     className="mr-2 text-blue-500 underline"
//                   >
//                     Editar
//                   </Link>
//                   <button
//                     onClick={() => {
//                       if (window.confirm('Tem certeza que deseja excluir este treino?')) {
//                         api.delete(`/trainings/${training.id}`).then(() => {
//                           setTrainings(trainings.filter((t) => t.id !== training.id));
//                           toast.success('Treino removido com sucesso!');
//                         });
//                       }
//                     }}
//                     className="text-red-500 underline"
//                   >
//                     Remover
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <CalendarView
//           trainings={trainings}
//           onSelectEvent={(id) => {
//             window.location.href = `/trainings/${id}/edit`;
//           }}
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CalendarView from '../../components/CalendarView';

type Team = { id: string; name: string };
type Training = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
};

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Carrega lista de equipes
  useEffect(() => {
    api
      .get('/teams')
      .then((resp) => setTeams(resp.data))
      .catch((err) => console.error(err));
  }, []);

  // Carrega treinos (com filtro por equipe)
  useEffect(() => {
    const params: any = {};
    if (selectedTeam) {
      params.teamId = selectedTeam;
    }
    api
      .get('/trainings', { params })
      .then((resp) => setTrainings(resp.data))
      .catch((err) => {
        console.error(err);
        toast.error(`Erro ao carregar treinos: ${err.response?.data?.error || err.message}`);
      });
  }, [selectedTeam]);

  // Alterna visualização (lista/calendário)
  function toggleView() {
    setViewMode(viewMode === 'list' ? 'calendar' : 'list');
  }

  // Exclui um treino
  function handleDelete(trainingId: string) {
    if (!window.confirm('Tem certeza que deseja excluir este treino?')) return;
    api
      .delete(`/trainings/${trainingId}`)
      .then(() => {
        setTrainings((prev) => prev.filter((t) => t.id !== trainingId));
        toast.success('Treino removido com sucesso!');
      })
      .catch((err) => {
        toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Treinos</h1>

      <div className="mb-4 flex gap-2">
        {/* Botão para criar treino */}
        <Link to="/trainings/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Marcar Treino
        </Link>

        {/* Botão para alternar list/calendário */}
        <button onClick={toggleView} className="bg-gray-500 text-white px-4 py-2 rounded">
          {viewMode === 'list' ? 'Ver Calendário' : 'Ver Lista'}
        </button>

        {/* Filtro de equipes */}
        <select
          className="border p-2"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Todas Equipes</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {viewMode === 'list' ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Título</th>
              <th className="p-2 text-left">Início</th>
              <th className="p-2 text-left">Fim</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id} className="border-b">
                <td className="p-2">{training.id}</td>
                <td className="p-2">{training.title}</td>
                <td className="p-2">{new Date(training.startDate).toLocaleString()}</td>
                <td className="p-2">{new Date(training.endDate).toLocaleString()}</td>
                <td className="p-2">
                  {/* Link para gerenciar Exercícios do Treino */}
                  <Link
                    to={`/trainings/${training.id}/exercises`}
                    className="mr-2 text-green-500 underline"
                  >
                    Exercícios
                  </Link>

                  {/* Link para marcar presença */}
                  <Link
                    to={`/attendance/training/${training.id}`}
                    className="text-green-500 underline"
                  >
                    Marcar Presença
                  </Link>

                  {/* Link para editar treino */}
                  <Link
                    to={`/trainings/${training.id}/edit`}
                    className="mr-2 text-blue-500 underline"
                  >
                    Editar
                  </Link>

                  {/* Botão para remover treino */}
                  <button
                    onClick={() => handleDelete(training.id)}
                    className="text-red-500 underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Visualização em calendário
        <CalendarView
          trainings={trainings}
          onSelectEvent={(id) => {
            // Ao clicar num evento, por exemplo, abre a edição
            window.location.href = `/trainings/${id}/edit`;
          }}
        />
      )}
    </div>
  );
}

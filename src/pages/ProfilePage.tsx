// import React, { useContext, useState } from 'react'
// import { AuthContext } from '../context/AuthContext'
// // Se quiser trocar foto, etc.
// import { toast } from 'react-toastify'
// import api from '../services/api'

// export default function ProfilePage() {
//   const { user } = useContext(AuthContext)
//   const [name, setName] = useState(user?.name || '')
//   const [email, setEmail] = useState(user?.email || '')

//   // se quiser trocar avatar, iremos supor
//   const [avatar, setAvatar] = useState<File | null>(null)

//   if (!user) {
//     return <p>Carregando usuário...</p>
//   }

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       // Exemplo: PUT /users/:id
//       const formData = new FormData()
//       formData.append('name', name)
//       formData.append('email', email)
//       if (avatar) {
//         formData.append('file', avatar) // se seu backend usa "multer" no campo "file"
//       }

//       await api.put(`/users/${user.id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })

//       toast.success('Perfil atualizado com sucesso!')
//     } catch (err: any) {
//       toast.error(`Erro ao atualizar perfil: ${err.response?.data?.error || err.message}`)
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-primary mb-4">Meu Perfil</h1>

//       <form onSubmit={handleSave} className="max-w-md space-y-4">
//         <div>
//           <label>Nome</label>
//           <input
//             type="text"
//             className="border p-2 w-full"
//             value={name}
//             onChange={e => setName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             className="border p-2 w-full"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Avatar (Imagem)</label>
//           <input
//             type="file"
//             onChange={e => {
//               if (e.target.files && e.target.files[0]) {
//                 setAvatar(e.target.files[0])
//               }
//             }}
//           />
//         </div>

//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Salvar
//         </button>
//       </form>
//     </div>
//   )
// }

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext); // Adicionamos setUser
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState<File | null>(null);

  if (!user) {
    return <p>Carregando usuário...</p>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1) Atualizar campos textuais (PUT /users/:id) com JSON
      const { data: updatedUser } = await api.put(`/users/${user.id}`, {
        name,
        email,
      });
      toast.success('Dados do perfil atualizados!');

      // 2) Atualizar avatar se necessário (POST /users/:id/upload-avatar)
      if (avatar) {
        const formData = new FormData();
        formData.append('file', avatar);

        const { data: updatedAvatarUser } = await api.post(
          `/users/${user.id}/upload-avatar`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        toast.success('Avatar atualizado!');
        setUser(updatedAvatarUser); // Atualizar contexto com avatar atualizado
      } else {
        setUser(updatedUser); // Atualizar contexto com nome e email atualizados
      }

      // Dados atualizados no AuthContext
    } catch (err: any) {
      toast.error(`Erro ao atualizar perfil: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-4">Meu Perfil</h1>
      <form onSubmit={handleSave} className="max-w-md space-y-4">
        {/* Nome */}
        <div>
          <label>Nome</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Avatar */}
        <div>
          <label>Avatar (Imagem)</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAvatar(e.target.files[0]);
              }
            }}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}

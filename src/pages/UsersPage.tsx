import { useEffect, useState } from 'react';
import api from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Chamar a rota GET /users (se for admin)
    api
      .get('/users')
      .then((resp) => setUsers(resp.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Users</h1>
      <ul className="mt-2">
        {users.map((u: any) => (
          <li key={u.id} className="border-b py-2">
            {u.name} - {u.email} ({u.role})
          </li>
        ))}
      </ul>
    </div>
  );
}

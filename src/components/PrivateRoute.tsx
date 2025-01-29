import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { user, loading } = useContext(AuthContext);

  // Lembrar que se ainda está carregando info do localStorage, pode ser exibir um spinner
  // (ou outro componente de loading)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se acabou de carregar e não achou user, vai para login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Caso contrário, user existe, renderizar o componente filho
  return <>{children}</>;
}

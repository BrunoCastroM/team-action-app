import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
    // caso falhe, AuthContext exibe toast de erro e não navega
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      {/* Cartão principal */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Bem vindo ao <span className="text-blue-500">TEAM ACTION</span>
        </h1>
        <p className="text-center text-gray-600 mb-6">Preencha os dados do login para acessar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de e-mail/usuário */}
          <div>
            <label className="block mb-1 text-gray-700">E-mail</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1 pr-8"
                placeholder="Digite seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser className="absolute right-0 top-1 text-gray-400" size={20} />
            </div>
          </div>

          {/* Campo de senha */}
          <div>
            <label className="block mb-1 text-gray-700">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1 pr-8"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Ícone de exibir/ocultar senha */}
              <div
                className="absolute right-0 top-1 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
          >
            ENTRAR
          </button>
        </form>

        {/* Link para registro */}
        <p className="text-center mt-4 text-gray-700">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  );
}

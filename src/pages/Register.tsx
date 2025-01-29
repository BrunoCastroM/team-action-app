import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Register() {
  const { registerUser, login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se senhas batem
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem!');
      return;
    }

    const success = await registerUser(name, email, password, role);
    if (success) {
      // Vou decidir depois de eu deixo a pessoa logar direto quando já criar a conta ou fazer verificarção de email:
      // const loginOk = await login(email, password)
      // if (loginOk) {
      //   navigate('/')
      // }

      // Aqui já vai direito para o /login:
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Bem vindo ao <span className="text-blue-500">TEAM ACTION</span>
        </h1>
        <p className="text-center text-gray-600 mb-6">Preencha os dados para criar sua conta</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block mb-1 text-gray-700">Nome</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1"
              placeholder="exemplo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block mb-1 text-gray-700">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1 pr-8"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-0 top-1 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block mb-1 text-gray-700">Confirmar Senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1 pr-8"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute right-0 top-1 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
          </div>

          {/* Escolha de role */}
          <div>
            <label className="block mb-1 text-gray-700">Tipo de Conta</label>
            <select
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Usuário</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Botão de Registrar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
          >
            Registrar
          </button>
        </form>

        {/* Link para Login */}
        <p className="text-center mt-4 text-gray-700">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

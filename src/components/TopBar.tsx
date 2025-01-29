import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/defaultAvatar.png';

export default function TopBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Exemplo se quisermos trocar de tema (opcional)
  const [darkMode, setDarkMode] = useState(false);

  // Para abrir/fechar menu suspenso do perfil
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleProfileMenu() {
    setProfileMenuOpen(!profileMenuOpen);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Se user não tiver avatar, usar defaultAvatar
  const avatarUrl = user?.avatarUrl || defaultAvatar;

  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-4 border-b">
      {/* Search bar (opcional) */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-full px-3 py-1 outline-none text-sm"
        />
        {/* Icone de search (poderia usar FaSearch) */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Botão de troca de tema (opcional) */}
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-100">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Botão de notificações */}
        <button className="p-2 rounded hover:bg-gray-100 relative">
          <FaBell />
          {/* se quiser um badge de notificações */}
        </button>

        {/* Profile / Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
          >
            <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
            <FaChevronDown className="text-gray-500" />
          </button>

          {/* MENU SUSPENSO */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => setProfileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

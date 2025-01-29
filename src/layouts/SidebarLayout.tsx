import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaChartPie,
  FaUserShield,
  FaUsers,
  FaListAlt,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaBell,
  FaFileAlt,
} from 'react-icons/fa';
import logo from '../assets/teamActionLogo.png';
import TopBar from '../components/TopBar';

type Props = {
  children: React.ReactNode;
};

type MenuItem = {
  label: string;
  to: string;
  icon: JSX.Element;
  roles: string[];
};

type Section = {
  sectionTitle: string;
  items: MenuItem[];
};

export default function SidebarLayout({ children }: Props) {
  const { user } = useContext(AuthContext);

  // Estrutura em seções
  const menuSections: Section[] = [
    {
      sectionTitle: 'Menu',
      items: [
        { label: 'Dashboard', to: '/', icon: <FaHome />, roles: ['admin', 'coach', 'user'] },
        {
          label: 'Estatísticas',
          to: '/stats',
          icon: <FaChartPie />,
          roles: ['admin', 'coach'],
        },
        { label: 'Usuários', to: '/users', icon: <FaUserShield />, roles: ['admin'] },
      ],
    },
    {
      sectionTitle: 'Gerenciamento',
      items: [
        { label: 'Times', to: '/teams', icon: <FaUsers />, roles: ['admin', 'coach'] },
        { label: 'Treinos', to: '/trainings', icon: <FaListAlt />, roles: ['admin', 'coach'] },
        {
          label: 'Exercícios',
          to: '/exercises',
          icon: <FaClipboardCheck />,
          roles: ['admin', 'coach', 'user'],
        },
        { label: 'Locais', to: '/pavilions', icon: <FaMapMarkerAlt />, roles: ['admin', 'coach'] },
        { label: 'Presença', to: '/attendances', icon: <FaFileAlt />, roles: ['admin', 'coach'] },
      ],
    },
    {
      sectionTitle: 'Notificações',
      items: [
        { label: 'Alertas', to: '/alerts', icon: <FaBell />, roles: ['admin', 'coach', 'user'] },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary-blue text-white flex flex-col">
        {/* LOGO + NOME APP */}
        <div className="p-4 flex items-center gap-2">
          <img src={logo} alt="TeamAction Logo" className="h-8" />
          <span className="text-xl font-bold">TeamAction</span>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 mt-2 space-y-4 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.sectionTitle}>
              <h2 className="text-sm uppercase text-gray-300 mb-2 mt-4">{section.sectionTitle}</h2>

              <div className="space-y-1">
                {section.items.map((item) => {
                  if (!user || !item.roles.includes(user.role)) {
                    return null;
                  }
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-sidebar-hover transition-colors"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="p-4 border-t border-sidebar-hover">
          <h3 className="text-sm text-gray-400 py-1 text-center">© 2025 Team Action.</h3>
          <p className="text-sm text-gray-500 text-center">Todos os direitos reservados.</p>
        </div>
      </aside>

      {/* CONTAINER PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <TopBar />

        {/* MAIN CONTENT */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

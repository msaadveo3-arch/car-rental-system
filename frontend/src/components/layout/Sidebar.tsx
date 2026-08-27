import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CarFront, Settings2,
  ClipboardCheck, BarChart3, CalendarPlus, FileText,
  ChevronLeft, ChevronRight, Car as LogoIcon,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

type Role = 'admin' | 'staff' | 'inspector';

const navItems: { to: string; label: string; icon: any; roles: Role[] }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'inspector'] },
  { to: '/customers', label: 'Customers', icon: Users, roles: ['admin', 'staff'] },
  { to: '/cars', label: 'Cars', icon: CarFront, roles: ['admin', 'staff'] },
  { to: '/lookups', label: 'Lookups', icon: Settings2, roles: ['admin', 'staff'] },
  { to: '/booking', label: 'Booking', icon: CalendarPlus, roles: ['admin', 'staff'] },
  { to: '/rentals', label: 'Rentals', icon: FileText, roles: ['admin', 'staff'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'staff'] },
  { to: '/inspection-queue', label: 'Inspection Queue', icon: ClipboardCheck, roles: ['inspector'] },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const role = ((user as any)?.role ?? 'staff') as Role;
  const items = navItems.filter((i) => i.roles.includes(role));

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'} bg-apple-dark-900 text-apple-dark-200 border-r border-apple-dark-800 shadow-apple transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-apple-dark-800">
        {collapsed ? (
          <LogoIcon className="text-apple-accent-blue mx-auto" size={24} />
        ) : (
          <div className="flex items-center gap-2">
            <LogoIcon className="text-apple-accent-blue" size={24} />
            <span className="font-bold text-apple-dark-50">CarRental</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-apple hover:bg-apple-dark-800 text-apple-dark-400 hover:text-apple-dark-50 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-2 border-b border-apple-dark-800">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-apple ${
              role === 'admin'
                ? 'bg-apple-accent-purple/20 text-apple-accent-purple'
                : role === 'inspector'
                  ? 'bg-apple-accent-orange/20 text-apple-accent-orange'
                  : 'bg-apple-accent-blue/20 text-apple-accent-blue'
            }`}
          >
            {role}
          </span>
          <p className="text-[11px] text-apple-dark-400 mt-1 truncate">{(user as any)?.full_name}</p>
        </div>
      )}

      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'rounded-apple py-2.5 text-sm font-medium transition-colors duration-200 flex items-center gap-3',
                collapsed ? 'justify-center px-0' : 'px-3',
                isActive
                  ? 'bg-apple-dark-700 text-apple-dark-50 shadow-apple-sm'
                  : 'text-apple-dark-300 hover:bg-apple-dark-800 hover:text-apple-dark-50',
              ].join(' ')
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
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
      className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 text-slate-200 border-r border-slate-800 shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-slate-800">
        {collapsed ? (
          <LogoIcon className="text-blue-400 mx-auto" size={24} />
        ) : (
          <div className="flex items-center gap-2">
            <LogoIcon className="text-blue-400" size={24} />
            <span className="font-bold text-white">CarRental</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-2 border-b border-slate-800">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              role === 'admin'
                ? 'bg-purple-500/20 text-purple-300'
                : role === 'inspector'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            {role}
          </span>
          <p className="text-[11px] text-slate-400 mt-1 truncate">{(user as any)?.full_name}</p>
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
                'rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 flex items-center gap-3',
                collapsed ? 'justify-center px-0' : 'px-3',
                isActive
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
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
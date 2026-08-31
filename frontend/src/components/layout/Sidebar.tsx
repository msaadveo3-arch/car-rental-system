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

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const role = ((user as any)?.role ?? 'staff') as Role;
  const items = navItems.filter((i) => i.roles.includes(role));

  return (
    <aside
      className={`${collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex h-screen w-[min(19rem,86vw)] shrink-0 flex-col overflow-hidden border-r border-neutral-content/10 bg-neutral text-neutral-content shadow-redwood-lg transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0`}
      aria-label="Primary navigation"
    >
      <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-neutral-content/10 px-4 lg:px-3">
        {collapsed ? (
          <LogoIcon className="mx-auto text-neutral-content" size={24} />
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-btn bg-neutral-content/10">
              <LogoIcon className="text-neutral-content" size={21} aria-hidden />
            </span>
            <div className="leading-tight">
              <span className="block text-sm font-semibold">Car Rental</span>
              <span className="block text-[10px] tracking-wide text-neutral-content/55">Fleet operations</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-xs hidden shrink-0 text-neutral-content/70 transition-colors hover:bg-neutral-content/10 hover:text-neutral-content lg:inline-flex"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wide text-neutral-content/45">
            Workspace
          </p>
        )}
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-btn py-2.5 text-sm font-medium transition-colors duration-200',
                collapsed ? 'lg:justify-center lg:px-0' : 'px-3',
                isActive
                  ? 'bg-neutral-content/15 text-neutral-content'
                  : 'text-neutral-content/70 hover:bg-neutral-content/10 hover:text-neutral-content',
              ].join(' ')
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            <span className={`${collapsed ? 'lg:hidden' : ''} whitespace-nowrap`}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-content/10 p-3">
        <div className={`${collapsed ? 'lg:justify-center' : ''} flex items-center gap-3 rounded-btn px-2 py-2`}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-content/10 text-sm font-semibold">
            {((user as any)?.full_name ?? (user as any)?.name ?? 'U').charAt(0).toUpperCase()}
          </span>
          <div className={`${collapsed ? 'lg:hidden' : ''} min-w-0`}>
            <p className="truncate text-sm font-medium">{(user as any)?.full_name ?? (user as any)?.name ?? 'User'}</p>
            <p className="text-xs capitalize text-neutral-content/55">{role} access</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

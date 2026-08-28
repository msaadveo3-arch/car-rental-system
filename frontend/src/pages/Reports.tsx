import React from 'react';
import { BarChart3, CalendarDays, FileBarChart } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const Reports: React.FC = () => (
  <DashboardLayout>
    <div className="app-page">
      <div>
        <h1 className="app-page-title flex items-center gap-2"><BarChart3 className="text-primary" size={24} /> Reports</h1>
        <p className="app-page-description">Review rental activity and prepare fleet reports.</p>
      </div>

      <div role="alert" className="alert alert-info">
        <FileBarChart size={20} />
        <span>Report exports will appear here as data becomes available.</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['Rental performance', 'Fleet utilization', 'Revenue summary'].map((title) => (
          <article key={title} className="app-card"><div className="app-card-body gap-4">
            <div className="flex items-start justify-between"><h2 className="app-section-title">{title}</h2><CalendarDays className="text-base-content/50" size={20} /></div>
            <p className="app-text-secondary text-sm">Choose a reporting period to generate an export.</p>
            <div className="card-actions justify-end"><span className="badge badge-primary badge-outline">Coming soon</span></div>
          </div></article>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Reports;

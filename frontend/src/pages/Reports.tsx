import React from 'react';
import { BarChart3, CalendarDays, FileBarChart } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { RedwoodEmptyState, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

const Reports: React.FC = () => (
  <DashboardLayout>
    <RedwoodPage>
      <RedwoodPageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Review rental activity, fleet utilization, and financial performance."
        icon={<BarChart3 size={21} />}
      />

      <div role="alert" className="alert alert-info">
        <FileBarChart size={20} />
        <span>Report exports will appear here as data becomes available.</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['Rental performance', 'Fleet utilization', 'Revenue summary'].map((title) => (
          <RedwoodSection key={title} title={title} actions={<CalendarDays className="text-base-content/45" size={19} aria-hidden />}>
            <RedwoodEmptyState
              icon={<FileBarChart size={21} />}
              title="Report not available yet"
              description="Period selection and export generation will be added in a future reporting release."
            />
          </RedwoodSection>
        ))}
      </div>
    </RedwoodPage>
  </DashboardLayout>
);

export default Reports;

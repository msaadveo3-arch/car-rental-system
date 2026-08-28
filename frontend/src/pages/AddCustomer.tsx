import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerForm, { Customer } from '../components/customers/CustomerForm';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();

  const handleSaved = (c: Customer) => {
    // ابقِ العميل الجديد في الكاش عشان يظهر فورًا في قائمة العملاء
    // (لو عندك state global هتستعمله، هنا بنعتمد على الـ reload الطبيعي في الصفحة الجاية)
    navigate('/customers');
  };

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/customers" className="p-2 hover:bg-base-300 rounded-lg text-base-content/80">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <UserPlus className="text-primary" size={24} /> Add New Customer
              </h1>
              <p className="text-base-content/60 text-sm mt-1">Create a new customer record</p>
            </div>
          </div>

          <CustomerForm
            onSaved={handleSaved}
            onCancel={() => navigate('/customers')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddCustomer;

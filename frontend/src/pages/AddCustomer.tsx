import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerForm, { Customer } from '../components/customers/CustomerForm';
import { RedwoodPage, RedwoodPageHeader } from '../components/common/RedwoodPage';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();

  const handleSaved = (c: Customer) => {
    // ابقِ العميل الجديد في الكاش عشان يظهر فورًا في قائمة العملاء
    // (لو عندك state global هتستعمله، هنا بنعتمد على الـ reload الطبيعي في الصفحة الجاية)
    navigate('/customers');
  };

  return (
    <DashboardLayout>
      <RedwoodPage>
          <RedwoodPageHeader
            eyebrow="Advanced create"
            title="Add customer"
            description="Create the identity, driving credential, and contact record used in rental contracts."
            icon={<UserPlus size={21} />}
            backLabel="Customers"
            onBack={() => navigate('/customers')}
          />

          <CustomerForm
            onSaved={handleSaved}
            onCancel={() => navigate('/customers')}
          />
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default AddCustomer;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCog } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerForm, { Customer } from '../components/customers/CustomerForm';
import { RedwoodContextItem, RedwoodPage, RedwoodPageHeader } from '../components/common/RedwoodPage';

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/customers')
      .then((res) => {
        const c = res.data.data.find((c: Customer) => c.id === Number(id));
        if (!c) {
          setError('Customer not found');
          return;
        }
        setCustomer(c);
      })
      .catch(() => setError('Failed to load customer'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaved = (c: Customer) => {
    navigate('/customers');
  };

  return (
    <DashboardLayout>
      <RedwoodPage>
          <RedwoodPageHeader
            eyebrow="Advanced edit"
            title={customer?.name ?? `Customer #${id}`}
            description="Update customer identity, credentials, and contact information."
            icon={<UserCog size={21} />}
            backLabel="Customers"
            onBack={() => navigate('/customers')}
            context={customer ? <><RedwoodContextItem label="Customer ID" value={customer.id} /><RedwoodContextItem label="Phone" value={customer.phone} /></> : undefined}
          />

          {loading ? (
        <div className="app-card p-12 text-center text-base-content/60">Loading…</div>
          ) : error ? (
            <div role="alert" className="alert alert-error">
              {error}
            </div>
          ) : (
            customer && (
              <CustomerForm
                initial={customer}
                onSaved={handleSaved}
                onCancel={() => navigate('/customers')}
              />
            )
          )}
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default EditCustomer;

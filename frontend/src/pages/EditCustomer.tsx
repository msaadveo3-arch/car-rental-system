import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserCog, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerForm, { Customer } from '../components/customers/CustomerForm';

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
      <div className="p-6">
        <div className="mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/customers" className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserCog className="text-blue-600" size={24} /> Edit Customer #{id}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Update customer information</p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCustomer;
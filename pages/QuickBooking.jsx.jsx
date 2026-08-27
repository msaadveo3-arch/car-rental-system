import React, { useState } from 'react';
import { User, Car, Calendar, CreditCard, CheckCircle } from 'lucide-react';

const QuickBooking = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-8">Reservation #RB-2024-889 has been created.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Another Booking
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quick Booking</h1>
        <p className="text-gray-500">Create a new rental reservation manually.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <User size={20} />
            <h3 className="font-semibold text-lg">Customer Info</h3>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
            
            <label className="block text-sm font-medium text-gray-700">Driver's License</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="DL-XXXXXXX" />
            
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input required type="tel" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        {/* Vehicle & Dates Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Car size={20} />
            <h3 className="font-semibold text-lg">Vehicle & Schedule</h3>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select Vehicle</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option>Tesla Model 3 (White)</option>
              <option>Ford Mustang GT (Red)</option>
              <option>Toyota RAV4 (Silver)</option>
              <option>Mercedes C-Class (Black)</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pick-up</label>
                <input required type="datetime-local" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drop-off</label>
                <input required type="datetime-local" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="md:col-span-2 flex justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center gap-2"
          >
            {status === 'submitting' ? 'Processing...' : 'Confirm Booking'}
            <CreditCard size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickBooking;
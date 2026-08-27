import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, ChevronRight, Box } from 'lucide-react';

// Mock data for demonstration
const INSPECTION_DATA = [
  { id: 1, car: 'Tesla Model 3', plate: 'ABC-1234', customer: 'Alice Freeman', due: 'Today, 2:00 PM', status: 'Pending', priority: 'High' },
  { id: 2, car: 'Ford Mustang', plate: 'XYZ-9876', customer: 'Bob Smith', due: 'Today, 4:30 PM', status: 'Scheduled', priority: 'Normal' },
  { id: 3, car: 'BMW X5', plate: 'LMN-4567', customer: 'Charlie Davis', due: 'Tomorrow, 9:00 AM', status: 'Overdue', priority: 'Critical' },
];

const InspectionQueue = () => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection Queue</h1>
          <p className="text-gray-500">Manage vehicle condition checks before handover.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search plate or customer..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {INSPECTION_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.car}</div>
                  <div className="text-sm text-gray-500">{item.plate}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.customer}</td>
                <td className="px-6 py-4 text-gray-600">{item.due}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => navigate(`/inspection-view/${item.id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Box size={16} />
                    Start 3D Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {INSPECTION_DATA.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            No inspections pending at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionQueue;
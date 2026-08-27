import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, ZoomIn, AlertCircle } from 'lucide-react';

const Inspection3D = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/inspections')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-gray-900">3D Damage Inspection</h2>
            <p className="text-xs text-gray-500">Booking ID: #{id} • Tesla Model 3</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium border border-yellow-100">
            <AlertCircle size={16} />
            <span>2 Existing Damages Found</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Reset View">
            <RotateCcw size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Zoom In">
            <ZoomIn size={20} />
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
            <Save size={18} />
            Save Report
          </button>
        </div>
      </div>

      {/* 3D Viewer Container */}
      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden relative shadow-inner border border-slate-800">
        {/* 
          NOTE: Replace the src below with your actual 3D model viewer URL.
          Using a placeholder wireframe/shapes site for demonstration.
        */}
        <iframe 
          src="https://my.spline.design/3dcarplaceholder/" 
          title="3D Car Inspection"
          className="w-full h-full border-0"
          allowFullScreen
        />
        
        {/* Overlay Instructions */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-3 rounded-lg text-sm pointer-events-none">
          <p className="font-medium mb-1">Inspector Controls</p>
          <p className="text-gray-300 text-xs">• Click & Drag to rotate vehicle</p>
          <p className="text-gray-300 text-xs">• Scroll to zoom in/out</p>
          <p className="text-gray-300 text-xs">• Click on car body to mark damage</p>
        </div>
      </div>
    </div>
  );
};

export default Inspection3D;
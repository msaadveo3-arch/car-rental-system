import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import Cars from './pages/Cars';
import Lookups from './pages/Lookups';
import InspectionQueue from './pages/InspectionQueue';
import Reports from './pages/Reports';
import Inspection3D from './pages/Inspection3D';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CarForm from './pages/CarForm';
import Booking from './pages/Booking';
import Rentals from './pages/Rentals';
import RentalDetails from './pages/RentalDetails';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/add" element={<CarForm />} />
            <Route path="/cars/edit/:id" element={<CarForm />} />
            <Route path="/lookups" element={<Lookups />} />
            <Route path="/inspection-queue" element={<InspectionQueue />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/inspection-view/:id" element={<Inspection3D />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rentals/:id" element={<RentalDetails />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

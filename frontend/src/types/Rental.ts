export type Rental = {
  id: number;
  carId: number;
  customerId: number;
  startDate: string;
  endDate?: string;
  status: 'booked' | 'active' | 'completed' | 'cancelled';
};

export type UserRole = 'employer' | 'employee';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface TimeEntry {
  id: number;
  date: string; // ISO format: YYYY-MM-DD
  employee: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  task: string;
  customer: string;
  hours: number;
}

export interface SupplyEntry {
  id: number;
  date: string;
  employee: string;
  business: 'Fürst Hauser Gebäudereinigung' | 'Bullauge Waschsalon';
  item: string;
  issued: number;
  returned: number;
}
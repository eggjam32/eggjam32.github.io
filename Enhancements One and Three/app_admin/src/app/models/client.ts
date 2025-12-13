export interface Client {
  _id: string;
  name: string;
  dob: string; // ISO date string
  address: string;
  email: string;
  accountType: 'retirement' | 'brokerage';
}

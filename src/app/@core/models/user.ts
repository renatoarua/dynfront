import { Order } from './payment'

export class User {
  id: number;
  row_num: number;
  username: string;
  email: string;
  picture: string;
  password: string;
  last_login_at: string;
  last_login_ip: string;
  confirmed_at: string;
  blocked_at: string;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;

  orders: Order[];
  credit: number;
  debit: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

import { AdminUser } from '../types';

interface ExtendedAdminUser extends AdminUser {
  totalUsers: number;
  balance: string;
}

export const admins: ExtendedAdminUser[] = [
  {
    id: "1",
    name: "Admin Control",
    role: "admin",
    status: "active",
    totalUsers: 150,
    balance: "500000",
    lastActive: "2024-03-15T10:30:00",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    email: "admin@magicplay.info",
    phone: "+1234567890"
  },
  {
    id: "2",
    name: "Senior Sub Admin",
    role: "ss-admin",
    status: "active",
    totalUsers: 85,
    balance: "250000",
    lastActive: "2024-03-15T09:45:00",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    email: "ss-admin@magicplay.info",
    phone: "+1234567891"
  },
  {
    id: "3",
    name: "Sub Admin",
    role: "sub-admin",
    status: "active",
    totalUsers: 45,
    balance: "120000",
    lastActive: "2024-03-15T08:15:00",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    email: "sub-admin@magicplay.info",
    phone: "+1234567892"
  },
  {
    id: "4",
    name: "Super Agent",
    role: "super-agent",
    status: "active",
    totalUsers: 25,
    balance: "75000",
    lastActive: "2024-03-15T11:20:00",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    email: "super-agent@magicplay.info",
    phone: "+1234567893"
  },
  {
    id: "5",
    name: "Master Agent",
    role: "master-agent",
    status: "active",
    totalUsers: 10,
    balance: "35000",
    lastActive: "2024-03-15T10:00:00",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    email: "master-agent@magicplay.info",
    phone: "+1234567894"
  }
];
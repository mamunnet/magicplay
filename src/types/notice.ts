export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NoticeFormData {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'reader';
  quota: number;
  currentBorrowing: number;
  penaltyStatus: string;
  createdAt: string;
}

export interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  categoryId: string;
  totalQuantity: number;
  availableQuantity: number;
  isHidden: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  readerId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowing' | 'overdue' | 'returned' | 'pending';
  overdueNote: string;
  createdAt: string;
  approvedAt: string | null;
  requestedBy: 'admin' | 'reader';
}

export const defaultAdmin: User = {
  id: 'admin-001',
  email: 'admin@library.com',
  password: 'admin123',
  fullName: 'Quản Trị Viên',
  phone: '0123456789',
  role: 'admin',
  quota: 999,
  currentBorrowing: 0,
  penaltyStatus: '',
  createdAt: new Date().toISOString(),
};

export const defaultCategories: Category[] = [
  { id: 'cat-001', name: 'Văn học' },
  { id: 'cat-002', name: 'Khoa học' },
  { id: 'cat-003', name: 'Đời sống' },
  { id: 'cat-004', name: 'Trinh thám' },
  { id: 'cat-005', name: 'Lịch sử' },
];

export const defaultBooks: Book[] = [
  {
    id: 'book-001',
    code: 'VH001',
    title: 'Số đỏ',
    author: 'Vũ Trọng Phụng',
    categoryId: 'cat-001',
    totalQuantity: 10,
    availableQuantity: 8,
    isHidden: false,
  },
  {
    id: 'book-002',
    code: 'KH001',
    title: 'Vũ trụ trong vỏ hạt dẻ',
    author: 'Stephen Hawking',
    categoryId: 'cat-002',
    totalQuantity: 5,
    availableQuantity: 3,
    isHidden: false,
  },
  {
    id: 'book-003',
    code: 'TT001',
    title: 'Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    categoryId: 'cat-004',
    totalQuantity: 15,
    availableQuantity: 12,
    isHidden: false,
  },
];

export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
  }
  if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(defaultBooks));
  }
  if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }
};
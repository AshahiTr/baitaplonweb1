import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createBook, updateBook } from '../../redux/booksSlice';
import { fetchCategories } from '../../redux/categoriesSlice';
import './Book.css';

interface BookFormProps {
  book?: any;
  onClose: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onClose }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    author: '',
    categoryId: '',
    totalQuantity: 0,
    availableQuantity: 0,
    isHidden: false,
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (book) {
      setFormData(book);
    }
  }, [book, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      await dispatch(updateBook({ id: book.id, updates: formData }));
    } else {
      await dispatch(createBook(formData));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{book ? 'Sửa Thông Tin Sách' : 'Thêm Sách Mới'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã sách:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tên sách:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tác giả:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Thể loại:</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn thể loại --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tổng số sách:</label>
            <input
              type="number"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số lượng còn lại:</label>
            <input
              type="number"
              name="availableQuantity"
              value={formData.availableQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {book ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;

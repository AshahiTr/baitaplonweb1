import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { createCategory, updateCategory } from '../../redux/categoriesSlice';
import './Category.css';

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      await dispatch(updateCategory({ id: category.id, name }));
    } else {
      await dispatch(createCategory(name));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{category ? 'Sửa Thể Loại' : 'Thêm Thể Loại'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên thể loại:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {category ? 'Cập nhật' : 'Thêm mới'}
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

export default CategoryForm;

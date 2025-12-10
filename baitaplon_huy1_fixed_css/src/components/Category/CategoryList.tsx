import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCategories, deleteCategory } from '../../redux/categoriesSlice';
import CategoryForm from './CategoryForm';
import './Category.css';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thể loại này?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  return (
    <div className="category-list-container">
      <div className="list-header">
        <h2>Quản Lý Thể Loại Sách</h2>
        <button className="btn-primary" onClick={() => { setEditingCategory(null); setShowForm(true); }}>
          Thêm Thể Loại
        </button>
      </div>

      <div className="category-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <div className="category-actions">
              <button className="btn-small btn-edit" onClick={() => handleEdit(category)}>Sửa</button>
              <button className="btn-small btn-delete" onClick={() => handleDelete(category.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => { setShowForm(false); setEditingCategory(null); }}
        />
      )}
    </div>
  );
};

export default CategoryList;

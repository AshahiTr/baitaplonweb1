import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBooks, updateBook, deleteBook } from '../../redux/booksSlice';
import { fetchCategories } from '../../redux/categoriesSlice';
import BookForm from './BookForm';
import './Book.css';

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { categories } = useAppSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const handleToggleHidden = (book: any) => {
    dispatch(updateBook({ id: book.id, updates: { isHidden: !book.isHidden } }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      dispatch(deleteBook(id));
    }
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2>Quản Lý Sách</h2>
        <button className="btn-primary" onClick={() => { setEditingBook(null); setShowForm(true); }}>
          Thêm Sách Mới
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Tổng số</th>
              <th>Còn lại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td>{book.code}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{getCategoryName(book.categoryId)}</td>
                <td>{book.totalQuantity}</td>
                <td>{book.availableQuantity}</td>
                <td>
                  <span className={`status-badge ${book.isHidden ? 'hidden' : 'visible'}`}>
                    {book.isHidden ? 'Ẩn' : 'Hiện'}
                  </span>
                </td>
                <td>
                  <button className="btn-small btn-edit" onClick={() => handleEdit(book)}>Sửa</button>
                  <button className="btn-small btn-toggle" onClick={() => handleToggleHidden(book)}>
                    {book.isHidden ? 'Bỏ ẩn' : 'Ẩn'}
                  </button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(book.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={() => { setShowForm(false); setEditingBook(null); }}
        />
      )}
    </div>
  );
};

export default BookList;

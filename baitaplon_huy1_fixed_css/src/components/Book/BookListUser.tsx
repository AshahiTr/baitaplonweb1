import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBooks } from '../../redux/booksSlice';
import { fetchCategories } from '../../redux/categoriesSlice';
import './Book.css';

const BookListUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books } = useAppSelector((state) => state.books);
  const { categories } = useAppSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const visibleBooks = books.filter(book => !book.isHidden);
  const filteredBooks = visibleBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2>Sách Thư Viện</h2>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookListUser;

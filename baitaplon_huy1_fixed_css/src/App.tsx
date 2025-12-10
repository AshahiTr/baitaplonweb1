import React, { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { loadUser } from './redux/authSlice';

import AppRouter from './routes/AppRouter';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    
    dispatch(loadUser());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;

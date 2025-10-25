'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '@/store/slices/userSlice';

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        dispatch(clearUser());
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}

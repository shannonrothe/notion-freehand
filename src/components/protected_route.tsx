import { User } from '@supabase/supabase-js';
import { makeAutoObservable } from 'mobx';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/use_auth';

class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}

export const userStore = new UserStore();

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();

  if (!user) {
    return (
      <Navigate
        to={`/login?${new URLSearchParams({
          return: window.location.href,
        }).toString()}`}
      />
    );
  }
  return <>{children}</>;
};

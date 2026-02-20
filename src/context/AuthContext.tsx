import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: { name: string; role: 'buyer' | 'seller' } | null;
  isReady: boolean;
  signIn: (role: 'buyer' | 'seller') => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isReady, setIsReady] = useState(false); // <--- Agregamos esto

  // Simulamos que cargamos el usuario (aunque sea de mentira)
  React.useEffect(() => {
    setIsReady(true);
  }, []);

  const signIn = (role: 'buyer' | 'seller') => {
    setUser({ name: 'Gadri', role });
  };

  const signOut = () => setUser(null);

  return (
    // Pasamos isReady para que el Layout sepa cuándo puede navegar
    <AuthContext.Provider value={{ user, signIn, signOut, isReady }}> 
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
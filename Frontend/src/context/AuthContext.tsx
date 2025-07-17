// import React, { createContext, useContext, useEffect, useState } from "react";
// import { User, getAuth, onAuthStateChanged } from "firebase/auth";
// import firebaseApp from "../app/lib/FirebaseConfig"; // ←自分のパスに合わせて修正

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const auth = getAuth(firebaseApp);
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedPage } from './pages/FeedPage';
import { AuthPage } from './pages/AuthPage';
import { PostCreationPage } from './pages/PostCreationPage';
import { Plus, User, LogOut } from 'lucide-react';
import { playSE } from './lib/sound';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b-4 border-black p-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl md:text-3xl font-black bg-black text-white px-2 -rotate-1">
          STREET TSUKKOMI
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <Link 
                to="/post" 
                onClick={() => playSE(7)}
                className="neo-brutal-btn bg-matrix-green p-2 md:px-4"
              >
                <Plus size={24} />
              </Link>
              <button onClick={logout} className="neo-brutal-btn bg-punch-red text-white p-2">
                <LogOut size={24} />
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              onClick={() => playSE(8)}
              className="neo-brutal-btn bg-cyber-yellow flex items-center gap-2"
            >
              <User size={24} /> ログイン
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen pb-20">
          <Navbar />
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/post" element={<PostCreationPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

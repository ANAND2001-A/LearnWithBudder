import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </div>
  );
}

export default Layout;

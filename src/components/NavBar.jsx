import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const navigate=useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
};

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white bg-opacity-95 backdrop-blur-md shadow-sm' : 'py-6 bg-white'} overflow-x-hidden`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-3xl mr-2">📚</span>
          <span className="text-xl font-bold text-blue-600">Student Fee Management System</span>
        </div>

        <div className="hidden md:flex space-x-8">
          <Link to="/">
            <div className="text-gray-700 hover:text-blue-600 font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </Link>
          <Link to="/studentlist">
            <div className="text-gray-700 hover:text-blue-600 font-medium relative group">
              Student List
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </Link>
          <Link to="/myprofile">
            <div className="text-gray-700 hover:text-blue-600 font-medium relative group">
              My Profile
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </Link>
          <div className='flex items-center gap-3 py-4 px-6 mt-auto text-gray-500 cursor-pointer transition-all duration-200 ease-in-out'
          onClick={handleLogout}>
              <FiLogOut className="text-[18px]" />
              <span>Logout</span>
            </div>
        </div>

        <button onClick={toggleMenu} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/studentlist" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">
              Student List
            </Link>
            <Link to="/myprofile" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">
              My Profile
            </Link>
            <div className='text-gray-700 hover:text-blue-600 font-medium'
            onClick={handleLogout}>
              <span>Logout</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

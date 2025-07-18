import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Student Profiles",
      description: "Comprehensive student records with academic and personal information all in one place.",
      icon: "👨‍🎓"
    },
    {
      title: "Attendance Tracking",
      description: "Efficiently track and manage student attendance with our intuitive system.",
      icon: "📅"
    },
    {
      title: "Performance Analytics",
      description: "Detailed analytics and reports on student performance and progress.",
      icon: "📊"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll contact you at ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-white bg-opacity-95 backdrop-blur-md shadow-sm' : 'py-6 bg-white'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-2">📚</span>
            <span className="text-xl font-bold text-blue-600">Student Fee Management System</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Streamline Student Fee Payments <span className="text-blue-600 relative">
                Simple, Secure, Smart.
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10"></span>
              </span>
            </h1>
           
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <Link to="/login" className="w-full sm:w-auto">
              <div className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-[20px] rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl text-center">
                Login
              </div>
            </Link>
            
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 cursor-pointer border border-blue-600 text-blue-600 text-[20px] rounded-full font-medium hover:bg-blue-50 transition-colors duration-300 text-center">
                Sign Up
              </button>
            </Link>
          </div>
          </div>
          
          <div className="hidden md:block md:w-1/2 relative h-96 animate-fade-in-right">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-0 bg-white px-6 py-3 rounded-lg shadow-md animate-float">
                <span className="text-xl mr-2">📋</span>
                <span className="font-medium">Student List</span>
              </div>
              <div className="absolute bottom-20 right-0 bg-white px-6 py-3 rounded-lg shadow-md animate-float animation-delay-1000">
                <span className="text-xl mr-2">📈</span>
                <span className="font-medium">Payment Gateway</span>
              </div>
              <div className="absolute bottom-0 left-1/4 bg-white px-6 py-3 rounded-lg shadow-md animate-float animation-delay-2000">
                <span className="text-xl mr-2">👩‍🏫</span>
                <span className="font-medium">Student Profile</span>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full flex items-center justify-center text-6xl">
                🎓
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white px-4 md:px-6">
        <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Ahead on Your Fees</h2>
        <p className="mb-8 opacity-90">
            Get timely updates, payment reminders, and important fee notifications delivered right to your inbox.
        </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-full border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Student Fee Management System</h3>
              <p className="text-gray-400 mb-6">
                Empowering educational institutions with innovative technology solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <span>📱</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <span>📸</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Updates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Tutorials</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Student Fee Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiUser, FiMail, FiHash, FiCreditCard, FiCalendar, FiX, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import NavBar from '../NavBar';
import io from 'socket.io-client';

const generateCaptcha = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const MyProfile = () => {
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editedData, setEditedData] = useState(null);

  const [isFeePanelOpen, setIsFeePanelOpen] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    const studentId = localStorage.getItem('userId');
    if (!studentId) {
      setError("Student ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    const socket = io("https://sms-b-oaox.onrender.com"); 

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('getStudent', studentId, (response) => {
        if (response && response.success) {
          setStudentData(response.data);
          setEditedData(response.data);
        } else {
          setError(response?.error || "Failed to fetch profile data");
        }
        setIsLoading(false);
      });
    });

    socket.on('connect_error', () => {
      setError("Cannot connect to the server. Please check your connection.");
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!editedData.sname || !editedData.email) {
      alert("Name and email are required");
      return;
    }

    setIsSaving(true); 

    const socket = io("https://sms-b-oaox.onrender.com");

    socket.on('connect', () => {
        const updateData = {
            id: studentData._id, 
            sname: editedData.sname.trim(),
            email: editedData.email.trim(),
        };

        socket.emit('updateStudent', updateData, (response) => {
            if (response?.success) {
                setStudentData(response.data);
                setIsEditPanelOpen(false);
            } else {
                alert(response?.error || "Update failed."); 
            }
            setIsSaving(false); 
            socket.disconnect();
        });
    });
    
    socket.on('connect_error', () => {
        alert("Connection error. Could not save.");
        setIsSaving(false); 
        socket.disconnect();
    });
};

  const handleCaptchaSubmit = () => {
    if (captchaInput.toLowerCase() === captchaText.toLowerCase()) {
      setCaptchaError('');
      navigate('/payfee');
    } else {
      setCaptchaError('Invalid captcha. Please try again.');
      setCaptchaText(generateCaptcha()); 
      setCaptchaInput(''); 
    }
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setCaptchaError('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">Loading Profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar/>
      <div className="bg-gray-50 min-h-screen overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className={`absolute top-15 right-0 mt-4 mr-4 bg-white rounded-lg shadow-2xl p-6 z-20 w-80 transition-all duration-300 ease-in-out
            ${isEditPanelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
              <button onClick={() => setIsEditPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <input 
                  type="text" 
                  name="sname" 
                  value={editedData?.sname || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editedData?.email || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditPanelOpen(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed "
                    >
                    {isSaving ? 'Saving...' : 'Save'} 
                    </button>
              </div>
            </form>
          </div>
          <div className='bg-blue-100 px-5 py-5 rounded-[25px] mt-10'>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
              <button
                onClick={() => setIsEditPanelOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-200 rounded-full hover:bg-blue-200 transition-colors"
              >
                <FiEdit size={14} />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoItem icon={<FiUser />} label="Full Name" value={studentData?.sname} />
              <InfoItem icon={<FiMail />} label="Email Address" value={studentData?.email} />
              <InfoItem icon={<FiHash />} label="Student ID" value={studentData?.id} />
              <InfoItem 
                icon={<FiCreditCard />} 
                label="Fee Status" 
                value={studentData?.fees ? 'paid' : 'unpaid'}
                isStatus={true}
              />
            </div>
          </div>
          <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-5">
            {studentData?.fees === false ? (
              <div className="p-6 bg-rose-50 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertTriangle className="h-6 w-6 text-rose-500" aria-hidden="true" />
                  </div>
                  <div className="ml-4 w-full">
                    <h3 className="text-lg font-bold text-rose-800">Fee Payment Due</h3>
                    <div className="mt-2 text-sm text-rose-700">
                      <p>Fee payment is pending. Please pay your fees soon to avoid late charges </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-md border border-rose-200">
                      <div><span className="font-semibold">Amount:</span> 65000.00</div>
                      <div><span className="font-semibold">Due Date:</span> 2025-8-15</div>
                    </div>

                    <div className="mt-4">
                      {!isFeePanelOpen ? (
                        <button 
                          onClick={() => setIsFeePanelOpen(true)} 
                          className="px-6 py-2 font-semibold cursor-pointer text-white bg-rose-600 rounded-md hover:bg-rose-700 transition-transform hover:scale-105"
                        >
                          Pay Fee Now
                        </button>
                      ) : (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 transition-all duration-300">
                          <p className="font-semibold text-gray-800 mb-2">Please complete the security check to proceed.</p>
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="select-none tracking-widest font-mono text-xl p-2 bg-gray-200 rounded-md text-gray-800 italic">
                                {captchaText}
                              </span>
                              <button onClick={refreshCaptcha} className="p-2 text-gray-500 hover:text-blue-600">
                                <FiRefreshCw />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={captchaInput}
                              onChange={(e) => setCaptchaInput(e.target.value)}
                              placeholder="Enter text above"
                              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                              onClick={handleCaptchaSubmit} 
                              className="w-full sm:w-auto px-4 py-2 cursor-pointer font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                              Verify & Proceed
                            </button>
                          </div>
                          {captchaError && <p className="text-red-600 text-sm mt-2">{captchaError}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-green-800">Fees Paid</h3>
                    <p className="mt-2 text-sm text-green-700">
                    Thank you! Your fee has been successfully paid. 
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ icon, label, value, isStatus = false }) => (
  <div className=''>
    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </label>
    {isStatus ? (
      <span className={`mt-1 text-sm font-semibold px-2.5 py-0.5 rounded-full ${value === 'paid' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
        {value === 'paid' ? 'Paid' : 'Unpaid'}
      </span>
    ) : (
      <p className="mt-1 text-lg text-gray-900">{value}</p>
    )}
  </div>
);

export default MyProfile;
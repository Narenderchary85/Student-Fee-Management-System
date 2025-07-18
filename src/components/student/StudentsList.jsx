import React, { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import NavBar from '../NavBar';
import io from "socket.io-client";


const SOCKET_URL = "https://sms-b-oaox.onrender.com";

const StudentsList = () => {

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {

      socket.emit("getStudentDetails", (response) => {
        setIsLoading(false); 
        
        if (response && response.success) {
          const formattedData = response.data.map(student => ({
            id: student.id,
            name: student.sname,      
            email: student.email,
            feeStatus: !!student.fees
          }));
          setStudents(formattedData);
        } else {
          console.error("Error fetching data:", response.error);
          setError("Failed to load student data. Please try again later.");
        }
      });
    });

    socket.on('connect_error', () => {
      setIsLoading(false);
      setError("Could not connect to the server. Please check the connection.");
      console.error("Socket connection failed.");
    });

    return () => {
      socket.disconnect();
    };
  }, []); 


  const sortedStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    
    const filtered = students.filter(student => {
      const matchesSearch =
        (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.id || '').toString().includes(searchTerm);
        const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'paid' && student.feeStatus === true) ||
        (filterStatus === 'unpaid' && student.feeStatus === false);
      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [students, searchTerm, filterStatus, sortConfig]);


  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (isPaid) => {
    return isPaid ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700';
  };

  const SortableHeader = ({ label, sortKey }) => (
    <div
      className="flex items-center space-x-1 cursor-pointer select-none"
      onClick={() => requestSort(sortKey)}
    >
      <span>{label}</span>
      {sortConfig.key === sortKey ? (
        sortConfig.direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />
      ) : null}
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student Records</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <FiSearch className="absolute text-gray-400 top-1/2 left-3 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
                <FiFilter className="absolute text-gray-400 top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500 font-semibold">Loading students...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
            ) : (
              <>
                <div className="hidden md:flex bg-gray-50 rounded-t-lg px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="w-1/6"><SortableHeader label="ID" sortKey="id" /></div>
                  <div className="w-2/6"><SortableHeader label="Name" sortKey="name" /></div>
                  <div className="w-2/6"><SortableHeader label="Email" sortKey="email" /></div>
                  <div className="w-1/6"><SortableHeader label="Fee Status" sortKey="feeStatus" /></div>
                </div>

                <div className="space-y-3 mt-3 md:mt-0">
                  {sortedStudents.length > 0 ? (
                    sortedStudents.map((student) => (
                      <div key={student.id} className="bg-sky-50 hover:bg-sky-100 rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="hidden md:block md:w-1/6 font-medium text-gray-800">{student.id}</div>
                          <div className="w-full md:w-4/6 flex flex-col md:flex-row md:space-x-4">
                            <div className="md:w-1/2">
                              <div className="font-bold text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600 md:hidden">{student.email}</div>
                            </div>
                            <div className="hidden md:block md:w-1/2 text-sm text-gray-600">{student.email}</div>
                          </div>
                          <div className="w-full md:w-1/6 mt-2 md:mt-0 rounded-lg">
                          <span className={`px-2.5 py-0.5 rounded-lg ... ${getStatusColor(student.feeStatus)}`}>
                              {student.feeStatus ? 'Paid' : 'Unpaid'}
                          </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <p className="font-semibold">No students found</p>
                      <p className="text-sm">Try adjusting your search or filter.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsList;
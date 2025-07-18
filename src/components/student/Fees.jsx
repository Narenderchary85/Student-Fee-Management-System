import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaypal, FaApplePay } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';
import { FiCreditCard, FiUser, FiCalendar, FiLock, FiArrowLeft} from 'react-icons/fi';
import { SiRazorpay } from "react-icons/si";
import io from 'socket.io-client';

const SuccessCheckmark = () => (
  <svg className="h-24 w-24 text-green-500" viewBox="0 0 52 52">
    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    <style>{`
      .checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 3; stroke-miterlimit: 10; stroke: #4CAF50; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
      .checkmark__check { stroke-dasharray: 48; stroke-dashoffset: 48; stroke-width: 4; stroke: #4CAF50; stroke-linecap: round; stroke-linejoin: round; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
      @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    `}</style>
  </svg>
);


const Fees = () => {
  const navigate = useNavigate();

  const [paymentState, setPaymentState] = useState('selection');
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentState('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
        let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = v.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        for (let i=0, len=match.length; i<len; i+=4) {
            parts.push(match.substring(i, i+4));
        }
        if (parts.length) {
            setCardDetails(prev => ({...prev, [name]: parts.join(' ')}));
        } else {
            setCardDetails(prev => ({...prev, [name]: value}));
        }
    } else if (name === 'expiryDate') {
        let v = value.replace(/[^0-9]/gi, '');
        if(v.length >= 2) {
           setCardDetails(prev => ({...prev, [name]: `${v.slice(0,2)} / ${v.slice(2,4)}`}));
        } else {
           setCardDetails(prev => ({...prev, [name]: v}));
        }
    } else {
        setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!cardDetails.cardName) errors.cardName = "Cardholder name is required.";
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\s\/\s\d{2}$/.test(cardDetails.expiryDate)) errors.expiryDate = "Expiry date must be in MM / YY format.";
    if (cardDetails.cvc.length < 3) errors.cvc = "CVC must be 3-4 digits.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPaymentState('processing');

    const studentId = localStorage.getItem('userId');
    if (!studentId) {
        alert("Error: Student ID not found. Please log in again.");
        setPaymentState('form');
        return;
    }

    setTimeout(() => {
        const socket = io("https://sms-b-oaox.onrender.com");
        socket.on('connect', () => {
            socket.emit('updateFeeStatus', { id: studentId, fees: true }, (response) => {
                if(response && response.success) {
                    console.log("Backend updated successfully.");
                    setPaymentState('success');
                } else {
                    alert("Payment processing failed on the server. Please try again.");
                    setPaymentState('form');
                }
                socket.disconnect();
            });
        });
    }, 2000);
  };


  const renderContent = () => {
    switch(paymentState) {
        case 'processing':
            return (
                <div className="text-center py-20">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Processing Payment...</p>
                </div>
            );
        case 'success':
            return (
                <div className="text-center py-12 flex flex-col items-center">
                    <SuccessCheckmark />
                    <h2 className="text-3xl font-bold text-gray-800 mt-6">Payment Successful!</h2>
                    <p className="text-gray-600 mt-2">Thank you for your payment. Your records have been updated.</p>
                    <button 
                        onClick={() => navigate('/myprofile')} 
                        className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to My Profile
                    </button>
                </div>
            );
        case 'form':
            return (
                <div>
                    <button onClick={() => setPaymentState('selection')} className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                        <FiArrowLeft />
                        <span>Change Payment Method</span>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Card Details</h2>
                    <form onSubmit={handlePaymentSubmit} noValidate>
                        <div className="space-y-4">
                            <InputField icon={<FiCreditCard/>} name="cardNumber" value={cardDetails.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" label="Card Number" error={formErrors.cardNumber} maxLength={19} />
                            <InputField icon={<FiUser/>} name="cardName" value={cardDetails.cardName} onChange={handleInputChange} placeholder="John Doe" label="Cardholder Name" error={formErrors.cardName} />
                            <div className="flex space-x-4">
                                <InputField icon={<FiCalendar/>} name="expiryDate" value={cardDetails.expiryDate} onChange={handleInputChange} placeholder="MM / YY" label="Expiry Date" error={formErrors.expiryDate} maxLength={7} />
                                <InputField icon={<FiLock/>} name="cvc" value={cardDetails.cvc} onChange={handleInputChange} placeholder="123" label="CVC" error={formErrors.cvc} maxLength={4} />
                            </div>
                        </div>
                        <button type="submit" className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Pay $500.00
                        </button>
                    </form>
                </div>
            );
        case 'selection':
        default:
            return (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose a Payment Method</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <PaymentMethod icon={<SiVisa size={40} className="text-blue-700"/>} label="Visa" onClick={() => handleMethodSelect('visa')} />
                        <PaymentMethod icon={<SiMastercard size={40} className="text-red-600"/>} label="Mastercard" onClick={() => handleMethodSelect('mastercard')} />
                        <PaymentMethod icon={<FaPaypal size={40} className="text-blue-800"/>} label="PayPal" onClick={() =>  handleMethodSelect('PayPal')} />
                        <PaymentMethod icon={<SiRazorpay size={40} className="text-black"/>} label="Razor Pay" onClick={() =>  handleMethodSelect('Razor Pay')} />
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4  overflow-x-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all border-2 border-blue-500">
        {renderContent()}
      </div>
    </div>
  );
};


const PaymentMethod = ({ icon, label, onClick }) => (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
    >
        {icon}
        <span className="mt-2 font-semibold text-gray-700">{label}</span>
    </div>
);

const InputField = ({ icon, name, value, onChange, placeholder, label, error, ...props }) => (
    <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {icon}
            </div>
            <input
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                {...props}
            />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


export default Fees;
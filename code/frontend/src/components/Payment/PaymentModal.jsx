import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Upload, CheckCircle, CreditCard, Landmark, AlertCircle } from 'lucide-react';

const PaymentModal = ({ bookingId, bookingType, totalPrice, onClose, onSuccess }) => {
    const { authFetch } = useAuth();
    const { getCurrencySymbol, convertPrice } = useCurrency();
    
    const [activeTab, setActiveTab] = useState('online');
    const [bankDetails, setBankDetails] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (activeTab === 'bank_transfer' && !bankDetails) {
            fetchBankDetails();
        }
    }, [activeTab]);

    const fetchBankDetails = async () => {
        try {
            const response = await authFetch('https://pearlpath-backend.onrender.com/api/payments/bank-details');
            if (response.ok) {
                const data = await response.json();
                setBankDetails(data);
            }
        } catch (err) {
            console.error("Error fetching bank details", err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            
            if (!validTypes.includes(selectedFile.type)) {
                setError('Invalid file type. Please upload a JPG, PNG, or PDF.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File is too large. Maximum size is 5MB.');
                setFile(null);
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleOnlinePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            // For now, mock online payment success by just proceeding
            // as if it was successfully paid via the gateway.
            // Create verified payment
            const response = await authFetch('https://pearlpath-backend.onrender.com/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    bookingType,
                    paymentMethod: 'online'
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMsg('Payment successful!');
                setTimeout(() => {
                    onSuccess(data);
                }, 1500);
            } else {
                setError(data.message || 'Payment failed');
            }
        } catch (err) {
            setError('An error occurred during payment processing.');
        } finally {
            setLoading(false);
        }
    };

    const handleBankTransfer = async () => {
        if (!file) {
            setError('Please upload a bank slip.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create Payment
            const paymentResponse = await authFetch('https://pearlpath-backend.onrender.com/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    bookingType,
                    paymentMethod: 'bank_transfer'
                })
            });
            const paymentData = await paymentResponse.json();
            
            if (!paymentResponse.ok) {
                throw new Error(paymentData.message || 'Failed to create payment record');
            }

            // 2. Upload Slip
            const formData = new FormData();
            formData.append('bankSlip', file);

            const uploadResponse = await authFetch(`https://pearlpath-backend.onrender.com/api/payments/${paymentData.paymentId}/bank-slip`, {
                method: 'POST',
                body: formData // authFetch handles FormData correctly usually, omitting Content-Type so browser sets it with boundary
            });
            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.message || 'Failed to upload bank slip');
            }

            setSuccessMsg('Bank slip submitted successfully! Waiting for admin verification.');
            setTimeout(() => {
                onSuccess(uploadData.payment);
            }, 2000);

        } catch (err) {
            setError(err.message || 'An error occurred while processing your bank transfer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden font-outfit">
                {/* Header */}
                <div className="bg-gradient-to-r from-sunset-teal to-blue-600 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors" disabled={loading}>
                        <X size={24} />
                    </button>
                </div>

                {/* Amount Summary */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Amount Due</span>
                    <span className="text-2xl font-extrabold text-gray-900">
                        {getCurrencySymbol()} {convertPrice(totalPrice).toLocaleString()}
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'online' ? 'text-sunset-teal border-b-2 border-sunset-teal bg-teal-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('online')}
                        disabled={loading}
                    >
                        <CreditCard size={18} /> Online Payment
                    </button>
                    <button 
                        className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'bank_transfer' ? 'text-sunset-teal border-b-2 border-sunset-teal bg-teal-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('bank_transfer')}
                        disabled={loading}
                    >
                        <Landmark size={18} /> Bank Transfer
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-medium flex items-center gap-2">
                            <CheckCircle size={16} /> {successMsg}
                        </div>
                    )}

                    {activeTab === 'online' && (
                        <div className="space-y-6">
                            <p className="text-gray-600">Pay securely with your credit or debit card through our online payment gateway.</p>
                            <button 
                                onClick={handleOnlinePayment}
                                disabled={loading || successMsg}
                                className="w-full py-4 bg-gradient-to-r from-sunset-teal to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Pay Online Now'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'bank_transfer' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-2 text-sm text-blue-900">
                                <h4 className="font-bold mb-3 text-blue-950 flex items-center gap-2"><Landmark size={16}/> Bank Account Details</h4>
                                {bankDetails ? (
                                    <>
                                        <p><span className="text-blue-700 font-medium">Bank:</span> {bankDetails.bankName}</p>
                                        <p><span className="text-blue-700 font-medium">Account Name:</span> {bankDetails.accountName}</p>
                                        <p><span className="text-blue-700 font-medium">Account No:</span> <span className="font-mono font-bold">{bankDetails.accountNumber}</span></p>
                                        <p><span className="text-blue-700 font-medium">Branch:</span> {bankDetails.branch}</p>
                                    </>
                                ) : (
                                    <p>Loading bank details...</p>
                                )}
                            </div>

                            <p className="text-sm text-gray-600">
                                Please transfer the exact amount to the account above and upload the bank slip.
                            </p>

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                {!file ? (
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-sunset-teal mb-3">
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-gray-800 font-bold mb-1">Upload Bank Slip</p>
                                        <p className="text-gray-500 text-xs">JPG, PNG, PDF up to 5MB</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 truncate">
                                            <CheckCircle className="text-green-500 shrink-0" size={20} />
                                            <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => setFile(null)} 
                                            className="text-gray-400 hover:text-red-500 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleBankTransfer}
                                disabled={loading || successMsg || !file}
                                className="w-full py-4 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Bank Transfer'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

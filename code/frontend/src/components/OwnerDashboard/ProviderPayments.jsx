import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { Calendar, CheckCircle2, XCircle, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const ProviderPayments = () => {
    const { authFetch } = useAuth();
    const { convertPrice, getCurrencySymbol } = useCurrency();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await authFetch('http://localhost:3001/api/payments/provider?status=submitted');
            if (res.ok) {
                setPayments(await res.json());
            }
        } catch (error) {
            console.error('Error fetching provider payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            let body = {};
            if (action === 'reject') {
                const { value: reason } = await Swal.fire({
                    title: 'Reject Payment',
                    input: 'text',
                    inputLabel: 'Reason for rejection',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) return 'You need to write something!';
                    }
                });
                if (!reason) return;
                body.rejectionReason = reason;
            }

            const res = await authFetch(`http://localhost:3001/api/payments/admin/${id}/${action}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                Swal.fire('Success', `Payment ${action}ed successfully`, 'success');
                fetchPayments();
            } else {
                Swal.fire('Error', `Failed to ${action} payment`, 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'Network error', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-orange"></div>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Payments to Verify</h3>
                <p className="text-gray-500">You don't have any submitted bank slips waiting for your verification.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={fetchPayments}
                    className="flex items-center gap-2 text-sm font-semibold text-sunset-orange bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {payments.map((payment) => (
                <div key={payment._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{payment.bookingType}</span>
                            <span className="text-sm font-semibold text-gray-500">Booking ID: {payment.bookingId?.substring(0,8)}...</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {payment.userId?.firstName} {payment.userId?.lastName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> Submitted on: {new Date(payment.uploadedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><AlertCircle size={14} /> Status: <span className="uppercase text-yellow-600 font-bold">{payment.paymentStatus}</span></span>
                        </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-3 w-full lg:w-auto">
                        <div className="text-2xl font-black text-sunset-orange">
                            {getCurrencySymbol()}{convertPrice(payment.amount).toLocaleString()}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-2">
                            {payment.bankSlipUrl && (
                                <a
                                    href={`http://localhost:3001${payment.bankSlipUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex-1 lg:flex-none text-center"
                                >
                                    View Slip
                                </a>
                            )}
                            <button
                                onClick={() => handleAction(payment._id, 'verify')}
                                className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg hover:bg-green-100 border border-green-200 transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none"
                            >
                                <CheckCircle2 size={18} /> Verify
                            </button>
                            <button
                                onClick={() => handleAction(payment._id, 'reject')}
                                className="px-4 py-2 bg-red-50 text-red-700 font-bold rounded-lg hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-none"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProviderPayments;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import { DollarSign, TrendingUp, Calendar, ArrowLeft, BarChart3 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { Link } from 'react-router-dom';

const RevenueDashboard = () => {
    const { authFetch } = useAuth();
    const { convertPrice, getCurrencySymbol } = useCurrency();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await authFetch('http://localhost:3001/api/bookings/provider');
            if (res.ok) {
                const data = await res.json();
                setBookings(data.response);
            }
        } catch (error) {
            console.error("Error fetching provider bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate aggregated data
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
    
    let allTimeRevenue = 0;
    let thisYearRevenue = 0;
    let thisMonthRevenue = 0;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const monthlyDataMap = {}; // { 'Jan 2026': revenue, 'Feb 2026': revenue }

    confirmedBookings.forEach(b => {
        const amount = b.totalPrice || 0;
        allTimeRevenue += amount;
        
        const bDate = new Date(b.startDate);
        if (bDate.getFullYear() === currentYear) {
            thisYearRevenue += amount;
            if (bDate.getMonth() === currentMonth) {
                thisMonthRevenue += amount;
            }
        }

        const monthYearKey = bDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyDataMap[monthYearKey] = (monthlyDataMap[monthYearKey] || 0) + amount;
    });

    // Convert map to array and sort chronologically (rough sort by parsing date)
    const monthlyData = Object.keys(monthlyDataMap).map(key => ({
        label: key,
        revenue: monthlyDataMap[key],
        dateObj: new Date(key)
    })).sort((a, b) => a.dateObj - b.dateObj);

    // Find max revenue for scaling the bar chart
    const maxMonthlyRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.revenue)) : 0;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-outfit flex flex-col">
            <Navbar />

            {/* Top Header */}
            <div className="pt-28 pb-10 bg-sunset-dark text-white shadow-md relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-sunset-dark to-sunset-teal/80"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link to="/provider-bookings" className="text-gray-300 hover:text-white flex items-center gap-1 text-sm font-semibold transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/20 w-max">
                                <ArrowLeft size={16} /> Back to Bookings
                            </Link>
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2">Financial Report</h1>
                        <p className="text-xl text-gray-300 font-light">Track your monthly and yearly earnings.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10 w-full flex-1 mb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-orange"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                                <div className="p-4 bg-teal-50 text-sunset-teal rounded-2xl">
                                    <DollarSign size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wide">All-Time Revenue</p>
                                    <h3 className="text-3xl font-black text-gray-900 mt-1">{getCurrencySymbol()}{convertPrice(allTimeRevenue).toLocaleString()}</h3>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                                <div className="p-4 bg-orange-50 text-sunset-orange rounded-2xl">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wide">Revenue This Year</p>
                                    <h3 className="text-3xl font-black text-gray-900 mt-1">{getCurrencySymbol()}{convertPrice(thisYearRevenue).toLocaleString()}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                                <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                                    <Calendar size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wide">Revenue This Month</p>
                                    <h3 className="text-3xl font-black text-gray-900 mt-1">{getCurrencySymbol()}{convertPrice(thisMonthRevenue).toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Chart & Data Table Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart Area */}
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 pb-14">
                                <div className="flex items-center gap-3 mb-8">
                                    <BarChart3 className="text-sunset-teal" size={24} />
                                    <h3 className="text-xl font-bold text-gray-900">Monthly Revenue Trend</h3>
                                </div>
                                
                                {monthlyData.length > 0 ? (
                                    <div className="relative h-80 flex items-end gap-2 md:gap-4 border-l-2 border-b-2 border-gray-100 pb-2 pl-2">
                                        {monthlyData.map((data, idx) => {
                                            const heightPercentage = maxMonthlyRevenue > 0 ? (data.revenue / maxMonthlyRevenue) * 100 : 0;
                                            return (
                                                <div key={idx} className="relative flex-1 flex flex-col justify-end h-full group cursor-default">
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        {getCurrencySymbol()}{convertPrice(data.revenue).toLocaleString()}
                                                    </div>
                                                    
                                                    {/* Bar */}
                                                    <div 
                                                        className="w-full bg-gradient-to-t from-sunset-orange to-sunset-gold rounded-t-sm transition-all duration-700 ease-out group-hover:brightness-110" 
                                                        style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                                                    ></div>
                                                    
                                                    {/* X-axis label */}
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 whitespace-nowrap mt-2">
                                                        {data.label}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                        <TrendingUp size={48} className="mb-4 opacity-50" />
                                        <p className="font-semibold">No revenue data available yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Data Table */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Breakdown</h3>
                                {monthlyData.length > 0 ? (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {[...monthlyData].reverse().map((data, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sunset-teal/30 hover:bg-teal-50/30 transition-colors">
                                                <div className="font-bold text-gray-700">{data.label}</div>
                                                <div className="font-black text-sunset-teal text-lg">
                                                    {getCurrencySymbol()}{convertPrice(data.revenue).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No data to display.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RevenueDashboard;

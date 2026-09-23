import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthContext';
import './ProviderCalendar.css';

const ProviderCalendar = ({ serviceType, serviceId, title }) => {
    const { authFetch } = useAuth();
    const [disabledDates, setDisabledDates] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://pearlpath-backend.onrender.com/api/${serviceType}/${serviceId}/availability`);
            if (res.ok) {
                const data = await res.json();
                setDisabledDates(data.disabledDates || []);
                setUnavailableDates(data.unavailableDates || []);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (serviceId) {
            fetchAvailability();
        }
    }, [serviceId]);

    const handleDateClick = async (value) => {
        const dateStr = new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        // If it's a booked date (in disabled but not in unavailable), we shouldn't let them unblock it here
        if (disabledDates.includes(dateStr) && !unavailableDates.includes(dateStr)) {
            alert("This date is already booked and cannot be changed here.");
            return;
        }

        const action = unavailableDates.includes(dateStr) ? 'remove' : 'add';
        
        try {
            const res = await authFetch(`https://pearlpath-backend.onrender.com/api/${serviceType}/${serviceId}/manage-availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr, action })
            });

            if (res.ok) {
                fetchAvailability();
            }
        } catch (error) {
            console.error('Error managing availability:', error);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            
            if (disabledDates.includes(dateStr) && !unavailableDates.includes(dateStr)) {
                return 'booked-date'; // Orange
            } else if (unavailableDates.includes(dateStr)) {
                return 'blocked-date'; // Red
            }
        }
        return null;
    };

    if (loading) return <div>Loading Calendar...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center provider-calendar-wrapper">
            <h3 className="font-bold text-lg text-sunset-dark mb-4">{title} Availability</h3>
            <Calendar 
                onClickDay={handleDateClick}
                tileClassName={tileClassName}
                minDate={new Date()}
                className="custom-calendar border-0 shadow-sm rounded-lg p-2 font-outfit"
            />
            <div className="flex gap-4 mt-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#ff6b6b]"></div>
                    <span>Blocked (Click to Unblock)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#ffa94d]"></div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
};

export default ProviderCalendar;

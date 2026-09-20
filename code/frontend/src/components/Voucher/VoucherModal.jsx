import React from 'react';
import { Printer, Download, X, CheckCircle, ShieldCheck, PhoneCall } from 'lucide-react';
import { triggerPDFPrint, getQRCodeUrl } from '../../utils/pdfVoucherService';

const VoucherModal = ({ isOpen, onClose, voucherData }) => {
  if (!isOpen || !voucherData) return null;

  const { title, type, location, bookingId, dateRange, price, htmlContent, user } = voucherData;
  const displayBookingId = bookingId ? `#${bookingId.slice(-8).toUpperCase()}` : `#PB-${Math.floor(100000 + Math.random() * 900000)}`;
  const qrUrl = getQRCodeUrl(`PearlPath Booking | ID: ${displayBookingId} | Title: ${title}`);

  const handlePrintDownload = () => {
    triggerPDFPrint(htmlContent, `PearlPath_Voucher_${displayBookingId}`);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-[#18181b] border border-white/15 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto animate-slide-up text-left z-10 text-white">
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-sunset-orange/20 to-sunset-gold/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sunset-orange/20 border border-sunset-orange/30 rounded-2xl text-sunset-orange">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-sunset-orange block">
                Official Voucher Preview
              </span>
              <h3 className="text-lg font-bold text-white">Offline PDF Travel Voucher</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-black/40 hover:bg-black/80 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Voucher Preview Card */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="bg-[#111115] border-2 border-sunset-orange/40 rounded-2xl p-6 shadow-inner relative">
            
            {/* Stamp & Status */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-2xl font-black text-sunset-orange tracking-tight">PearlPath</span>
                <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Sri Lanka Travel Support</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle size={14} /> Verified Booking
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Booking Ref</span>
                <span className="text-sm font-extrabold text-white">{displayBookingId}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Service Type</span>
                <span className="text-sm font-extrabold text-sunset-gold">{type || 'Travel Support'}</span>
              </div>
            </div>

            {/* Reserved Title & Location */}
            <div className="mb-4">
              <span className="text-[10px] text-sunset-orange font-extrabold uppercase tracking-wider block mb-1">Reserved Service</span>
              <h4 className="text-xl font-extrabold text-white leading-snug">{title}</h4>
              <p className="text-xs text-gray-400 mt-1">📍 {location || 'Sri Lanka'}</p>
            </div>

            {dateRange && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Reservation Dates</span>
                <span className="text-sm font-bold text-white">{dateRange}</span>
              </div>
            )}

            {price && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">Total Price:</span>
                <span className="text-lg font-extrabold text-sunset-orange">{price}</span>
              </div>
            )}

            {/* Offline QR Code Section */}
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex items-center justify-between mt-4">
              <div>
                <span className="text-xs font-extrabold text-white block">Offline QR Code</span>
                <span className="text-[11px] text-gray-400 block mt-0.5 max-w-[260px]">
                  Show this QR code upon arrival. Works without cellular data or internet connection.
                </span>
              </div>
              <div className="bg-white p-1.5 rounded-lg shrink-0">
                <img src={qrUrl} alt="Voucher QR Code" className="w-16 h-16" />
              </div>
            </div>

            {/* Helplines */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1"><PhoneCall size={12} className="text-sunset-orange" /> Tourist Police: <strong>1912</strong></span>
              <span className="flex items-center gap-1"><PhoneCall size={12} className="text-emerald-400" /> Ambulance: <strong>1990</strong></span>
            </div>
          </div>
        </div>

        {/* Action Footer Buttons */}
        <div className="p-6 bg-[#111115] border-t border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold rounded-xl text-xs transition-all border border-white/10"
          >
            Close
          </button>

          <button
            onClick={handlePrintDownload}
            className="px-6 py-3 bg-gradient-to-r from-sunset-orange to-sunset-gold text-white font-extrabold rounded-xl text-xs hover:shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Download size={16} />
            Download / Save PDF Voucher
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoucherModal;

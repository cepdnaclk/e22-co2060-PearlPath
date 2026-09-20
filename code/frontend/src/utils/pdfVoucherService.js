/**
 * PearlPath PDF & Offline Voucher Generator Service
 */

/**
 * Generates dynamic QR Code URL using free QR Server API.
 */
export const getQRCodeUrl = (dataString) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataString)}&color=000000&bgcolor=ffffff`;
};

/**
 * Opens a print-friendly window formatted for saving as PDF or printing.
 */
export const triggerPDFPrint = (htmlContent, documentTitle = 'PearlPath_Voucher') => {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert("Please allow pop-ups to download or print your PDF voucher.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${documentTitle}</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Outfit', sans-serif;
            background: #ffffff;
            color: #1a1a1f;
            padding: 40px;
            line-height: 1.5;
          }
          .voucher-card {
            border: 2px solid #FF8C00;
            border-radius: 16px;
            padding: 32px;
            max-width: 750px;
            margin: 0 auto;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #eee;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 28px;
            font-weight: 800;
            color: #FF8C00;
            letter-spacing: -0.5px;
          }
          .brand-sub {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            background: #fff3e6;
            color: #FF8C00;
            font-weight: 700;
            font-size: 12px;
            padding: 6px 14px;
            border-radius: 20px;
            border: 1px solid #ffe0b2;
            text-transform: uppercase;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .info-box {
            background: #f9f9fb;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #f0f0f5;
          }
          .info-label {
            font-size: 11px;
            color: #777;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .info-value {
            font-size: 16px;
            font-weight: 700;
            color: #111;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            border-left: 4px solid #FF8C00;
            padding-left: 8px;
          }
          .qr-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fafafa;
            border: 1px solid #eee;
            padding: 16px 24px;
            border-radius: 12px;
            margin-top: 24px;
          }
          .qr-code img {
            width: 100px;
            height: 100px;
            border-radius: 8px;
          }
          .footer-helpline {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #eee;
            font-size: 11px;
            color: #666;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            .voucher-card { border-color: #111; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Builds HTML for Booking Confirmation Vouchers (Hotels, Vehicles, Tour Guides).
 */
export const buildBookingVoucherHTML = (booking, title, location, user) => {
  const bookingId = booking._id || `PB-${Math.floor(100000 + Math.random() * 900000)}`;
  const qrData = `PearlPath Booking | ID: ${bookingId} | Title: ${title} | Status: ${booking.status || 'Confirmed'}`;
  const qrUrl = getQRCodeUrl(qrData);

  const isHotel = !!booking.hotelId;
  const isVehicle = !!booking.vehicleId;
  const isTour = !!booking.tourId;

  const categoryLabel = isHotel ? 'Hotel Accommodation' : isVehicle ? 'Vehicle Rental' : 'Tour Guide Service';

  return `
    <div class="voucher-card">
      <div class="header">
        <div>
          <div class="brand-title">PearlPath</div>
          <div class="brand-sub">Official Travel Support Voucher • Sri Lanka</div>
        </div>
        <div class="badge">${booking.status || 'CONFIRMED'}</div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Booking Reference</div>
          <div class="info-value">#${bookingId.slice(-8).toUpperCase()}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Service Type</div>
          <div class="info-value">${categoryLabel}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <div class="section-title">Reserved Service Details</div>
        <h2 style="font-size: 22px; font-weight: 800; color: #111; margin-bottom: 6px;">${title}</h2>
        <div style="font-size: 14px; color: #555; margin-bottom: 12px;">📍 ${location || 'Sri Lanka'}</div>
      </div>

      <div class="info-grid">
        ${isHotel ? `
          <div class="info-box">
            <div class="info-label">Check-In Date</div>
            <div class="info-value">${booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Check-Out Date</div>
            <div class="info-value">${booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</div>
          </div>
        ` : ''}

        ${isVehicle ? `
          <div class="info-box">
            <div class="info-label">Rental Start Date</div>
            <div class="info-value">${booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Rental End Date</div>
            <div class="info-value">${booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}</div>
          </div>
        ` : ''}

        ${isTour ? `
          <div class="info-box">
            <div class="info-label">Tour Date</div>
            <div class="info-value">${booking.tourDate ? new Date(booking.tourDate).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Guests Count</div>
            <div class="info-value">${booking.guestsCount || 1} Person(s)</div>
          </div>
        ` : ''}

        <div class="info-box">
          <div class="info-label">Primary Tourist Name</div>
          <div class="info-value">${user?.fullName || user?.email || 'Valued Tourist'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Total Price</div>
          <div class="info-value" style="color: #FF8C00;">LKR ${(booking.totalPrice || 0).toLocaleString()}</div>
        </div>
      </div>

      <div class="qr-section">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: #222; margin-bottom: 4px;">Offline Verification QR Code</div>
          <div style="font-size: 12px; color: #666; max-width: 380px;">Present this voucher (digital or print) to your service provider upon arrival. No internet connection required once saved.</div>
        </div>
        <div class="qr-code">
          <img src="${qrUrl}" alt="QR Code" />
        </div>
      </div>

      <div class="footer-helpline">
        <span>🚨 Tourist Police Hotline: <strong>1912</strong></span>
        <span>🚑 Emergency Ambulance: <strong>1990</strong></span>
        <span>PearlPath Verification Platform</span>
      </div>
    </div>
  `;
};

/**
 * Builds HTML for Destination & Route Travel Guide Summaries.
 */
export const buildTripItineraryHTML = (destinationName, location, description, category) => {
  const qrData = `PearlPath Destination Guide | ${destinationName} | Location: ${location}`;
  const qrUrl = getQRCodeUrl(qrData);

  return `
    <div class="voucher-card">
      <div class="header">
        <div>
          <div class="brand-title">PearlPath</div>
          <div class="brand-sub">Offline Destination & Travel Itinerary Guide</div>
        </div>
        <div class="badge">OFFLINE READY</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div class="section-title">Destination Profile</div>
        <h1 style="font-size: 26px; font-weight: 800; color: #111; margin-bottom: 6px;">${destinationName}</h1>
        <div style="font-size: 15px; color: #444; font-weight: 600;">📍 Location: ${location} | Category: ${category || 'Sightseeing'}</div>
      </div>

      <div class="info-box" style="margin-bottom: 24px;">
        <div class="info-label">About this Destination</div>
        <div style="font-size: 13px; color: #333; line-height: 1.6; margin-top: 6px;">
          ${description || 'Discover historic structures, wildlife, and tropical scenery around Sri Lanka.'}
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Sri Lanka Monsoon Safety</div>
          <div class="info-value" style="font-size: 13px; color: #2e7d32;">Best Visiting Window Checked</div>
        </div>
        <div class="info-box">
          <div class="info-label">Emergency Contacts</div>
          <div class="info-value" style="font-size: 13px;">Police: 1912 | Ambulance: 1990</div>
        </div>
      </div>

      <div class="qr-section">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: #222; margin-bottom: 4px;">Offline Location Verification</div>
          <div style="font-size: 12px; color: #666; max-width: 380px;">Save this PDF to your phone or print before traveling to areas with low signal.</div>
        </div>
        <div class="qr-code">
          <img src="${qrUrl}" alt="QR Code" />
        </div>
      </div>

      <div class="footer-helpline">
        <span>Official Sri Lankan Travel Support Platform • PearlPath</span>
      </div>
    </div>
  `;
};

/**
 * Builds HTML for Detailed Route Travel Guides (Start, Destination, Waypoints, Distance, Duration).
 */
export const buildRouteGuideHTML = (route, startPoint, searchQuery = '', liveRouteInfo = {}) => {
  const routeTitle = route.destination && startPoint?.name 
    ? `${startPoint.name} to ${route.destination.replace(/ Start$/i, '')}`
    : route.name || 'Travel Route';

  const destinationName = route.destination || searchQuery || 'Destination';
  const distance = liveRouteInfo.distance || route.distance || 'Calculated on Route';
  const duration = liveRouteInfo.duration || route.duration || 'Calculated on Route';

  const waypoints = route.waypoints || [];
  const qrData = `PearlPath Route Guide | ${routeTitle} | Distance: ${distance} | Duration: ${duration}`;
  const qrUrl = getQRCodeUrl(qrData);

  const waypointsHTML = waypoints.map((wp, idx) => `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; padding: 12px; background: #f9f9fb; border-radius: 8px; border-left: 4px solid #FF8C00;">
      <div style="font-weight: 800; font-size: 12px; color: #FF8C00; min-width: 65px; text-transform: uppercase;">STOP ${idx + 1}</div>
      <div>
        <div style="font-weight: 700; font-size: 14px; color: #111;">${wp.name}</div>
        ${wp.description ? `<div style="font-size: 12px; color: #666; margin-top: 2px;">${wp.description}</div>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <div class="voucher-card">
      <div class="header">
        <div>
          <div class="brand-title">PearlPath</div>
          <div class="brand-sub">Offline Travel Route & Navigation Guide</div>
        </div>
        <div class="badge">OFFLINE ROUTE GUIDE</div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="section-title">Route Overview</div>
        <h1 style="font-size: 24px; font-weight: 800; color: #111; margin-bottom: 4px;">${routeTitle}</h1>
        <div style="font-size: 13px; color: #555;">Direct road navigation itinerary for Sri Lanka travel.</div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Starting Point</div>
          <div class="info-value">📍 ${startPoint?.name || 'Colombo'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Target Destination</div>
          <div class="info-value">🎯 ${destinationName}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Estimated Distance</div>
          <div class="info-value" style="color: #FF8C00;">${distance}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Estimated Travel Time</div>
          <div class="info-value" style="color: #FF8C00;">${duration}</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="section-title">Route Waypoints & Intermediate Stops (${waypoints.length})</div>
        ${waypoints.length > 0 ? waypointsHTML : `
          <div style="font-size: 13px; color: #666; font-style: italic; padding: 12px; background: #f9f9fb; border-radius: 8px;">Direct express route from ${startPoint?.name || 'Start'} to ${destinationName}.</div>
        `}
      </div>

      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Monsoon & Weather Safety Note</div>
          <div class="info-value" style="font-size: 12px; color: #2e7d32;">Check live weather & road visibility before driving.</div>
        </div>
        <div class="info-box">
          <div class="info-label">Emergency Roadside Assistance</div>
          <div class="info-value" style="font-size: 12px;">Tourist Police: <strong>1912</strong> | Ambulance: <strong>1990</strong></div>
        </div>
      </div>

      <div class="qr-section">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: #222; margin-bottom: 4px;">Offline Route QR Verification</div>
          <div style="font-size: 12px; color: #666; max-width: 380px;">Scan or present this route guide offline when traveling through areas with limited network signal.</div>
        </div>
        <div class="qr-code">
          <img src="${qrUrl}" alt="QR Code" />
        </div>
      </div>

      <div class="footer-helpline">
        <span>🚨 Tourist Police Hotline: <strong>1912</strong></span>
        <span>🚑 Emergency Ambulance: <strong>1990</strong></span>
        <span>PearlPath Sri Lanka Navigation</span>
      </div>
    </div>
  `;
};

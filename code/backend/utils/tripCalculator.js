/**
 * Trip Budget and Cost Calculator Utility for PearlPath
 * 
 * CO2040 Concept: Unit Testable Utility
 * Pure function that calculates estimated total trip cost based on daily rates,
 * duration, guests, and promotional discount codes.
 */

/**
 * Calculates the total estimated cost for a PearlPath trip.
 * 
 * @param {number} dailyRate - Base rate per day per guest (must be > 0)
 * @param {number} days - Number of days for the trip (must be >= 1)
 * @param {number} guests - Number of guests (must be >= 1)
 * @param {string} [discountCode] - Optional discount code ('PEARL10' for 10% off, 'SUMMER20' for 20% off)
 * @returns {object} Calculated breakdown including baseCost, discount, tax, and finalTotal
 */
function calculateTripBudget(dailyRate, days, guests, discountCode = '') {
  if (typeof dailyRate !== 'number' || dailyRate <= 0) {
    throw new Error('Invalid daily rate: Must be a positive number');
  }
  if (typeof days !== 'number' || days < 1) {
    throw new Error('Invalid days: Must be at least 1 day');
  }
  if (typeof guests !== 'number' || guests < 1) {
    throw new Error('Invalid guests count: Must be at least 1 guest');
  }

  const baseCost = dailyRate * days * guests;
  
  let discountPercent = 0;
  const normalizedCode = discountCode ? discountCode.trim().toUpperCase() : '';
  
  if (normalizedCode === 'PEARL10') {
    discountPercent = 0.10;
  } else if (normalizedCode === 'SUMMER20') {
    discountPercent = 0.20;
  }

  const discountAmount = baseCost * discountPercent;
  const subtotal = baseCost - discountAmount;
  
  // 5% platform service tax
  const taxAmount = subtotal * 0.05;
  const finalTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    baseCost,
    discountPercent: discountPercent * 100,
    discountAmount,
    taxAmount,
    finalTotal
  };
}

/**
 * Formats itinerary duration into human-readable format.
 * 
 * @param {string} startDateStr - ISO format or YYYY-MM-DD
 * @param {string} endDateStr - ISO format or YYYY-MM-DD
 * @returns {number} Number of days
 */
function calculateTripDuration(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }

  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) {
    throw new Error('End date cannot be before start date');
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

module.exports = {
  calculateTripBudget,
  calculateTripDuration
};

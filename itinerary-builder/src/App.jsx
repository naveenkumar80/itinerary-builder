import React, { useState } from 'react';
import { Download, Plus, Trash2, Calendar, MapPin, Plane, Hotel, DollarSign, Check, X } from 'lucide-react';

export default function ItineraryBuilder() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [tourOverview, setTourOverview] = useState({
    title: 'Amazing Thailand Adventure',
    userName: '',
    duration: '7 Days / 6 Nights',
    travelers: 2,
    departure: 'Mumbai',
    arrival: 'Bangkok',
    startDate: '2025-11-01',
    endDate: '2025-11-07'
  });

  const [days, setDays] = useState([
    {
      id: 1,
      dayNumber: 1,
      title: 'Arrival in Bangkok',
      morning: 'Arrive at Bangkok Airport\nMeet and greet by tour representative',
      afternoon: 'Transfer to hotel\nCheck-in and freshen up',
      evening: 'Welcome dinner at local restaurant\nOvernight stay in Bangkok',
      transport: 'Airport pickup included'
    }
  ]);

  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: 'Grand Hyatt Bangkok',
      city: 'Bangkok',
      checkIn: '2025-11-01',
      checkOut: '2025-11-04',
      nights: 3
    }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, installment: 1, amount: 15000, dueDate: '2025-10-01' }
  ]);

  const [inclusions, setInclusions] = useState([
    'Accommodation as per itinerary',
    'Daily breakfast',
    'Airport transfers',
    'Sightseeing as mentioned'
  ]);

  const [exclusions, setExclusions] = useState([
    'International airfare',
    'Personal expenses',
    'Travel insurance',
    'Meals not mentioned'
  ]);

  const addDay = () => {
    const newDay = {
      id: Date.now(),
      dayNumber: days.length + 1,
      title: '',
      morning: '',
      afternoon: '',
      evening: '',
      transport: ''
    };
    setDays([...days, newDay]);
  };

  const removeDay = (id) => {
    setDays(days.filter(d => d.id !== id));
  };

  const updateDay = (id, field, value) => {
    setDays(days.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addHotel = () => {
    setHotels([...hotels, { id: Date.now(), name: '', city: '', checkIn: '', checkOut: '', nights: 1 }]);
  };

  const removeHotel = (id) => {
    setHotels(hotels.filter(h => h.id !== id));
  };

  const updateHotel = (id, field, value) => {
    setHotels(hotels.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const addPayment = () => {
    setPayments([...payments, { id: Date.now(), installment: payments.length + 1, amount: 0, dueDate: '' }]);
  };

  const removePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const updatePayment = (id, field, value) => {
    setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const removeInclusion = (index) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const updateInclusion = (index, value) => {
    setInclusions(inclusions.map((inc, i) => i === index ? value : inc));
  };

  const addExclusion = () => {
    setExclusions([...exclusions, '']);
  };

  const removeExclusion = (index) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  const updateExclusion = (index, value) => {
    setExclusions(exclusions.map((exc, i) => i === index ? value : exc));
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const daysHtml = days.map(day => {
      const scheduleItems = [];
      if (day.morning) scheduleItems.push({ time: 'Morning', activity: day.morning });
      if (day.afternoon) scheduleItems.push({ time: 'Afternoon', activity: day.afternoon });
      if (day.evening) scheduleItems.push({ time: 'Evening', activity: day.evening });
      
      return `
        <div class="itinerary-card">
          <div class="card-header">
            <span class="day-badge">Day ${day.dayNumber}</span>
            <h2 class="day-title">${day.title}</h2>
          </div>
          <div class="card-content">
            ${scheduleItems.map(item => `
              <div class="schedule-item">
                <div class="time-indicator"></div>
                <div class="schedule-content">
                  <p class="time-label">${item.time}</p>
                  <p class="activity-text">${item.activity}</p>
                </div>
              </div>
            `).join('')}
            ${day.transport ? `
              <div class="transport-info">
                <strong>🚗 Transport:</strong> ${day.transport}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    const hotelsHtml = hotels.map(hotel => {
      return `<div class="hotel-card"><div class="hotel-info"><h3>🏨 ${hotel.name}</h3><div class="hotel-details"><div>📍 ${hotel.city}</div><div>📅 Check-in: ${new Date(hotel.checkIn).toLocaleDateString()} | Check-out: ${new Date(hotel.checkOut).toLocaleDateString()}</div><div>🌙 ${hotel.nights} Night(s)</div></div></div></div>`;
    }).join('');

    const paymentsHtml = payments.map(payment => {
      return `<tr><td>Installment ${payment.installment}</td><td>₹${payment.amount.toLocaleString()}</td><td>${new Date(payment.dueDate).toLocaleDateString()}</td></tr>`;
    }).join('');

    const inclusionsHtml = inclusions.filter(inc => inc).map(inc => `<div class="list-item">${inc}</div>`).join('');
    const exclusionsHtml = exclusions.filter(exc => exc).map(exc => `<div class="list-item exclusion-item">${exc}</div>`).join('');
    
    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${tourOverview.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 210mm; margin: 0 auto; padding: 20px; background: white; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; border-radius: 10px; margin-bottom: 30px; }
    .header h1 { font-size: 36px; margin-bottom: 10px; }
    .header-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px; font-size: 14px; }
    .header-detail { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px; }
    .header-detail strong { display: block; font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title { font-size: 24px; color: #667eea; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #667eea; }
    
    .itinerary-card { 
      background: white; 
      border: 1px solid #e5e7eb; 
      border-radius: 16px; 
      padding: 24px; 
      margin-bottom: 24px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      page-break-inside: avoid;
    }
    .card-header { margin-bottom: 20px; }
    .day-badge { 
      display: inline-block;
      background: #667eea; 
      color: white; 
      padding: 6px 16px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .day-title { 
      font-size: 22px; 
      font-weight: bold; 
      color: #1f2937; 
      margin-top: 8px;
    }
    .card-content { margin-top: 16px; }
    .schedule-item { 
      display: flex; 
      align-items: start; 
      gap: 12px; 
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #667eea;
    }
    .time-indicator {
      width: 12px;
      height: 12px;
      background: #667eea;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
    }
    .schedule-content { flex: 1; }
    .time-label { 
      font-weight: 600; 
      color: #4b5563; 
      margin-bottom: 4px;
      font-size: 15px;
    }
    .activity-text { 
      color: #6b7280; 
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-line;
    }
    
    .day-card { background: #f8f9fa; border-left: 5px solid #667eea; padding: 20px; margin-bottom: 20px; border-radius: 8px; page-break-inside: avoid; }
    .day-header { font-size: 20px; color: #667eea; margin-bottom: 15px; font-weight: bold; }
    .time-block { margin-bottom: 15px; }
    .time-label { font-weight: bold; color: #764ba2; margin-bottom: 5px; display: inline-block; background: #e9ecef; padding: 4px 12px; border-radius: 4px; font-size: 14px; }
    .time-content { margin-left: 0; margin-top: 8px; white-space: pre-line; }
    .transport-info { background: #fff3cd; padding: 12px; border-radius: 6px; margin-top: 10px; border-left: 4px solid #ffc107; }
    .hotel-card { background: white; border: 2px solid #e9ecef; padding: 20px; margin-bottom: 15px; border-radius: 8px; }
    .hotel-info h3 { color: #667eea; margin-bottom: 8px; }
    .hotel-details { font-size: 14px; color: #666; }
    .payment-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .payment-table th { background: #667eea; color: white; padding: 12px; text-align: left; }
    .payment-table td { padding: 12px; border-bottom: 1px solid #e9ecef; }
    .payment-table tr:nth-child(even) { background: #f8f9fa; }
    .list-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .list-box { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .list-box h3 { color: #667eea; margin-bottom: 15px; font-size: 20px; }
    .list-item { padding: 8px 0; padding-left: 25px; position: relative; }
    .list-item:before { content: '✓'; position: absolute; left: 0; color: #28a745; font-weight: bold; }
    .exclusion-item:before { content: '✗'; color: #dc3545; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef; color: #666; font-size: 14px; }
    .terms-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; font-size: 13px; page-break-inside: avoid; }
    .terms-section h3 { color: #667eea; margin-bottom: 10px; }
    .terms-section ul { margin-left: 20px; }
    .terms-section li { margin-bottom: 5px; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .container { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${tourOverview.title}</h1>
      ${tourOverview.userName ? `<p style="font-size: 18px; margin-top: 8px; opacity: 0.95;">Prepared for: <strong>${tourOverview.userName}</strong></p>` : ''}
      <div class="header-details">
        <div class="header-detail">
          <strong>DURATION</strong>
          ${tourOverview.duration}
        </div>
        <div class="header-detail">
          <strong>TRAVELERS</strong>
          ${tourOverview.travelers} Person(s)
        </div>
        <div class="header-detail">
          <strong>DATES</strong>
          ${new Date(tourOverview.startDate).toLocaleDateString()} - ${new Date(tourOverview.endDate).toLocaleDateString()}
        </div>
      </div>
      <div class="header-details" style="margin-top: 15px;">
        <div class="header-detail">
          <strong>DEPARTURE</strong>
          ${tourOverview.departure}
        </div>
        <div class="header-detail">
          <strong>ARRIVAL</strong>
          ${tourOverview.arrival}
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Daily Itinerary</h2>
      ${daysHtml}
    </div>

    <div class="section">
      <h2 class="section-title">Accommodation Details</h2>
      ${hotelsHtml}
    </div>

    <div class="section">
      <h2 class="section-title">Payment Plan</h2>
      <table class="payment-table">
        <thead>
          <tr>
            <th>Installment</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${paymentsHtml}
          <tr style="font-weight: bold; background: #667eea; color: white;">
            <td>Total</td>
            <td>₹${totalAmount.toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">Inclusions & Exclusions</h2>
      <div class="list-section">
        <div class="list-box">
          <h3>✓ Inclusions</h3>
          ${inclusionsHtml}
        </div>
        <div class="list-box">
          <h3>✗ Exclusions</h3>
          ${exclusionsHtml}
        </div>
      </div>
    </div>

    <div class="terms-section">
      <h3>Terms & Conditions</h3>
      <ul>
        <li>All bookings are subject to availability at the time of confirmation.</li>
        <li>Payment schedule must be adhered to as per the payment plan mentioned above.</li>
        <li>Cancellation charges will apply as per our cancellation policy.</li>
        <li>Travel insurance is highly recommended and not included unless specified.</li>
        <li>Prices are subject to change without prior notice due to currency fluctuations or government tax revisions.</li>
        <li>The company reserves the right to modify the itinerary due to unforeseen circumstances.</li>
      </ul>
    </div>

    <div class="footer">
      <p><strong>Thank you for choosing us!</strong></p>
      <p style="margin-top: 16px; color: #6b7280;">Vigovia Tech Pvt. Ltd</p>
      <p style="color: #6b7280;">HD 093, Chambar Hills, Karnataka, India</p>
      <p style="color: #6b7280;">Email: contact@vigovia.com | Phone: +91 9504640112</p>
      <p style="margin-top: 10px; font-size: 12px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>`;
    
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-purple-600">Itinerary Builder</h1>
              <p className="text-gray-600 mt-2">Create beautiful tour itineraries in minutes</p>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Download size={20} />
              Generate PDF
            </button>
          </div>

          <div className="flex gap-2 mb-8 border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Tour Overview', icon: MapPin },
              { id: 'itinerary', label: 'Daily Itinerary', icon: Calendar },
              { id: 'hotels', label: 'Hotels', icon: Hotel },
              { id: 'payment', label: 'Payment', icon: DollarSign },
              { id: 'details', label: 'Inc/Exc', icon: Check }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-4 border-purple-600 -mb-0.5'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                  <MapPin />
                  Tour Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={tourOverview.userName}
                      onChange={(e) => setTourOverview({...tourOverview, userName: e.target.value})}
                      placeholder="e.g., John Doe"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Title</label>
                    <input
                      type="text"
                      value={tourOverview.title}
                      onChange={(e) => setTourOverview({...tourOverview, title: e.target.value})}
                      placeholder="e.g., Amazing Thailand Adventure"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={tourOverview.duration}
                      onChange={(e) => setTourOverview({...tourOverview, duration: e.target.value})}
                      placeholder="e.g., 7 Days / 6 Nights"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      value={tourOverview.travelers}
                      onChange={(e) => setTourOverview({...tourOverview, travelers: e.target.value})}
                      placeholder="2"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Departure City</label>
                    <input
                      type="text"
                      value={tourOverview.departure}
                      onChange={(e) => setTourOverview({...tourOverview, departure: e.target.value})}
                      placeholder="e.g., Mumbai"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival City</label>
                    <input
                      type="text"
                      value={tourOverview.arrival}
                      onChange={(e) => setTourOverview({...tourOverview, arrival: e.target.value})}
                      placeholder="e.g., Bangkok"
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={tourOverview.startDate}
                      onChange={(e) => setTourOverview({...tourOverview, startDate: e.target.value})}
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={tourOverview.endDate}
                      onChange={(e) => setTourOverview({...tourOverview, endDate: e.target.value})}
                      className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                  <Calendar />
                  Daily Itinerary
                </h2>
                <button
                  onClick={addDay}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  <Plus size={18} />
                  Add Day
                </button>
              </div>
              <div className="space-y-6">
                {days.map((day, index) => (
                  <div key={day.id} className="p-6 bg-gray-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-purple-600">Day {index + 1}</h3>
                      {days.length > 1 && (
                        <button
                          onClick={() => removeDay(day.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Day Title</label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(day.id, 'title', e.target.value)}
                          placeholder="e.g., Arrival in Bangkok"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🌅 Morning Activities</label>
                        <textarea
                          value={day.morning}
                          onChange={(e) => updateDay(day.id, 'morning', e.target.value)}
                          placeholder="Describe morning activities..."
                          rows="3"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">☀️ Afternoon Activities</label>
                        <textarea
                          value={day.afternoon}
                          onChange={(e) => updateDay(day.id, 'afternoon', e.target.value)}
                          placeholder="Describe afternoon activities..."
                          rows="3"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🌙 Evening Activities</label>
                        <textarea
                          value={day.evening}
                          onChange={(e) => updateDay(day.id, 'evening', e.target.value)}
                          placeholder="Describe evening activities..."
                          rows="3"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🚗 Transport Details (Optional)</label>
                        <input
                          type="text"
                          value={day.transport}
                          onChange={(e) => updateDay(day.id, 'transport', e.target.value)}
                          placeholder="e.g., Airport pickup included, Private transfer"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                  <Hotel />
                  Accommodation Details
                </h2>
                <button
                  onClick={addHotel}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  <Plus size={18} />
                  Add Hotel
                </button>
              </div>
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="p-6 bg-gray-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <Hotel className="text-purple-600" size={28} />
                      <button
                        onClick={() => removeHotel(hotel.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel Name</label>
                        <input
                          type="text"
                          value={hotel.name}
                          onChange={(e) => updateHotel(hotel.id, 'name', e.target.value)}
                          placeholder="e.g., Grand Hyatt Bangkok"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={hotel.city}
                          onChange={(e) => updateHotel(hotel.id, 'city', e.target.value)}
                          placeholder="e.g., Bangkok"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                        <input
                          type="date"
                          value={hotel.checkIn}
                          onChange={(e) => updateHotel(hotel.id, 'checkIn', e.target.value)}
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                        <input
                          type="date"
                          value={hotel.checkOut}
                          onChange={(e) => updateHotel(hotel.id, 'checkOut', e.target.value)}
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Nights</label>
                        <input
                          type="number"
                          value={hotel.nights}
                          onChange={(e) => updateHotel(hotel.id, 'nights', e.target.value)}
                          placeholder="3"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                  <DollarSign />
                  Payment Plan
                </h2>
                <button
                  onClick={addPayment}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  <Plus size={18} />
                  Add Installment
                </button>
              </div>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-6 bg-gray-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <DollarSign className="text-purple-600" size={28} />
                      <button
                        onClick={() => removePayment(payment.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Installment Number</label>
                        <input
                          type="number"
                          value={payment.installment}
                          onChange={(e) => updatePayment(payment.id, 'installment', e.target.value)}
                          placeholder="1"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
                          placeholder="15000"
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={payment.dueDate}
                          onChange={(e) => updatePayment(payment.id, 'dueDate', e.target.value)}
                          className="w-full p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                  <p className="text-2xl font-bold text-purple-700">
                    Total Amount: ₹{payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                <Check />
                Inclusions & Exclusions
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-700">✓ Inclusions</h3>
                    <button
                      onClick={addInclusion}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {inclusions.map((inc, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={inc}
                          onChange={(e) => updateInclusion(index, e.target.value)}
                          placeholder="Enter inclusion item"
                          className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 outline-none"
                        />
                        <button
                          onClick={() => removeInclusion(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 rounded transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-red-700">✗ Exclusions</h3>
                    <button
                      onClick={addExclusion}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {exclusions.map((exc, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={exc}
                          onChange={(e) => updateExclusion(index, e.target.value)}
                          placeholder="Enter exclusion item"
                          className="flex-1 p-3 border-2 border-red-200 rounded-lg focus:border-red-500 outline-none"
                        />
                        <button
                          onClick={() => removeExclusion(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 rounded transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-purple-600 mb-4">Quick Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-purple-50 rounded-lg">
              <Calendar className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="text-2xl font-bold text-purple-700">{days.length}</p>
              <p className="text-sm text-gray-600">Days</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Hotel className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-2xl font-bold text-blue-700">{hotels.length}</p>
              <p className="text-sm text-gray-600">Hotels</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <DollarSign className="mx-auto mb-2 text-green-600" size={24} />
              <p className="text-2xl font-bold text-green-700">₹{payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Cost</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Check className="mx-auto mb-2 text-orange-600" size={24} />
              <p className="text-2xl font-bold text-orange-700">{inclusions.filter(i => i).length}</p>
              <p className="text-sm text-gray-600">Inclusions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
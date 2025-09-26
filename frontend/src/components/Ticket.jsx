import React, { useState } from "react";
import {QRCodeSVG} from "qrcode.react";

const Ticket = ({ ticket }) => {
  if (!ticket) return null;
  const {
    QR_JWT,
    ticket_count,
    ticketStatus,
    purchased_at,
    Events = {},
  } = ticket;
  const {
    title,
    city,
    locationName,
    address,
    startTime,
    endTime,
    status: eventStatus,
  } = Events;
  const formatDate = (d) => {
    if (!d) return "TBA";
    const date = new Date(d);
    const day = date.getDate();
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const month = date.toLocaleString('default', { month: 'long' });
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${day}${daySuffix(day)} ${month} ${hours}:${minStr} ${ampm}`;
  };
  const [qrOpen, setQrOpen] = useState(false);
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-orange-500 rounded-2xl p-7 shadow-2xl flex flex-col items-center gap-4 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-block w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">🎟️</span>
        <span className="text-2xl font-extrabold text-white tracking-tight">{title}</span>
      </div>
      <div className="text-sm text-gray-300 mb-1 font-medium">{locationName || address || city}</div>
      <div className="flex gap-2 text-xs text-gray-400 mb-2">
        <span>Date: <span className="text-orange-300 font-semibold">{formatDate(startTime)}</span></span>
      </div>
      <div className="flex gap-4 mb-2">
        <span className="bg-gray-800 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">Tickets: {ticket_count}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticketStatus === 'valid' ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-300'}`}>Status: {ticketStatus}</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">Purchased: {formatDate(purchased_at)}</div>
      <div className="mt-4 flex flex-col items-center">
        <div className="bg-white rounded-xl p-3 shadow-lg cursor-pointer" onClick={() => setQrOpen(true)} title="Click to enlarge">
          <QRCodeSVG value={QR_JWT} size={120} bgColor="#fff" fgColor="#222" />
        </div>
        <div className="text-xs text-gray-500 mt-2 font-mono tracking-tight">Show this QR code at entry</div>
      </div>
      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setQrOpen(false)}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <QRCodeSVG value={QR_JWT} size={300} bgColor="#fff" fgColor="#222" />
            <button className="mt-6 px-4 py-2 rounded bg-orange-500 text-white font-bold shadow" onClick={() => setQrOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;

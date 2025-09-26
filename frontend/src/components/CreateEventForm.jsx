import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import citiesData from '../assets/cities.json';

const CreateEventForm = ({ onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [price, setPrice] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [images, setImages] = useState([]);
  // no edit mode: keep form focused on creation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const posterInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const mapped = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...mapped]);

  };

  const removeImage = (index) => {
    setImages((prev) => {
      const item = prev[index];
      if (item && item.url) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePosterChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (posterFile && posterFile.url) URL.revokeObjectURL(posterFile.url);
    setPosterFile({ file: f, url: URL.createObjectURL(f) });
  };

  const removePoster = () => {
    if (posterFile && posterFile.url) URL.revokeObjectURL(posterFile.url);
    setPosterFile(null);
  };

  const handleVideoChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (videoFile && videoFile.url) URL.revokeObjectURL(videoFile.url);
    setVideoFile({ file: f, url: URL.createObjectURL(f) });
  };

  const removeVideo = () => {
    if (videoFile && videoFile.url) URL.revokeObjectURL(videoFile.url);
    setVideoFile(null);
  };


  useEffect(() => {
    return () => {
      images.forEach((it) => it.url && URL.revokeObjectURL(it.url));
      if (posterFile && posterFile.url) URL.revokeObjectURL(posterFile.url);
      if (videoFile && videoFile.url) URL.revokeObjectURL(videoFile.url);
    };
  }, [images, posterFile, videoFile]);


  // no initialData handling for create-only form

  const resetEnd = () => {
    setEndYear('');
    setEndMonth('');
    setEndDay('');
    setEndHour('');
    setEndMinute('');
  };


  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    const onDocDown = (e) => {
      if (startPickerRef.current && !startPickerRef.current.contains(e.target)) setStartOpen(false);
      if (endPickerRef.current && !endPickerRef.current.contains(e.target)) setEndOpen(false);
  if (startTimeRef.current && !startTimeRef.current.contains(e.target)) setStartTimeOpen(false);
  if (endTimeRef.current && !endTimeRef.current.contains(e.target)) setEndTimeOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  const cityOptions = useMemo(() => {
    const names = citiesData.map((c) => c.city.trim()).filter(Boolean);
    const unique = Array.from(new Set(names));
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
  }, []);

  const DatePicker = ({ selected, onSelect, minDate }) => {
    const [visibleMonth, setVisibleMonth] = useState(() => {
      const d = selected ? new Date(selected) : new Date();
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });

    const startOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const endOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);

    const prevMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1));
    const nextMonth = () => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));

    const days = [];
    const firstWeekday = startOfMonth.getDay(); 
    for (let i = 0; i < firstWeekday; i++) days.push(null);
    for (let d = 1; d <= endOfMonth.getDate(); d++) days.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), d));

    const isDisabled = (d) => {
      if (!d) return true;
      if (minDate) {
        const md = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        const cand = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return cand < md;
      }
      return false;
    };

    const format = (d) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;

    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow text-sm w-64 border border-gray-700">
        <div className="flex items-center justify-between mb-2 text-gray-200">
          <button type="button" onClick={prevMonth} className="px-2 text-gray-300 hover:text-orange-400">‹</button>
          <div className="font-semibold">{visibleMonth.toLocaleString(undefined, { month: 'long' })} {visibleMonth.getFullYear()}</div>
          <button type="button" onClick={nextMonth} className="px-2 text-gray-300 hover:text-orange-400">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-300">
          {['S','M','T','W','T','F','S'].map((wd, i) => <div key={`${wd}-${i}`} className="font-medium">{wd}</div>)}
          {days.map((d, i) => (
            <button
              key={d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : `empty-${i}`}
              type="button"
              disabled={isDisabled(d)}
              onClick={() => d && onSelect(d)}
              className={`py-1 rounded ${d && selected && d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth() && d.getDate() === selected.getDate() ? 'bg-orange-500 text-white' : 'hover:bg-gray-700'} ${isDisabled(d) ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {d ? d.getDate() : ''}
            </button>
          ))}
        </div>
      </div>
    );
  };


  const ClockPicker = ({ selectedHour, selectedMinute, onSelect }) => {
    const selH = selectedHour !== '' ? parseInt(selectedHour, 10) : null;
    const selM = selectedMinute !== '' ? parseInt(selectedMinute, 10) : null;
    const selPeriod = selH === null ? 'AM' : (selH >= 12 ? 'PM' : 'AM');
    const sel12 = selH === null ? null : ((selH % 12) === 0 ? 12 : selH % 12);

    const [period, setPeriod] = useState(selPeriod);

    const hours12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12

    const to24 = (h12, p) => {
      if (h12 === 12 && p === 'AM') return 0;
      if (h12 === 12 && p === 'PM') return 12;
      return p === 'PM' ? h12 + 12 : h12;
    };

    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow text-sm w-48 border border-gray-700">
        <div className="mb-2 font-medium flex justify-between items-center text-gray-200">
          <div>Pick time</div>
          <div className="flex gap-1">
            <button type="button" onClick={() => setPeriod('AM')} className={`px-2 py-1 rounded ${period === 'AM' ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>AM</button>
            <button type="button" onClick={() => setPeriod('PM')} className={`px-2 py-1 rounded ${period === 'PM' ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>PM</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {hours12.map((h12) => (
            <button
              key={h12}
              type="button"
              onClick={() => onSelect(to24(h12, period), selM !== null ? selM : 0)}
              className={`py-1 rounded ${sel12 === h12 && selPeriod === period ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              {h12}
            </button>
          ))}
        </div>
        <div className="mb-1 font-medium text-gray-200">Minutes</div>
        <div className="grid grid-cols-4 gap-1">
          {minutes.map((m) => (
            <button key={m} type="button" onClick={() => onSelect(sel12 !== null ? to24(sel12, period) : (period === 'PM' ? 12 : 0), m)} className={`py-1 rounded ${m === selM ? 'bg-orange-500 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>{m.toString().padStart(2,'0')}</button>
          ))}
        </div>
      </div>
    );
  };


  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1; 
  const todayDay = now.getDate();

  const years = [todayYear, todayYear + 1, todayYear + 2];


  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const allDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];


  const allowedStartMonths = allMonths.filter((m) => {
    if (!startYear) return allMonths;
    const y = parseInt(startYear, 10);
    if (y > todayYear) return true;
    return m >= todayMonth;
  });

  const allowedStartDays = allDays.filter((d) => {
    if (!startYear || !startMonth) return allDays;
    const y = parseInt(startYear, 10);
    const m = parseInt(startMonth, 10);
    if (y > todayYear) return true;
    if (m > todayMonth) return true;
    return d >= todayDay;
  });

  
  const allowedEndMonths = allMonths.filter((m) => {
    if (!endYear) return allMonths;
    const ey = parseInt(endYear, 10);
    if (!startYear) {
      if (ey > todayYear) return true;
      return m >= todayMonth;
    }
    const sy = parseInt(startYear, 10);
    const sm = parseInt(startMonth || 0, 10);
    if (ey > sy) {
      if (ey > todayYear) return true;
      return m >= todayMonth;
    }
    return m >= sm;
  });

  const allowedEndDays = allDays.filter((d) => {
    if (!endYear || !endMonth) return allDays;
    const ey = parseInt(endYear, 10);
    const em = parseInt(endMonth, 10);
    if (!startYear || !startMonth || !startDay) {
      if (ey > todayYear) return true;
      if (em > todayMonth) return true;
      return d >= todayDay;
    }
    const sy = parseInt(startYear, 10);
    const sm = parseInt(startMonth, 10);
    const sd = parseInt(startDay, 10);
    if (ey > sy) {
      if (ey > todayYear) return true;
      if (em > todayMonth) return true;
      return d >= todayDay;
    }
    if (em > sm) return true;
    if (em === sm) return d >= sd;
    return false;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) return setError('Not authenticated');

    if (!title || !description || !locationName || !address || !city || !price || !ticketsAvailable) {
      return setError('Please fill all required fields');
    }
    if (!posterFile) return setError('Poster is required');
    const buildDate = (y, m, d, hh, mm) => {
      if (!y || !m || !d || hh === '' || mm === '') return null;
      const Y = parseInt(y, 10);
      const M = parseInt(m, 10) - 1; 
      const D = parseInt(d, 10);
      const H = parseInt(hh, 10);
      const Min = parseInt(mm, 10);
      const dt = new Date(Y, M, D, H, Min, 0);
      if (isNaN(dt.getTime())) return null;
      if (dt.getFullYear() !== Y || dt.getMonth() !== M || dt.getDate() !== D || dt.getHours() !== H || dt.getMinutes() !== Min) return null;
      return dt;
    };

    const builtStartDate = buildDate(startYear, startMonth, startDay, startHour, startMinute);
    const builtEndDate = buildDate(endYear, endMonth, endDay, endHour, endMinute);
    if (!builtStartDate || !builtEndDate) return setError('Please select start and end date/time');
    if (builtEndDate <= builtStartDate) return setError('End time must be after start time');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('locationName', locationName);
    formData.append('address', address);
  formData.append('city', city);
  formData.append('startTime', builtStartDate.toISOString());
  formData.append('endTime', builtEndDate.toISOString());
  formData.append('price', price);
    formData.append('tickets_available', ticketsAvailable);
  formData.append('poster', posterFile.file);
  if (videoFile) formData.append('video', videoFile.file);
  images.forEach((img) => formData.append('image', img.file));

    try {
      setLoading(true);
      setProgress(0);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/organizer/create-event`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Failed to save event');
        return;
      }
      setProgress(100);
      if (onSuccess) onSuccess(data.event || data);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Network or server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl">
      {error && <div className="text-red-400 mb-3">{error}</div>}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="md:col-span-1">
          <label className="block text-gray-300 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Location Name</label>
          <input value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white h-28" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">City</label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white">
            <option value="">Select a city</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Start Date & Time</label>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input onFocus={() => setStartOpen(true)} onClick={() => setStartOpen(true)} readOnly value={startYear && startMonth && startDay ? `${startDay}-${startMonth}-${startYear}` : ''} placeholder="Select date" className="px-3 py-2 rounded-md bg-gray-700 text-white w-40" />
              <div className="absolute right-1 top-1">
                <div className="text-sm text-gray-300">📅</div>
              </div>
              {/* popover - open on focus/click */}
              <div className="absolute left-0 mt-1 z-50" style={{ transform: 'translateY(6px)' }} ref={startPickerRef}>
                {startOpen && (
                  <div className="relative">
                    <DatePicker selected={startYear && startMonth && startDay ? new Date(parseInt(startYear,10), parseInt(startMonth,10)-1, parseInt(startDay,10)) : null} onSelect={(d) => {
                      setStartYear(d.getFullYear()); setStartMonth(d.getMonth()+1); setStartDay(d.getDate()); resetEnd(); setStartOpen(false);
                    }} minDate={new Date()} />
                  </div>
                )}
              </div>
            </div>
            <div className="relative" ref={startTimeRef}>
              <input onFocus={() => setStartTimeOpen(true)} onClick={() => setStartTimeOpen(true)} readOnly value={startHour !== '' && startMinute !== '' ? (() => {
                const h24 = parseInt(startHour,10);
                const ampm = h24 >= 12 ? 'PM' : 'AM';
                const h12 = (h24 % 12) === 0 ? 12 : (h24 % 12);
                return `${String(h12).padStart(2,'0')}:${String(startMinute).padStart(2,'0')} ${ampm}`;
              })() : ''} placeholder="HH:MM" className="px-3 py-2 rounded-md bg-gray-700 text-white w-36" />
              <div className="absolute left-0 mt-1 z-50" style={{ transform: 'translateY(6px)' }}>
                {startTimeOpen && (
                  <div ref={startTimeRef} className="relative">
                    <ClockPicker selectedHour={startHour} selectedMinute={startMinute} onSelect={(h, m) => { setStartHour(String(h)); setStartMinute(String(m)); resetEnd(); setStartTimeOpen(false); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
  </div>

  <div className="md:col-span-1">
          <label className="block text-gray-300 mb-1">End Date & Time</label>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input onFocus={() => setEndOpen(true)} onClick={() => setEndOpen(true)} readOnly value={endYear && endMonth && endDay ? `${endDay}-${endMonth}-${endYear}` : ''} placeholder="Select date" className="px-3 py-2 rounded-md bg-gray-700 text-white w-40" />
              <div className="absolute right-1 top-1">
                <div className="text-sm text-gray-300">📅</div>
              </div>
              <div className="absolute left-0 mt-1 z-50" style={{ transform: 'translateY(6px)' }} ref={endPickerRef}>
                {endOpen && (
                  <div className="relative">
                    <DatePicker selected={endYear && endMonth && endDay ? new Date(parseInt(endYear,10), parseInt(endMonth,10)-1, parseInt(endDay,10)) : null} onSelect={(d) => {
                      setEndYear(d.getFullYear()); setEndMonth(d.getMonth()+1); setEndDay(d.getDate()); setEndOpen(false);
                    }} minDate={startYear && startMonth && startDay ? new Date(parseInt(startYear,10), parseInt(startMonth,10)-1, parseInt(startDay,10)) : new Date()} />
                  </div>
                )}
              </div>
            </div>
            <div className="relative" ref={endTimeRef}>
              <input onFocus={() => setEndTimeOpen(true)} onClick={() => setEndTimeOpen(true)} readOnly value={endHour !== '' && endMinute !== '' ? (() => {
                const h24 = parseInt(endHour,10);
                const ampm = h24 >= 12 ? 'PM' : 'AM';
                const h12 = (h24 % 12) === 0 ? 12 : (h24 % 12);
                return `${String(h12).padStart(2,'0')}:${String(endMinute).padStart(2,'0')} ${ampm}`;
              })() : ''} placeholder="HH:MM" className="px-3 py-2 rounded-md bg-gray-700 text-white w-36" />
              <div className="absolute left-0 mt-1 z-50" style={{ transform: 'translateY(6px)' }}>
                {endTimeOpen && (
                  <div ref={endTimeRef} className="relative">
                    <ClockPicker selectedHour={endHour} selectedMinute={endMinute} onSelect={(h, m) => { setEndHour(String(h)); setEndMinute(String(m)); setEndTimeOpen(false); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
  </div>
        <div>
          <label className="block text-gray-300 mb-1">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Tickets Available</label>
          <input type="number" value={ticketsAvailable} onChange={(e) => setTicketsAvailable(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-700 text-white" />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Poster (required)</label>
          <input ref={posterInputRef} type="file" accept="image/*" onClick={() => { if (posterInputRef.current) posterInputRef.current.value = ''; }} onChange={handlePosterChange} className="w-full text-sm text-gray-300" />
          {posterFile && posterFile.file && (
            <div className="text-gray-300 text-sm mt-1">Selected: {posterFile.file.name}</div>
          )}
          {posterFile && (
            <div className="mt-2 flex items-center gap-3">
              <div className="w-28 h-20 rounded overflow-hidden bg-gray-700">
                <img src={posterFile.url} alt="poster-preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => window.open(posterFile.url, '_blank')} className="px-3 py-1 bg-gray-600 text-white rounded">View</button>
                <button type="button" onClick={removePoster} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Video (optional)</label>
          <input ref={videoInputRef} type="file" accept="video/*" onClick={() => { if (videoInputRef.current) videoInputRef.current.value = ''; }} onChange={handleVideoChange} className="w-full text-sm text-gray-300" />
          {videoFile && videoFile.file && (
            <div className="text-gray-300 text-sm mt-1">Selected: {videoFile.file.name}</div>
          )}
          {videoFile && (
            <div className="mt-2 flex items-center gap-3">
              <div className="w-36 h-20 rounded overflow-hidden bg-black">
                <video src={videoFile.url} className="w-full h-full object-cover" controls />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => window.open(videoFile.url, '_blank')} className="px-3 py-1 bg-gray-600 text-white rounded">View</button>
                <button type="button" onClick={removeVideo} className="px-3 py-1 bg-red-600 text-white rounded">Remove</button>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-1">Images (optional, multiple)</label>
          <input ref={imagesInputRef} name="image" type="file" accept="image/*" multiple onClick={() => { if (imagesInputRef.current) imagesInputRef.current.value = ''; }} onChange={handleImagesChange} className="w-full text-sm text-gray-300" />
          {images.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {images.map((it, idx) => (
                <div key={idx} className="w-20 h-20 rounded overflow-hidden relative bg-gray-700">
                  <img src={it.url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded px-1 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <div className="text-gray-300 text-sm mt-1">{images.length} file{images.length > 1 ? 's' : ''} selected</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        <div className="flex-1">
          {progress > 0 && (
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-orange-500" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CreateEventForm;

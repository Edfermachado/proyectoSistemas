"use client";
import { useState, useEffect } from 'react';

export function EventTimePicker({ 
  initialDate = "", 
  initialDuration = 60 
}: { 
  initialDate?: string, 
  initialDuration?: number 
}) {
  const [date, setDate] = useState(initialDate);
  const [hours, setHours] = useState(Math.floor(initialDuration / 60));
  const [minutes, setMinutes] = useState(initialDuration % 60);

  const durationInMinutes = (hours * 60) + minutes;

  let timeRange = "";
  if (date) {
    const start = new Date(date);
    if (!isNaN(start.getTime())) {
      const end = new Date(start.getTime() + durationInMinutes * 60000);
      const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeRange = `${formatTime(start)} - ${formatTime(end)}`;
    }
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="duration" value={durationInMinutes} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-title-sm text-university-blue mb-2">Fecha y Hora de Inicio</label>
          <input 
            name="date" 
            required 
            type="datetime-local" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" 
          />
        </div>
        <div>
          <label className="block font-title-sm text-university-blue mb-2">Duración Estimada</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-2 focus-within:ring-2 focus-within:ring-academic-gold">
              <input 
                type="number" 
                min="0" 
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                className="w-full py-3 bg-transparent text-center focus:outline-none" 
              />
              <span className="text-on-surface-variant text-sm pr-2">hrs</span>
            </div>
            <div className="flex-1 flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-2 focus-within:ring-2 focus-within:ring-academic-gold">
              <input 
                type="number" 
                min="0" 
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className="w-full py-3 bg-transparent text-center focus:outline-none" 
              />
              <span className="text-on-surface-variant text-sm pr-2">min</span>
            </div>
          </div>
        </div>
      </div>
      
      {timeRange && (
        <div className="px-4 py-3 bg-academic-gold/10 text-academic-gold rounded-xl border border-academic-gold/20 flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-xl">schedule</span>
          <span className="font-medium text-sm">Horario estimado: {timeRange}</span>
        </div>
      )}
    </div>
  );
}

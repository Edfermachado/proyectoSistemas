"use client";

import React, { useState } from 'react';

type EventData = {
  id: string;
  title: string;
  date: string | Date;
  duration: number;
  space?: { id: string; name: string };
};

export function WeeklyGrid({ events }: { events: EventData[] }) {
  // Configuración de la grilla
  const startHour = 7; // 7 AM
  const endHour = 22; // 10 PM
  const totalHours = endHour - startHour;
  
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Obtener fecha base de inicio de la semana actual
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay() === 0 ? 6 : date.getDay() - 1; // 0 = Lunes, 6 = Domingo
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-surface-white p-4 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="font-title-lg text-university-blue">Calendario Semanal</h2>
        <div className="flex gap-2">
          <button onClick={prevWeek} className="p-2 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-university-blue transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center px-4 font-medium text-on-surface">
            Semana del {startOfWeek.getDate()}/{startOfWeek.getMonth() + 1}
          </div>
          <button onClick={nextWeek} className="p-2 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-university-blue transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-4 custom-scrollbar">
        <div className="min-w-[900px]">
          {/* Cabecera de días */}
          <div className="grid grid-cols-8 border-b border-outline-variant/50">
            <div className="p-3"></div>
            {days.map((day, idx) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + idx);
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div key={day} className={`p-3 text-center border-l border-outline-variant/30 ${isToday ? 'bg-academic-gold/10' : ''}`}>
                  <p className={`font-title-sm ${isToday ? 'text-academic-gold font-bold' : 'text-university-blue'}`}>{day}</p>
                  <p className="text-xs text-on-surface-variant">{date.getDate()}/{date.getMonth() + 1}</p>
                </div>
              );
            })}
          </div>

          {/* Grilla */}
          <div className="relative grid grid-cols-8">
            {/* Columna de horas */}
            <div className="flex flex-col border-r border-outline-variant/50">
              {Array.from({ length: totalHours }).map((_, i) => (
                <div key={i} className="h-[60px] border-b border-outline-variant/30 text-xs text-on-surface-variant text-right pr-3 pt-1">
                  {startHour + i}:00
                </div>
              ))}
            </div>

            {/* Columnas de días */}
            {days.map((day, dayIdx) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + dayIdx);
              const isToday = new Date().toDateString() === date.toDateString();
              
              // Filtrar eventos para este día
              const dayEvents = events.filter(e => {
                const eDate = new Date(e.date);
                return eDate.getFullYear() === date.getFullYear() && 
                      eDate.getMonth() === date.getMonth() && 
                      eDate.getDate() === date.getDate();
              });

              return (
                <div key={dayIdx} className={`relative border-r border-outline-variant/30 ${isToday ? 'bg-academic-gold/5' : ''}`}>
                  {/* Líneas horizontales de hora */}
                  {Array.from({ length: totalHours }).map((_, i) => (
                    <div key={i} className="h-[60px] border-b border-outline-variant/10"></div>
                  ))}

                  {/* Eventos */}
                  {dayEvents.map(event => {
                    const eDate = new Date(event.date);
                    const endDate = new Date(eDate.getTime() + event.duration * 60000);
                    const startMins = (eDate.getHours() * 60 + eDate.getMinutes()) - (startHour * 60);
                    
                    // Si el evento está fuera del rango visible, lo omitimos para no romper el layout
                    if (startMins < 0 || startMins > totalHours * 60) return null;

                    // 1 hora = 60px
                    const top = (startMins / 60) * 60; // px
                    const height = (event.duration / 60) * 60; // px

                    const startTimeStr = `${eDate.getHours().toString().padStart(2, '0')}:${eDate.getMinutes().toString().padStart(2, '0')}`;
                    const endTimeStr = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                    return (
                      <div 
                        key={event.id} 
                        className="absolute left-1 right-1 bg-university-blue/10 border-l-4 border-university-blue rounded p-2 overflow-hidden text-xs shadow-sm hover:shadow-md transition-all z-10 hover:z-20 group flex flex-col"
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <p className="font-bold text-university-blue truncate">{event.title}</p>
                        <p className="text-[10px] text-university-blue/80 font-medium truncate">{startTimeStr} - {endTimeStr}</p>
                        {event.space && <p className="truncate text-on-surface-variant mt-auto">{event.space.name}</p>}
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-surface-white/95 absolute inset-0 p-2 text-[10px] flex flex-col justify-center">
                          <p className="font-bold text-university-blue">{event.title}</p>
                          <p className="font-medium">{startTimeStr} - {endTimeStr}</p>
                          {event.space && <p className="text-on-surface-variant">{event.space.name}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

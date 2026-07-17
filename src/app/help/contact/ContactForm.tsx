"use client";

import { useState, useRef } from "react";

export default function ContactForm({ supportEmail }: { supportEmail: string }) {
  const [buttonState, setButtonState] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonState("sending");

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString() || "";
    const email = formData.get('email')?.toString() || "";
    const subject = formData.get('subject')?.toString() || "support";
    const message = formData.get('message')?.toString() || "";

    const subjectText = subject === 'support' ? 'Soporte Técnico' :
                        subject === 'sales' ? 'Ventas' :
                        subject === 'organizers' ? 'Organizadores' : 'Otro';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: subjectText, message, supportEmail }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setButtonState("sent");
      if (formRef.current) {
        formRef.current.reset();
      }

      setTimeout(() => {
        setButtonState("idle");
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setButtonState("idle");
      alert("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="bg-surface-white rounded-2xl shadow-sm border border-outline-variant p-6 md:p-10">
      <h2 className="font-headline-md text-2xl text-university-blue mb-6 font-bold">Envíanos un mensaje</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm font-bold text-on-surface-variant" htmlFor="name">
              Nombre Completo
            </label>
            <input
              required
              name="name"
              id="name"
              placeholder="Juan Pérez"
              type="text"
              className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-blue focus:border-university-blue transition-all bg-surface-container-lowest outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-sm font-bold text-on-surface-variant" htmlFor="email">
              Correo Institucional
            </label>
            <input
              required
              name="email"
              id="email"
              placeholder="usuario@universidad.edu"
              type="email"
              className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-blue focus:border-university-blue transition-all bg-surface-container-lowest outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-sm font-bold text-on-surface-variant" htmlFor="subject">
            Asunto
          </label>
          <select
            name="subject"
            id="subject"
            className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-blue focus:border-university-blue transition-all bg-surface-container-lowest outline-none appearance-none cursor-pointer text-sm"
          >
            <option value="support">Soporte Técnico</option>
            <option value="sales">Ventas</option>
            <option value="organizers">Organizadores</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-sm font-bold text-on-surface-variant" htmlFor="message">
            Mensaje
          </label>
          <textarea
            required
            name="message"
            id="message"
            placeholder="¿Cómo podemos ayudarte hoy?"
            rows={5}
            className="w-full border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-university-blue focus:border-university-blue transition-all bg-surface-container-lowest outline-none text-sm"
          />
        </div>
        <button
          disabled={buttonState !== "idle"}
          className={`w-full md:w-auto text-on-primary px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-98 cursor-pointer disabled:cursor-not-allowed ${
            buttonState === "sent"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-university-blue hover:bg-primary-container"
          }`}
          type="submit"
        >
          {buttonState === "sending" ? "Enviando..." : buttonState === "sent" ? "¡Mensaje Enviado!" : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
}

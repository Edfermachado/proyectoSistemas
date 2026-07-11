"use client";

import { useActionState } from "react";
import { loginFacultyAdmin } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

export default function FacultyLoginPage() {
  const [state, formAction, pending] = useActionState(loginFacultyAdmin, undefined);

  return (
    <div className="min-h-screen bg-university-blue flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-innovation-purple/10 rounded-bl-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-university-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-university-blue">shield_person</span>
          </div>
          <h1 className="font-headline-lg text-2xl text-university-blue">Portal de Facultad</h1>
          <p className="text-on-surface-variant text-sm mt-2">Inicia sesión como administrador de tu facultad</p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-xl text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-university-blue mb-2">Correo Electrónico</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="admin@facultad.edu"
              className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-university-blue mb-2">Contraseña</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest"
            />
          </div>
          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full justify-center" disabled={pending}>
              {pending ? "Autenticando..." : "Entrar al Dashboard"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

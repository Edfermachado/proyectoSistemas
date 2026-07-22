"use client";

import { useActionState } from "react";
import { loginSuperAdmin } from "@/app/actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginSuperAdmin, undefined);

  return (
    <div className="bg-surface-bright text-on-surface font-body-md min-h-screen flex flex-col pt-16">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-10">
        <div className="w-full max-w-5xl bg-surface-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-outline-variant/30">
          {/* Left Side: Brand Visual & Message */}
          <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-university-blue/80 z-10 flex flex-col justify-center px-12 text-surface-white">
              <div className="mb-8">
                <span className="font-headline-md text-3xl text-academic-gold mb-2 block font-extrabold tracking-tight">
                  UniEvents
                </span>
                <div className="h-1.5 w-24 bg-academic-gold rounded-full"></div>
              </div>
              <h1 className="font-headline-lg text-4xl mb-4 font-bold leading-tight">
                Consola de Administración Global
              </h1>
              <p className="font-body-lg text-base text-surface-variant opacity-90 max-w-sm leading-relaxed">
                Portal de backoffice para gestionar las universidades, facultades, accesos de usuarios y parámetros globales del sistema.
              </p>
            </div>
            {/* Thematic Image */}
            <div className="w-full h-full relative">
              <Image
                fill
                priority
                sizes="50vw"
                className="object-cover"
                alt="System Administration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7r2edi3wa6T5TzjlZOvvBCh3K1B-7-fELFTo44IDGSlfGg5WO5Hd-ye0Jy7_nGSg480-ew2Pbv8ji3TxIQXGgWBOiTRuerj03O2OhJssCfG7ieRiTiFgELZRD5t7HHfGeNQz9mAdCPpHULjhADXcL-IY4X8KdkaiMHmqDNbGvuApY3JyAnRmCuQkNtjfeBM4yjzlPfplCiOrb7_Jvp1CcLHcFGwm35Yxg1zkqsAkmwjWujMhCt9SA-Q"
              />
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface-white">
            <div className="mb-8 text-center md:text-left">
              <span className="inline-flex items-center gap-2 bg-academic-gold/20 text-academic-gold px-3.5 py-1 rounded-full border border-academic-gold/30 text-xs font-bold uppercase tracking-widest mb-4">
                Administrador del Sistema
              </span>
              <h2 className="font-headline-md text-3xl text-university-blue mb-2 font-bold">
                Backoffice Login
              </h2>
              <p className="font-body-md text-sm text-slate-500">
                Ingresa con tu correo de administrador global
              </p>
            </div>

            {state?.error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl text-sm font-medium">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-6">
              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface-variant" htmlFor="email">
                    Correo electrónico administrativo
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      admin_panel_settings
                    </span>
                    <input
                      required
                      name="email"
                      id="email"
                      placeholder="admin@unievents.com"
                      type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-university-blue focus:border-university-blue outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface-variant" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      lock
                    </span>
                    <input
                      required
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-university-blue focus:border-university-blue outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={pending}
                className="w-full bg-university-blue text-on-primary font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-container transition-all active:scale-98 transform duration-150 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed mt-4"
                type="submit"
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">sync</span> Cargando...
                  </span>
                ) : (
                  "Entrar a la Consola"
                )}
              </button>

              <div className="text-center pt-4 border-t border-outline-variant/40 mt-6">
                <p className="text-xs text-error font-medium">
                  Atención: El acceso a este panel es estrictamente restringido y monitoreado.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

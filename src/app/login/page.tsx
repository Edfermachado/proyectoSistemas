"use client";

import { useActionState, useState } from "react";
import { loginUser, loginFacultyAdmin } from "@/app/actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"comunidad" | "facultad">("comunidad");
  
  // Create unified action state wrapper
  const [state, formAction, pending] = useActionState(async (prevState: any, formData: FormData) => {
    const roleType = formData.get("roleType");
    if (roleType === "facultad") {
      return await loginFacultyAdmin(prevState, formData);
    } else {
      return await loginUser(prevState, formData);
    }
  }, undefined);

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
                {activeTab === "comunidad" ? "Bienvenido de nuevo a tu comunidad" : "Gestión académica y administrativa"}
              </h1>
              <p className="font-body-lg text-base text-surface-variant opacity-90 max-w-sm leading-relaxed">
                {activeTab === "comunidad" 
                  ? "Conéctate con los eventos académicos, deportivos y culturales más importantes de tu campus."
                  : "Accede al portal administrativo de tu facultad para gestionar eventos y aforos."}
              </p>
            </div>
            {/* Thematic Image */}
            <div className="w-full h-full relative">
              <Image
                fill
                priority
                sizes="50vw"
                className="object-cover"
                alt="Campus Life"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7r2edi3wa6T5TzjlZOvvBCh3K1B-7-fELFTo44IDGSlfGg5WO5Hd-ye0Jy7_nGSg480-ew2Pbv8ji3TxIQXGgWBOiTRuerj03O2OhJssCfG7ieRiTiFgELZRD5t7HHfGeNQz9mAdCPpHULjhADXcL-IY4X8KdkaiMHmqDNbGvuApY3JyAnRmCuQkNtjfeBM4yjzlPfplCiOrb7_Jvp1CcLHcFGwm35Yxg1zkqsAkmwjWujMhCt9SA-Q"
              />
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface-white">
            
            {/* Tabs */}
            <div className="flex bg-surface-container-lowest rounded-xl p-1 mb-8 shadow-sm border border-outline-variant/30">
              <button
                onClick={() => setActiveTab("comunidad")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeTab === "comunidad" 
                    ? "bg-university-blue text-white shadow-md" 
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                Comunidad
              </button>
              <button
                onClick={() => setActiveTab("facultad")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  activeTab === "facultad" 
                    ? "bg-academic-gold text-university-blue shadow-md" 
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                Facultad
              </button>
            </div>

            <div className="mb-8 text-center md:text-left">
              <h2 className="font-headline-md text-3xl text-university-blue mb-2 font-bold">
                {activeTab === "comunidad" ? "Iniciar Sesión" : "Portal de Facultad"}
              </h2>
              <p className="font-body-md text-sm text-slate-500">
                {activeTab === "comunidad" 
                  ? "Ingresa tus credenciales para continuar" 
                  : "Ingreso exclusivo para administradores y gestores"}
              </p>
            </div>

            {state?.error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl text-sm font-medium">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="roleType" value={activeTab} />

              {activeTab === "comunidad" && (
                <>
                  {/* SSO Option (Prominent) */}
                  <button
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-university-blue text-university-blue font-bold text-sm rounded-xl hover:bg-university-blue hover:text-white transition-all duration-300 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined">school</span>
                    Ingresar con mi Universidad
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-outline-variant"></div>
                    <span className="flex-shrink mx-4 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      O accede con
                    </span>
                    <div className="flex-grow border-t border-outline-variant"></div>
                  </div>
                </>
              )}

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface-variant" htmlFor="email">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      mail
                    </span>
                    <input
                      required
                      name="email"
                      id="email"
                      placeholder={activeTab === "comunidad" ? "ejemplo@estudiante.edu" : "admin@facultad.edu"}
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

              {/* Utils */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className={`w-4 h-4 rounded border-outline-variant focus:ring-university-blue ${activeTab === 'facultad' ? 'text-academic-gold' : 'text-university-blue'}`}
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-university-blue transition-colors font-medium">
                    Recordarme
                  </span>
                </label>
                <Link
                  href="#"
                  className={`text-sm font-semibold hover:underline ${activeTab === 'facultad' ? 'text-university-blue' : 'text-innovation-purple'}`}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit */}
              <button
                disabled={pending}
                className={`w-full font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 transform duration-150 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${
                  activeTab === 'facultad' 
                    ? 'bg-academic-gold text-university-blue hover:bg-yellow-400' 
                    : 'bg-university-blue text-white hover:bg-primary-container'
                }`}
                type="submit"
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">sync</span> Cargando...
                  </span>
                ) : (
                  activeTab === "comunidad" ? "Iniciar Sesión" : "Acceder al Portal"
                )}
              </button>

              {/* Sign Up */}
              {activeTab === "comunidad" && (
                <p className="text-center text-sm text-slate-500 pt-2 font-medium">
                  ¿No tienes cuenta?{" "}
                  <Link href="/register" className="text-academic-gold font-bold hover:underline">
                    Regístrate
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

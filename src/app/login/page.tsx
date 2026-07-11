"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginUser, undefined);

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
                Bienvenido de nuevo a tu comunidad
              </h1>
              <p className="font-body-lg text-base text-surface-variant opacity-90 max-w-sm leading-relaxed">
                Conéctate con los eventos académicos, deportivos y culturales más importantes de tu campus.
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
            <div className="mb-8 text-center md:text-left">
              <h2 className="font-headline-md text-3xl text-university-blue mb-2 font-bold">
                Iniciar Sesión
              </h2>
              <p className="font-body-md text-sm text-slate-500">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {state?.error && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl text-sm font-medium">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-6">
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
                      placeholder="ejemplo@universidad.edu"
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
                    className="w-4 h-4 rounded border-outline-variant text-university-blue focus:ring-university-blue"
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-university-blue transition-colors font-medium">
                    Recordarme
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-sm font-semibold text-innovation-purple hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit */}
              <button
                disabled={pending}
                className="w-full bg-university-blue text-on-primary font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-container transition-all active:scale-98 transform duration-150 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                type="submit"
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">sync</span> Cargando...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>

              {/* Sign Up */}
              <p className="text-center text-sm text-slate-500 pt-2 font-medium">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-academic-gold font-bold hover:underline">
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

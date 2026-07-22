"use client";
import Image from "next/image";

const HeroSection = () => (
  <section className="hero-gradient text-white py-20 px-4" data-purpose="hero-section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
    <div className="container mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
        Nuestras <span className="text-uni-gold">Universidades</span>
      </h1>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
        Descubre y conecta con las instituciones académicas que lideran el futuro a través de sus eventos y facultades.
      </p>
      {/* Centralized Search Bar */}
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        </div>
        <input className="w-full bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-uni-gold focus:border-transparent transition-all" placeholder="Busca por nombre de universidad o facultad..." type="text" />
      </div>
    </div>
  </section>
);

const FacultyFilters = () => (
  <section className="bg-white border-b border-slate-200 py-8" data-purpose="faculty-filters" >
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-bold mb-6 text-uni-dark-blue">Filtrar por Facultad</h2>
      <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 no-scrollbar">
        {/* Faculty Pill */}
        <button className="flex-shrink-0 bg-slate-100 hover:bg-uni-blue hover:text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span className="font-semibold text-sm">Ingeniería</span>
        </button>
        <button className="flex-shrink-0 bg-slate-100 hover:bg-uni-blue hover:text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span className="font-semibold text-sm">Medicina</span>
        </button>
        <button className="flex-shrink-0 bg-slate-100 hover:bg-uni-blue hover:text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
          <span className="font-semibold text-sm">Artes</span>
        </button>
        <button className="flex-shrink-0 bg-slate-100 hover:bg-uni-blue hover:text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
          <span className="font-semibold text-sm">Ciencias</span>
        </button>
        <button className="flex-shrink-0 bg-slate-100 hover:bg-uni-blue hover:text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span className="font-semibold text-sm">Negocios</span>
        </button>
      </div>
    </div>
  </section>
);

const UniversityCard = ({ name, handle, faculties, tier, logoUrl, gradientClass }: { name: string, handle: string, faculties: number, tier: string, logoUrl: string, gradientClass: string }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden card-hover" data-purpose="university-card" style={{ transition: 'all 0.3s ease' }}>
    <div className={`h-28 ${gradientClass} relative`}>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
        <Image fill alt={`${name} Logo`} className="w-full h-full object-cover" src={logoUrl} />
      </div>
    </div>
    <div className="pt-14 pb-6 px-6 text-center">
      <h4 className="font-bold text-lg text-uni-dark-blue">{name}</h4>
      <p className="text-slate-500 text-sm mb-4">{handle}</p>
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-center text-xs text-slate-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span>{faculties} Facultades</span>
        </div>
        <div className="flex items-center justify-center text-xs text-slate-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span>{tier}</span>
        </div>
      </div>
      <button className="w-full py-2 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-uni-blue hover:text-uni-blue transition-all">Ver Perfil</button>
    </div>
  </div>
);

const universitiesData = [
  {
    name: "Universidad Central",
    handle: "@UCV_Oficial",
    faculties: 11,
    tier: "Organizador Pro",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMez6dQL3x1bL_2Ww093kF1Z7ZsWEPbQwxTt26Q-I02z5-NFdqFyN_cOs-L3djlgqt4Q-m7cCYJqDPROpy4hy4SDJTgsotC8f9VKvFb-KQeEKO5S8OE4aF42-CJbQkbv_jyb8CNGoyJtl53jWkrjXdPk7sLV4UgFfduunBtoV0h-opA-fh-8VDVCRkvJ2iKJm9hDskQD-7PKs1wmD02m_ru2EXiu68nIo3HVD6dxIYZ2tf2bAFCrPzjQ",
    gradientClass: "bg-gradient-to-r from-blue-600 to-indigo-700"
  },
  {
    name: "Tec de Monterrey",
    handle: "@TEC_MTY",
    faculties: 8,
    tier: "Organizador Elite",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQoxGRF9a_e6nHRii383E1YNcDrcyljdHCu9ybE2DkbM-YVMb9HvqrauQRdMCXcNmi2l9GzakDiiMDIfccy_c4HCjv32rAOpe4yHexab4CQ5ZEV52jCfl082pI2QygwGCmG-bqjniLpdCnrZ2lLHe43yD_6vmLek8O865jdVbPvQIiVnG3aKRcCkzx_FqaTqyyT9Xx3ViwsFH0DIRBqEm4H66MUpRXIfOhXTMD6j27_cAkw9iLYuvOIA",
    gradientClass: "bg-gradient-to-r from-amber-500 to-orange-600"
  },
  {
    name: "Universidad de Palermo",
    handle: "@UP_Arg",
    faculties: 6,
    tier: "Organizador Activo",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdV4O2qvkypT8F1YsMNygCMFl_JRvF_gCJO-mHvayjLWkugoXtVpLfasYS41LUQ0JLR6By7nlStRjUjYWP3Rzh_ZCM7W9J8ycyG910LjmM39Pg3o2tzap1fth5LdrbvyvBIg70vNf0aZa1uJfyeixwJje-C6EWfxel2awpqNIVMFhytVFPvEnOmLGSxAxLcUj5P7ENm2Q9Q2GJzbI2u_KwrdbiLpQaJUxHt0ApbFwxv9hG_p4k0RFy_Q",
    gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-600"
  },
  {
    name: "UNI Perú",
    handle: "@UNI_Peru",
    faculties: 12,
    tier: "Organizador Global",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMa_SMBSOt3FAMCp-7WEJRoBmvN8YfRhaROUs96Ug_Ayx423_Xuf3NisY8sPWfI3cXYwOTS8E_angvvgPphjCVie_fmfP7G9JGM8PGPu68vIQ6QGOnHeivKj8DXryPaAP_-gNhDdBXm79YFPuvKdYnLBa9LmiWJygy_olKwDHqhSdxffh5gK0tA-88ntGsd8eCvzhsl39nOaYJ2n288dmcW4acfVitPcMl2Og8cgqL7umKGL3dEhWqIw",
    gradientClass: "bg-gradient-to-r from-red-600 to-rose-700"
  }
];

const UniversityGrid = () => (
  <main className="container mx-auto px-4 py-12" data-purpose="university-listing">
    <div className="flex items-center justify-between mb-8" >
      <h3 className="text-2xl font-bold text-uni-dark-blue">Mostrando {universitiesData.length} resultados</h3>
      <div className="flex items-center space-x-2">
        <button className="p-2 bg-slate-200 rounded text-slate-600"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></button>
        <select className="border-slate-300 rounded-lg text-sm focus:ring-uni-blue">
          <option>Nombre: A -&gt; Z</option>
          <option>Más populares</option>
          <option>Recientes</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {universitiesData.map((uni) => (
        <UniversityCard key={uni.name} {...uni} />
      ))}
    </div>
    {/* Pagination */}
    <div className="mt-12 flex items-center justify-center space-x-4">
      <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
        <span>Ant</span>
      </button>
      <span className="text-sm font-semibold text-slate-700">PAG 1 / 25</span>
      <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2">
        <span>Sig</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  </main>
);

export default function Universities() {
  return (
    <div className="text-slate-900">
      <HeroSection />
      <FacultyFilters />
      <UniversityGrid />
    </div>
  );
}
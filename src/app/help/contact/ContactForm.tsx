"use client";

import { Button } from "@/components/ui/Button";

export default function ContactForm({ supportEmail }: { supportEmail: string }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const university = formData.get('university');
    const subject = formData.get('subject');
    const message = formData.get('message');

    const subjectText = subject === 'nueva_universidad' ? 'Registro de Nueva Universidad' :
                        subject === 'nueva_facultad' ? 'Añadir una Facultad a Universidad Existente' :
                        subject === 'soporte_admin' ? 'Soporte para Administradores de Facultad' : 'Consulta Empresarial';

    const mailtoSubject = encodeURIComponent(`UniEvents Contacto: ${subjectText} - ${university}`);
    const mailtoBody = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nInstitución: ${university}\n\nMensaje:\n${message}`);
    
    window.location.href = `mailto:${supportEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-xl p-8 lg:p-10">
      <h2 className="font-headline-sm text-university-blue mb-6">Envíanos un Mensaje</h2>
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block font-title-sm text-university-blue mb-2">Nombre Completo</label>
          <input type="text" name="name" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all" placeholder="Ej. Dr. Juan Pérez" />
        </div>
        
        <div>
          <label className="block font-title-sm text-university-blue mb-2">Correo Institucional</label>
          <input type="email" name="email" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all" placeholder="juan.perez@universidad.edu" />
        </div>

        <div>
          <label className="block font-title-sm text-university-blue mb-2">Institución / Universidad</label>
          <input type="text" name="university" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all" placeholder="Nombre de tu universidad" />
        </div>
        
        <div>
          <label className="block font-title-sm text-university-blue mb-2">Asunto</label>
          <select name="subject" required defaultValue="" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all appearance-none cursor-pointer">
            <option value="" disabled>Selecciona una opción</option>
            <option value="nueva_universidad">Registro de Nueva Universidad</option>
            <option value="nueva_facultad">Añadir una Facultad a Universidad Existente</option>
            <option value="soporte_admin">Soporte para Administradores de Facultad</option>
            <option value="otro">Otras consultas empresariales</option>
          </select>
        </div>

        <div>
          <label className="block font-title-sm text-university-blue mb-2">Mensaje Adicional</label>
          <textarea name="message" rows={4} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all" placeholder="Cuéntanos brevemente sobre las necesidades de tu institución..." />
        </div>

        <div className="pt-4">
          <Button type="submit" variant="primary" className="w-full justify-center py-4 text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
            Contactar al Administrador Principal
          </Button>
        </div>
        <p className="text-center text-sm text-on-surface-variant mt-4">
          O envíanos un correo directamente a: <a href={`mailto:${supportEmail}`} className="text-university-blue font-bold hover:underline">{supportEmail}</a>
        </p>
      </form>
    </div>
  );
}

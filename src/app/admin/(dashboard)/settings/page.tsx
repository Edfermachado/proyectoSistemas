import { db } from "@/db";
import { systemSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/Button";

export default async function SettingsPage() {
  const settingsList = await db.query.systemSettings.findMany();
  const supportEmailSetting = settingsList.find(s => s.key === "support_email");

  async function updateSettings(formData: FormData) {
    "use server";
    const supportEmail = formData.get("supportEmail") as string;
    
    // Check if exists
    const existing = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, "support_email")
    });

    if (existing) {
      await db.update(systemSettings)
        .set({ value: supportEmail, updatedAt: new Date() })
        .where(eq(systemSettings.key, "support_email"));
    } else {
      await db.insert(systemSettings)
        .values({
          key: "support_email",
          value: supportEmail,
          description: "Correo principal del sistema para soporte y onboarding."
        });
    }

    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Configuración del Sistema</h1>
        <p className="text-on-surface-variant text-body-md">
          Ajustes globales y variables de entorno dinámicas.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden max-w-3xl">
        <div className="p-8 border-b border-outline-variant/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-university-blue/10 text-university-blue rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-university-blue">Contacto y Soporte</h2>
              <p className="text-sm text-on-surface-variant">Define hacia dónde se dirigen las solicitudes de nuevas facultades y universidades.</p>
            </div>
          </div>

          <form action={updateSettings} className="space-y-5">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Correo de Soporte Principal</label>
              <input 
                type="email" 
                name="supportEmail"
                defaultValue={supportEmailSetting?.value || "admin@unievents.com"}
                required 
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest transition-all" 
                placeholder="ej. soporte@universidad.edu" 
              />
              <p className="text-xs text-on-surface-variant mt-2">
                Todos los mensajes del formulario de ayuda pública serán dirigidos a este buzón de correo.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" icon="save">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

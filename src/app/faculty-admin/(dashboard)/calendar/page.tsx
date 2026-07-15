import { db } from "@/db";
import { events as eventsSchema, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WeeklyGrid } from "@/components/WeeklyGrid";

export default async function FacultyCalendarPage() {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/login");

  const faculty = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.tenantId as string),
  });

  const eventsList = faculty ? await db.query.events.findMany({
    where: eq(eventsSchema.tenantId, faculty.id),
    with: { space: true },
    orderBy: (events, { desc }) => [desc(events.date)],
  }) : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Calendario de Espacios</h1>
        <p className="text-on-surface-variant text-body-md">
          Visualiza la disponibilidad de los espacios físicos de la facultad y la programación semanal.
        </p>
      </div>

      <WeeklyGrid events={eventsList.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date.toISOString(),
        duration: e.duration,
        space: e.space ? { id: e.space.id, name: e.space.name } : undefined
      }))} />
    </div>
  );
}

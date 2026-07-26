import { db } from "@/db";
import { events, attendees, tenants, universities, departments, spaces, categories, eventRequests, users } from "@/db/schema";
import { count, eq, sql, and, isNull } from "drizzle-orm";

export interface ReportFilterOptions {
  period?: "all" | "30days" | "90days" | "year";
  departmentId?: string;
}

export interface SuperAdminMetricsData {
  summary: {
    totalUniversities: number;
    totalFaculties: number;
    totalDepartments: number;
    totalUsers: number;
    totalSpaces: number;
    totalCapacity: number;
    totalEvents: number;
    approvedEvents: number;
    pendingEvents: number;
    rejectedEvents: number;
    featuredEvents: number;
    totalAttendees: number;
    confirmedAttendees: number;
    pendingAttendees: number;
    scannedAttendees: number;
    estudiantesCount: number;
    foraneosCount: number;
    totalRevenueUsd: number;
    totalRevenueBs: number;
    occupancyRate: number;
    checkInRate: number;
  };
  facultyRanking: Array<{
    tenantId: string;
    facultyName: string;
    universityName: string;
    totalEvents: number;
    totalAttendees: number;
    confirmedAttendees: number;
    scannedAttendees: number;
    revenueUsd: number;
    revenueBs: number;
  }>;
  categoryBreakdown: Array<{
    categoryName: string;
    icon: string;
    totalEvents: number;
    totalAttendees: number;
    revenueUsd: number;
  }>;
  b2bRequestsSummary: Array<{
    requestType: string;
    count: number;
  }>;
  detailedEvents: Array<{
    id: string;
    title: string;
    facultyName: string;
    universityName: string;
    spaceName: string;
    date: string;
    price: number;
    capacity: number;
    totalAttendees: number;
    confirmedAttendees: number;
    scannedAttendees: number;
    revenueUsd: number;
    b2bRequestsCount: number;
    status: string;
  }>;
}

export interface FacultyMetricsData {
  facultyInfo: {
    id: string;
    name: string;
    universityName: string;
  };
  summary: {
    totalEvents: number;
    approvedEvents: number;
    pendingEvents: number;
    rejectedEvents: number;
    featuredEvents: number;
    totalDepartments: number;
    totalSpaces: number;
    totalCapacity: number;
    totalAttendees: number;
    confirmedAttendees: number;
    pendingAttendees: number;
    scannedAttendees: number;
    estudiantesCount: number;
    foraneosCount: number;
    totalRevenueUsd: number;
    totalRevenueBs: number;
    occupancyRate: number;
    checkInRate: number;
  };
  departmentBreakdown: Array<{
    departmentId: string;
    departmentName: string;
    totalEvents: number;
    totalAttendees: number;
    confirmedAttendees: number;
    revenueUsd: number;
  }>;
  spaceUtilization: Array<{
    spaceId: string;
    spaceName: string;
    capacity: number;
    eventsCount: number;
    totalAttendees: number;
    occupancyRate: number;
  }>;
  topEvents: Array<{
    id: string;
    title: string;
    departmentName: string;
    spaceName: string;
    date: string;
    price: number;
    capacity: number;
    totalAttendees: number;
    confirmedAttendees: number;
    scannedAttendees: number;
    occupancyRate: number;
    revenueUsd: number;
    b2bRequestsCount: number;
    status: string;
  }>;
  b2bRequestsSummary: Array<{
    requestType: string;
    count: number;
  }>;
}

export class ReportsService {
  /**
   * Helper to construct raw SQL date clause based on period filter
   */
  private static getDateFilterSql(period?: string, columnPrefix: string = "e") {
    if (!period || period === "all") return sql``;

    const now = new Date();
    let startDate: Date;

    if (period === "30days") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === "90days") {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return sql``;
    }

    const isoStr = startDate.toISOString();
    return sql`AND ${sql.raw(columnPrefix)}.created_at >= ${isoStr}::timestamp`;
  }

  /**
   * Metrics for Super Admin
   */
  static async getSuperAdminMetrics(filters: ReportFilterOptions = {}): Promise<SuperAdminMetricsData> {
    const dateCondition = this.getDateFilterSql(filters.period, "e");

    // 1. High level system counts
    const [uniCount] = await db.select({ value: count() }).from(universities);
    const [tenantCount] = await db.select({ value: count() }).from(tenants);
    const [deptCount] = await db.select({ value: count() }).from(departments);
    const [userCount] = await db.select({ value: count() }).from(users);

    const activeSpaces = await db.select({
      id: spaces.id,
      capacity: spaces.capacity
    }).from(spaces).where(isNull(spaces.deletedAt));
    
    const totalSpacesCount = activeSpaces.length;
    const totalCapacityCount = activeSpaces.reduce((acc, curr) => acc + (curr.capacity || 0), 0);

    // 2. Events breakdown query with subquery for B2B request count and period filter
    const rawEvents = await db.execute(sql`
      SELECT 
        e.id,
        e.title,
        e.price,
        e.capacity as event_capacity,
        e.status,
        e.is_featured,
        e.date,
        t.id as tenant_id,
        t.name as tenant_name,
        u.name as university_name,
        s.name as space_name,
        s.capacity as space_capacity,
        c.name as category_name,
        c.icon as category_icon,
        COALESCE(COUNT(a.id), 0) as total_attendees,
        COALESCE(SUM(CASE WHEN a.status = 'confirmado' THEN 1 ELSE 0 END), 0) as confirmed_attendees,
        COALESCE(SUM(CASE WHEN a.status = 'pago_pendiente' THEN 1 ELSE 0 END), 0) as pending_attendees,
        COALESCE(SUM(CASE WHEN a.scanned_at IS NOT NULL THEN 1 ELSE 0 END), 0) as scanned_attendees,
        COALESCE(SUM(CASE WHEN a.attendee_type = 'estudiante' THEN 1 ELSE 0 END), 0) as estudiantes_count,
        COALESCE(SUM(CASE WHEN a.attendee_type = 'foraneo' THEN 1 ELSE 0 END), 0) as foraneos_count,
        COALESCE(SUM(CASE WHEN a.status = 'confirmado' AND a.payment_amount_bs IS NOT NULL THEN CAST(a.payment_amount_bs AS NUMERIC) ELSE 0 END), 0) as total_bs,
        (SELECT COUNT(er.id) FROM event_requests er WHERE er.event_id = e.id) as b2b_count
      FROM events e
      INNER JOIN tenants t ON e.tenant_id = t.id
      LEFT JOIN universities u ON t.university_id = u.id
      LEFT JOIN spaces s ON e.space_id = s.id
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN attendees a ON e.id = a.event_id
      WHERE e.deleted_at IS NULL ${dateCondition}
      GROUP BY e.id, t.id, t.name, u.name, s.name, s.capacity, c.name, c.icon
      ORDER BY e.created_at DESC
    `);

    const eventRows = Array.from(rawEvents);

    // Calculate Summary Metrics
    let totalEvents = eventRows.length;
    let approvedEvents = 0;
    let pendingEvents = 0;
    let rejectedEvents = 0;
    let featuredEvents = 0;
    let totalAttendees = 0;
    let confirmedAttendees = 0;
    let pendingAttendees = 0;
    let scannedAttendees = 0;
    let estudiantesCount = 0;
    let foraneosCount = 0;
    let totalRevenueUsd = 0;
    let totalRevenueBs = 0;
    let totalOfferedSeats = 0;

    eventRows.forEach((row: any) => {
      const status = String(row.status || '');
      if (status === 'aprobado') approvedEvents++;
      else if (status === 'pendiente_aprobacion') pendingEvents++;
      else if (status === 'rechazado') rejectedEvents++;

      if (row.is_featured) featuredEvents++;

      const conf = Number(row.confirmed_attendees || 0);
      const pend = Number(row.pending_attendees || 0);
      const totalAtt = Number(row.total_attendees || 0);
      const scan = Number(row.scanned_attendees || 0);
      const price = Number(row.price || 0);
      const cap = Number(row.event_capacity || row.space_capacity || 0);

      totalAttendees += totalAtt;
      confirmedAttendees += conf;
      pendingAttendees += pend;
      scannedAttendees += scan;
      estudiantesCount += Number(row.estudiantes_count || 0);
      foraneosCount += Number(row.foraneos_count || 0);
      
      totalRevenueUsd += (conf * price);
      totalRevenueBs += Number(row.total_bs || 0);
      totalOfferedSeats += cap;
    });

    const occupancyRate = totalOfferedSeats > 0 ? Math.min(Math.round((confirmedAttendees / totalOfferedSeats) * 100), 100) : 0;
    const checkInRate = confirmedAttendees > 0 ? Math.round((scannedAttendees / confirmedAttendees) * 100) : 0;

    // 3. Faculty Ranking
    const facultyMap = new Map<string, {
      tenantId: string;
      facultyName: string;
      universityName: string;
      totalEvents: number;
      totalAttendees: number;
      confirmedAttendees: number;
      scannedAttendees: number;
      revenueUsd: number;
      revenueBs: number;
    }>();

    eventRows.forEach((row: any) => {
      const tId = String(row.tenant_id);
      const conf = Number(row.confirmed_attendees || 0);
      const price = Number(row.price || 0);

      if (!facultyMap.has(tId)) {
        facultyMap.set(tId, {
          tenantId: tId,
          facultyName: String(row.tenant_name || 'Facultad'),
          universityName: String(row.university_name || 'N/A'),
          totalEvents: 0,
          totalAttendees: 0,
          confirmedAttendees: 0,
          scannedAttendees: 0,
          revenueUsd: 0,
          revenueBs: 0,
        });
      }

      const item = facultyMap.get(tId)!;
      item.totalEvents += 1;
      item.totalAttendees += Number(row.total_attendees || 0);
      item.confirmedAttendees += conf;
      item.scannedAttendees += Number(row.scanned_attendees || 0);
      item.revenueUsd += (conf * price);
      item.revenueBs += Number(row.total_bs || 0);
    });

    const facultyRanking = Array.from(facultyMap.values()).sort((a, b) => b.revenueUsd - a.revenueUsd || b.confirmedAttendees - a.confirmedAttendees);

    // 4. Category Breakdown
    const catMap = new Map<string, {
      categoryName: string;
      icon: string;
      totalEvents: number;
      totalAttendees: number;
      revenueUsd: number;
    }>();

    eventRows.forEach((row: any) => {
      const catName = String(row.category_name || 'General');
      const icon = String(row.category_icon || 'category');
      const conf = Number(row.confirmed_attendees || 0);
      const price = Number(row.price || 0);

      if (!catMap.has(catName)) {
        catMap.set(catName, {
          categoryName: catName,
          icon,
          totalEvents: 0,
          totalAttendees: 0,
          revenueUsd: 0,
        });
      }
      const item = catMap.get(catName)!;
      item.totalEvents += 1;
      item.totalAttendees += Number(row.total_attendees || 0);
      item.revenueUsd += (conf * price);
    });

    const categoryBreakdown = Array.from(catMap.values()).sort((a, b) => b.revenueUsd - a.revenueUsd);

    // 5. B2B Requests Summary (filtered by period and active events)
    const b2bRaw = await db.execute(sql`
      SELECT er.request_type, COUNT(er.id) as count
      FROM event_requests er
      INNER JOIN events e ON er.event_id = e.id
      WHERE e.deleted_at IS NULL ${dateCondition}
      GROUP BY er.request_type
    `);

    const b2bRequestsSummary = Array.from(b2bRaw).map((r: any) => ({
      requestType: String(r.request_type),
      count: Number(r.count || 0),
    }));

    // 6. Detailed Events
    const detailedEvents = eventRows.map((row: any) => {
      const conf = Number(row.confirmed_attendees || 0);
      const price = Number(row.price || 0);
      return {
        id: String(row.id),
        title: String(row.title),
        facultyName: String(row.tenant_name || 'Facultad'),
        universityName: String(row.university_name || 'N/A'),
        spaceName: String(row.space_name || 'Sin asignar'),
        date: row.date ? new Date(row.date).toISOString().split('T')[0] : 'N/A',
        price,
        capacity: Number(row.event_capacity || row.space_capacity || 0),
        totalAttendees: Number(row.total_attendees || 0),
        confirmedAttendees: conf,
        scannedAttendees: Number(row.scanned_attendees || 0),
        revenueUsd: conf * price,
        b2bRequestsCount: Number(row.b2b_count || 0),
        status: String(row.status || 'pendiente'),
      };
    });

    return {
      summary: {
        totalUniversities: Number(uniCount.value),
        totalFaculties: Number(tenantCount.value),
        totalDepartments: Number(deptCount.value),
        totalUsers: Number(userCount.value),
        totalSpaces: totalSpacesCount,
        totalCapacity: totalCapacityCount,
        totalEvents,
        approvedEvents,
        pendingEvents,
        rejectedEvents,
        featuredEvents,
        totalAttendees,
        confirmedAttendees,
        pendingAttendees,
        scannedAttendees,
        estudiantesCount,
        foraneosCount,
        totalRevenueUsd,
        totalRevenueBs,
        occupancyRate,
        checkInRate,
      },
      facultyRanking,
      categoryBreakdown,
      b2bRequestsSummary,
      detailedEvents,
    };
  }

  /**
   * Metrics for a Specific Faculty Admin
   */
  static async getFacultyMetrics(tenantId: string, filters: ReportFilterOptions = {}): Promise<FacultyMetricsData> {
    const dateCondition = this.getDateFilterSql(filters.period, "e");

    // 1. Get Faculty Info
    const faculty = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
      with: { university: true }
    });

    if (!faculty) throw new Error("Facultad no encontrada");

    const universityId = faculty.universityId;

    // 2. Spaces and Departments of this faculty
    const facultyDepts = await db.select().from(departments).where(eq(departments.tenantId, tenantId));
    
    const facultySpaces = universityId 
      ? await db.select().from(spaces).where(and(eq(spaces.universityId, universityId), isNull(spaces.deletedAt)))
      : [];

    const totalSpaces = facultySpaces.length;
    const totalCapacity = facultySpaces.reduce((acc, curr) => acc + (curr.capacity || 0), 0);

    // 3. Raw Events Query for this Faculty with date condition & department filter
    let deptCondition = sql``;
    if (filters.departmentId) {
      deptCondition = sql`AND e.department_id = ${filters.departmentId}`;
    }

    const rawEvents = await db.execute(sql`
      SELECT 
        e.id,
        e.title,
        e.price,
        e.capacity as event_capacity,
        e.status,
        e.is_featured,
        e.date,
        d.id as department_id,
        d.name as department_name,
        s.id as space_id,
        s.name as space_name,
        s.capacity as space_capacity,
        COALESCE(COUNT(a.id), 0) as total_attendees,
        COALESCE(SUM(CASE WHEN a.status = 'confirmado' THEN 1 ELSE 0 END), 0) as confirmed_attendees,
        COALESCE(SUM(CASE WHEN a.status = 'pago_pendiente' THEN 1 ELSE 0 END), 0) as pending_attendees,
        COALESCE(SUM(CASE WHEN a.scanned_at IS NOT NULL THEN 1 ELSE 0 END), 0) as scanned_attendees,
        COALESCE(SUM(CASE WHEN a.attendee_type = 'estudiante' THEN 1 ELSE 0 END), 0) as estudiantes_count,
        COALESCE(SUM(CASE WHEN a.attendee_type = 'foraneo' THEN 1 ELSE 0 END), 0) as foraneos_count,
        COALESCE(SUM(CASE WHEN a.status = 'confirmado' AND a.payment_amount_bs IS NOT NULL THEN CAST(a.payment_amount_bs AS NUMERIC) ELSE 0 END), 0) as total_bs,
        (SELECT COUNT(er.id) FROM event_requests er WHERE er.event_id = e.id) as b2b_count
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN spaces s ON e.space_id = s.id
      LEFT JOIN attendees a ON e.id = a.event_id
      WHERE e.tenant_id = ${tenantId} AND e.deleted_at IS NULL ${deptCondition} ${dateCondition}
      GROUP BY e.id, d.id, d.name, s.id, s.name, s.capacity
      ORDER BY e.created_at DESC
    `);

    const eventRows = Array.from(rawEvents);

    let totalEvents = eventRows.length;
    let approvedEvents = 0;
    let pendingEvents = 0;
    let rejectedEvents = 0;
    let featuredEvents = 0;
    let totalAttendees = 0;
    let confirmedAttendees = 0;
    let pendingAttendees = 0;
    let scannedAttendees = 0;
    let estudiantesCount = 0;
    let foraneosCount = 0;
    let totalRevenueUsd = 0;
    let totalRevenueBs = 0;
    let totalOfferedSeats = 0;

    eventRows.forEach((row: any) => {
      const status = String(row.status || '');
      if (status === 'aprobado') approvedEvents++;
      else if (status === 'pendiente_aprobacion') pendingEvents++;
      else if (status === 'rechazado') rejectedEvents++;

      if (row.is_featured) featuredEvents++;

      const conf = Number(row.confirmed_attendees || 0);
      const pend = Number(row.pending_attendees || 0);
      const totalAtt = Number(row.total_attendees || 0);
      const scan = Number(row.scanned_attendees || 0);
      const price = Number(row.price || 0);
      const cap = Number(row.event_capacity || row.space_capacity || 0);

      totalAttendees += totalAtt;
      confirmedAttendees += conf;
      pendingAttendees += pend;
      scannedAttendees += scan;
      estudiantesCount += Number(row.estudiantes_count || 0);
      foraneosCount += Number(row.foraneos_count || 0);
      
      totalRevenueUsd += (conf * price);
      totalRevenueBs += Number(row.total_bs || 0);
      totalOfferedSeats += cap;
    });

    const occupancyRate = totalOfferedSeats > 0 ? Math.min(Math.round((confirmedAttendees / totalOfferedSeats) * 100), 100) : 0;
    const checkInRate = confirmedAttendees > 0 ? Math.round((scannedAttendees / confirmedAttendees) * 100) : 0;

    // 4. Department Breakdown
    const deptMap = new Map<string, {
      departmentId: string;
      departmentName: string;
      totalEvents: number;
      totalAttendees: number;
      confirmedAttendees: number;
      revenueUsd: number;
    }>();

    eventRows.forEach((row: any) => {
      const dId = String(row.department_id || 'general');
      const dName = String(row.department_name || 'General / Decanato');
      const conf = Number(row.confirmed_attendees || 0);
      const price = Number(row.price || 0);

      if (!deptMap.has(dId)) {
        deptMap.set(dId, {
          departmentId: dId,
          departmentName: dName,
          totalEvents: 0,
          totalAttendees: 0,
          confirmedAttendees: 0,
          revenueUsd: 0,
        });
      }

      const item = deptMap.get(dId)!;
      item.totalEvents += 1;
      item.totalAttendees += Number(row.total_attendees || 0);
      item.confirmedAttendees += conf;
      item.revenueUsd += (conf * price);
    });

    const departmentBreakdown = Array.from(deptMap.values()).sort((a, b) => b.revenueUsd - a.revenueUsd || b.confirmedAttendees - a.confirmedAttendees);

    // 5. Space Utilization
    const spaceMap = new Map<string, {
      spaceId: string;
      spaceName: string;
      capacity: number;
      eventsCount: number;
      totalAttendees: number;
    }>();

    eventRows.forEach((row: any) => {
      const sId = String(row.space_id || 'unassigned');
      const sName = String(row.space_name || 'Sin Espacio Asignado');
      const cap = Number(row.space_capacity || row.event_capacity || 0);

      if (!spaceMap.has(sId)) {
        spaceMap.set(sId, {
          spaceId: sId,
          spaceName: sName,
          capacity: cap,
          eventsCount: 0,
          totalAttendees: 0,
        });
      }

      const item = spaceMap.get(sId)!;
      item.eventsCount += 1;
      item.totalAttendees += Number(row.confirmed_attendees || 0);
    });

    const spaceUtilization = Array.from(spaceMap.values()).map(s => ({
      ...s,
      occupancyRate: (s.eventsCount > 0 && s.capacity > 0) ? Math.min(Math.round((s.totalAttendees / (s.capacity * s.eventsCount)) * 100), 100) : 0,
    })).sort((a, b) => b.totalAttendees - a.totalAttendees);

    // 6. Top Events
    const topEvents = eventRows.map((row: any) => {
      const conf = Number(row.confirmed_attendees || 0);
      const cap = Number(row.event_capacity || row.space_capacity || 0);
      const price = Number(row.price || 0);
      return {
        id: String(row.id),
        title: String(row.title),
        departmentName: String(row.department_name || 'General'),
        spaceName: String(row.space_name || 'Sin Asignar'),
        date: row.date ? new Date(row.date).toISOString().split('T')[0] : 'N/A',
        price,
        capacity: cap,
        totalAttendees: Number(row.total_attendees || 0),
        confirmedAttendees: conf,
        scannedAttendees: Number(row.scanned_attendees || 0),
        occupancyRate: cap > 0 ? Math.min(Math.round((conf / cap) * 100), 100) : 0,
        revenueUsd: conf * price,
        b2bRequestsCount: Number(row.b2b_count || 0),
        status: String(row.status || 'pendiente'),
      };
    }).sort((a, b) => b.revenueUsd - a.revenueUsd || b.confirmedAttendees - a.confirmedAttendees);

    // 7. B2B Requests Summary for Faculty with date & dept conditions
    const b2bRaw = await db.execute(sql`
      SELECT r.request_type, COUNT(r.id) as count
      FROM event_requests r
      INNER JOIN events e ON r.event_id = e.id
      WHERE e.tenant_id = ${tenantId} AND e.deleted_at IS NULL ${deptCondition} ${dateCondition}
      GROUP BY r.request_type
    `);

    const b2bRequestsSummary = Array.from(b2bRaw).map((r: any) => ({
      requestType: String(r.request_type),
      count: Number(r.count || 0),
    }));

    return {
      facultyInfo: {
        id: faculty.id,
        name: faculty.name,
        universityName: faculty.university?.name || "Universidad",
      },
      summary: {
        totalEvents,
        approvedEvents,
        pendingEvents,
        rejectedEvents,
        featuredEvents,
        totalDepartments: facultyDepts.length,
        totalSpaces,
        totalCapacity,
        totalAttendees,
        confirmedAttendees,
        pendingAttendees,
        scannedAttendees,
        estudiantesCount,
        foraneosCount,
        totalRevenueUsd,
        totalRevenueBs,
        occupancyRate,
        checkInRate,
      },
      departmentBreakdown,
      spaceUtilization,
      topEvents,
      b2bRequestsSummary,
    };
  }

  /**
   * Helper to format CSV data for download
   */
  static generateCsvString(headers: string[], rows: (string | number)[][]): string {
    const BOM = "\uFEFF"; // Byte Order Mark for Excel UTF-8 recognition
    const headerLine = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(",");
    const bodyLines = rows.map(row => 
      row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(",")
    );
    return BOM + [headerLine, ...bodyLines].join("\n");
  }
}

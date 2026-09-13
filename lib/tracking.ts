import { insert, nowIso, readTable, update } from "./db";
import type { AlertRow, Geofence, GeofenceState, Vehicle } from "./db";

export type PingContext = {
  vehicle: Vehicle;
  lat: number;
  lng: number;
  speed?: number;
  fuel?: number;
  ignition?: boolean;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const OVERSPEED_KPH = Number(process.env.OVERSPEED_KPH ?? 80);
const LOW_FUEL_PCT = Number(process.env.LOW_FUEL_PCT ?? 15);

async function openAlerts(cv: Partial<AlertRow>): Promise<AlertRow[]> {
  const all = await readTable<AlertRow>("alerts");
  return all.filter(
    (a) =>
      a.status === "open" &&
      (cv.vehicleId ? a.vehicleId === cv.vehicleId : true) &&
      (cv.customerId ? a.customerId === cv.customerId : true) &&
      (cv.alertType ? a.alertType === cv.alertType : true)
  );
}

async function addAlert(ctx: PingContext, alertType: AlertRow["alertType"], message: string): Promise<void> {
  await insert<AlertRow>("alerts", {
    vehicleId: ctx.vehicle.id,
    customerId: ctx.vehicle.customerId || undefined,
    alertType,
    message,
    status: "open",
    createdAt: nowIso(),
  });
}

async function resolveOpen(vehicleId: number, alertType: AlertRow["alertType"]): Promise<void> {
  const open = await openAlerts({ vehicleId, alertType });
  for (const a of open) {
    await update<AlertRow>("alerts", a.id, { status: "resolved", resolvedAt: nowIso() });
  }
}

async function checkGeofences(ctx: PingContext): Promise<void> {
  const geofences = await readTable<Geofence>("geofences");
  const active = geofences.filter(
    (g) => g.enabled && (g.customerId === null || g.customerId === undefined || g.customerId === ctx.vehicle.customerId)
  );
  if (active.length === 0) return;
  const states = await readTable<GeofenceState>("geofenceStates");
  const vehicleStates = states.filter((s) => s.vehicleId === ctx.vehicle.id);

  for (const g of active) {
    const inside =
      haversineKm(ctx.lat, ctx.lng, Number(g.latitude), Number(g.longitude)) <= g.radiusKm;
    const prev = vehicleStates.find((s) => s.geofenceId === g.id);
    if (prev && prev.inside === inside) continue;
    if (inside) {
      if (prev === undefined) {
        // first contact inside the fence — only record state, no alert
      } else {
        await addAlert(ctx, "geofence_enter", `${ctx.vehicle.name} (${ctx.vehicle.plate ?? "no plate"}) entered geofence "${g.name}"`);
      }
    } else if (prev?.inside) {
      await addAlert(ctx, "geofence_exit", `${ctx.vehicle.name} (${ctx.vehicle.plate ?? "no plate"}) left geofence "${g.name}"`);
    }
    if (prev) {
      await update<GeofenceState>("geofenceStates", prev.id, { inside, updatedAt: nowIso() });
    } else {
      await insert<GeofenceState>("geofenceStates", {
        geofenceId: g.id,
        vehicleId: ctx.vehicle.id,
        inside,
        updatedAt: nowIso(),
      });
    }
  }
}

export async function detectAlerts(ctx: PingContext): Promise<void> {
  const { vehicle, speed, fuel, ignition } = ctx;

  await checkGeofences(ctx);

  if (typeof speed === "number") {
    if (speed > OVERSPEED_KPH) {
      const open = await openAlerts({ vehicleId: vehicle.id, alertType: "overspeed" });
      if (open.length === 0) {
        await addAlert(ctx, "overspeed", `${vehicle.name} is going ${Math.round(speed)} km/h (limit ${OVERSPEED_KPH})`);
      }
    } else {
      await resolveOpen(vehicle.id, "overspeed");
    }
  }

  if (typeof fuel === "number" && typeof vehicle.fuelLevelPct === "number") {
    if (fuel < LOW_FUEL_PCT) {
      const open = await openAlerts({ vehicleId: vehicle.id, alertType: "low_fuel" });
      if (open.length === 0) {
        await addAlert(ctx, "low_fuel", `${vehicle.name} fuel is low (${Math.round(fuel)}%)`);
      }
    } else {
      await resolveOpen(vehicle.id, "low_fuel");
    }
  }

  if (typeof ignition === "boolean" && ignition !== vehicle.ignition) {
    await resolveOpen(vehicle.id, "ignition_on");
    await resolveOpen(vehicle.id, "ignition_off");
    await addAlert(ctx, ignition ? "ignition_on" : "ignition_off", `${vehicle.name} ignition turned ${ignition ? "on" : "off"}`);
  }
}
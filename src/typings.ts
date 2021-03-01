import { LeafletEvent, LatLng } from 'leaflet';

export interface MarkerEvent extends LeafletEvent {
  latLngs: LatLng[][];
}

export interface MarkerEventHandler {
  (event: MarkerEvent): void;
}

export interface FreeDrawOptions {
  mode: number;
  smoothFactor: number;
  elbowDistance: number;
  simplifyFactor: number;
  mergePolygons: boolean;
  concavePolygon: boolean;
  maximumPolygons: number;
  notifyAfterEditExit: boolean;
  leaveModeAfterCreate: boolean;
  strokeWidth: number;
}

declare module 'leaflet' {
  interface Evented {
    on(name: 'markers', handler: MarkerEventHandler, context?: unknown): this;
  }
}

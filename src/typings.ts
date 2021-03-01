/* eslint-disable no-shadow */
import { LeafletEvent, LatLng } from 'leaflet';

export interface MarkerEvent extends LeafletEvent {
  latLngs: LatLng[][];
}

export interface MarkerEventHandler {
  (event: MarkerEvent): void;
}

declare module 'leaflet' {
  interface Evented {
    on(name: 'markers', handler: MarkerEventHandler, context?: unknown): this;
  }
}

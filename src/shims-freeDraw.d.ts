declare module 'leaflet-freedraw' {
  import { LatLng, Polygon, Map } from 'leaflet';

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

  /**
   * @constant NONE
   */
  export const NONE = 0;

  /**
   * @constant CREATE
   */
  export const CREATE = 1;

  /**
   * @constant EDIT
   */
  export const EDIT = 2;

  /**
   * @constant DELETE
   */
  export const DELETE = 4;

  /**
   * @constant APPEND
   */
  export const APPEND = 8;

  /**
   * @constant EDIT_APPEND
   */
  export const EDIT_APPEND = 10;

  /**
   * @constant ALL
   */
  export const ALL = 15;

  /**
   * @constant defaultOptions
   */
  export const defaultOptions: Readonly<FreeDrawOptions>;

  class FreeDraw extends Map {
    constructor(options?: Partial<FreeDrawOptions>);

    create(
      polygon: LatLng[],
      options?: Partial<FreeDrawOptions>,
    ): Polygon[] | boolean;

    remove(polygon: Polygon): void;

    remove(): this;

    clear(): void;

    mode(mode: number): number;

    size(): number;

    all(): Polygon[];

    cancel(): void;
  }

  export default FreeDraw;

  export const freedraw: (options: Partial<FreeDrawOptions>) => FreeDraw;
}

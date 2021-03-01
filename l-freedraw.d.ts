import Vue, { PluginFunction, VueConstructor } from 'vue';
import type {
  MarkerEvent,
  MarkerEventHandler,
  FreeDrawOptions,
} from './src/typings';

declare const LFreedraw: VueConstructor<Vue> & {
  install: PluginFunction<undefined>;
};
export default LFreedraw;

export { MarkerEvent, MarkerEventHandler, FreeDrawOptions };

import Vue, { PluginFunction, VueConstructor } from 'vue';

declare const LFreedraw: VueConstructor<Vue> & {
  install: PluginFunction<undefined>;
};
export default LFreedraw;

declare module 'vue2-leaflet' {
  import Vue from 'vue';

  // eslint-disable-next-line import/prefer-default-export
  export function optionsMerger<T>(options: T, instance: Vue): T;
}

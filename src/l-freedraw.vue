<template>
  <div />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FreeDraw, { NONE, ALL, MarkerEvent } from 'leaflet-freedraw';
import type { FreeDrawOptions } from 'leaflet-freedraw';
import { findRealParent, propsBinder } from 'vue2-leaflet';
import { debounce, isEqual } from 'lodash-es';
import type { LLayerGroup, LMap } from 'vue2-leaflet';
import type { LatLng, Map } from 'leaflet';

function withNonReactive<TData>(data: TData) {
  return <TNonReactive extends unknown>() => data as TData & TNonReactive;
}

function validateMode(mode: number) {
  if (mode < 0 || mode > ALL) {
    return false;
  }
  return true;
}

const props = {
  options: {
    type: Object as PropType<Partial<FreeDrawOptions>>,
    default() {
      return {};
    },
  },
  mode: {
    type: Number,
    default: ALL,
    custom: true,
    validator(value: number) {
      return validateMode(value);
    },
  },
  value: {
    type: Array as PropType<LatLng[][]>,
    custom: true,
    default: () => [],
  },
  debounce: {
    type: Boolean,
    default: true,
    custom: true,
  },
};

export default Vue.extend({
  name: 'LFreeDraw',
  props,
  data() {
    return withNonReactive({
      ready: false,
      lastSetPolygons: [] as LatLng[][],
    })<{
      mapObject: FreeDraw | undefined;
      parentContainer: LLayerGroup | LMap | undefined;
    }>();
  },
  mounted() {
    const noParent =
      'l-freedraw needs to be a children or grand children of a l-map object';
    if (this.$parent) {
      this.mapObject = new FreeDraw({
        ...this.options,
        mode: this.mode,
      });
      this.mapObject.on(this.$listeners);
      propsBinder(this, (this.mapObject as unknown) as Map, props);

      const debouncedHandler = debounce(this.markerHandler, 100);

      if (this.debounce) {
        this.mapObject.on('markers', debouncedHandler);
      } else {
        this.mapObject.on('markers', this.markerHandler);
      }

      this.parentContainer = findRealParent(this.$parent);
      if (this.parentContainer) {
        this.parentContainer.addLayer(this);
        this.setValue(this.value);

        this.ready = true;

        this.$nextTick(() => {
          this.$emit('ready', this.mapObject);
        });
      } else {
        throw new Error(noParent);
      }
    } else {
      throw new Error(noParent);
    }
  },
  beforeDestroy() {
    if (this.mapObject) {
      this.mapObject.off('markers');
      this.mapObject.off(this.$listeners);
      this.mapObject.clear();
      this.setMode(NONE);
      if (this.parentContainer) {
        this.parentContainer.removeLayer(this);
      }
    }
  },
  methods: {
    setValue(newPolygons: LatLng[][]) {
      if (!newPolygons) {
        this.lastSetPolygons = [];
        if (this.mapObject) {
          this.mapObject.clear();
        }
      } else if (!isEqual(newPolygons, this.lastSetPolygons)) {
        this.lastSetPolygons = newPolygons;
        if (this.mapObject) {
          this.mapObject.clear();
          newPolygons.forEach(
            (polygon) => this.mapObject && this.mapObject.create(polygon),
          );
        }
      }
    },
    markerHandler(event: MarkerEvent) {
      const newPolygons = event.latLngs;
      if (!isEqual(newPolygons, this.lastSetPolygons)) {
        this.$emit('input', event.latLngs);
        this.lastSetPolygons = event.latLngs;
      }
    },
    setMode(mode: number) {
      if (!validateMode(mode)) {
        throw new Error('Invalid mode');
      } else if (this.mapObject) {
        this.mapObject.mode(mode);
      }
    },
    setDebounce(value: boolean) {
      if (this.mapObject) {
        if (value) {
          this.mapObject.off('markers');
          const debouncedHandler = debounce(this.markerHandler, 100);
          this.mapObject.on('markers', debouncedHandler);
        } else {
          this.mapObject.off('markers');
          this.mapObject.on('markers', this.markerHandler);
        }
      }
    },
  },
});
</script>

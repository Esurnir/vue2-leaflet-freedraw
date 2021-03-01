<template>
  <div />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FreeDraw, {
  NONE,
  CREATE,
  EDIT,
  APPEND,
  EDIT_APPEND,
  DELETE,
  ALL,
} from 'leaflet-freedraw';
import type { FreeDrawOptions } from 'leaflet-freedraw';
import { findRealParent, propsBinder } from 'vue2-leaflet';
import { debounce, isEqual } from 'lodash-es';
import { DomEvent } from 'leaflet';
import type { LLayerGroup, LMap } from 'vue2-leaflet';
import type { LatLng } from 'leaflet';
import { MarkerEvent } from './typings';

function withNonReactive<TData>(data: TData) {
  return <TNonReactive extends unknown>() => data as TData & TNonReactive;
}

function validateMode(mode: number) {
  switch (mode) {
    case NONE:
      return true;
    case CREATE:
      return true;
    case DELETE:
      return true;
    case EDIT:
      return true;
    case APPEND:
      return true;
    case EDIT_APPEND:
      return true;
    case ALL:
      return true;
    default:
      return false;
  }
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

type EventMap = { [eventName: string]: DomEvent.EventHandlerFn };

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
      DomEvent.on(
        (this.mapObject as unknown) as HTMLElement,
        this.$listeners as EventMap,
      );
      propsBinder(this, this.mapObject, props);

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
      DomEvent.off(
        (this.mapObject as unknown) as HTMLElement,
        this.$listeners as EventMap,
      );
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
      this.$emit('input', event.latLngs);
      this.lastSetPolygons = event.latLngs;
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
  /* setup(setupProps, { parent, emit, listeners }) {
    const ready = ref(false);
    function calculateMode(active: boolean) {
      if (active) {
        return ALL;
      }
      return NONE;
    }

    const instance = getCurrentInstance();
    const mergedOptions = computed<Partial<FreeDrawOptions>>(() => {
      const option = {
        mode: calculateMode(setupProps.active),
      };
      if (instance) {
        return optionsMerger(option, instance.proxy);
      }
      return option;
    });

    const mapObject = markRaw(new FreeDraw(mergedOptions.value));

    let lastSetPolygons: LatLng[][] = [];
    function setActive(active: boolean) {
      if (mapObject) {
        mapObject.mode(calculateMode(active));
      }
    }
    function setPolygons(newPolygons: LatLng[][]) {
      if (!newPolygons) {
        lastSetPolygons = [];
        if (mapObject) {
          mapObject.clear();
        }
      } else if (!isEqual(newPolygons, lastSetPolygons)) {
        lastSetPolygons = newPolygons;
        if (mapObject) {
          mapObject.clear();
          newPolygons.forEach(
            (polygon) => mapObject && mapObject.create(polygon),
          );
        }
      }
    }

    function markerHandler(event: MarkerEvent) {
      emit('update:polygons', event.latLngs);
      lastSetPolygons = event.latLngs;
    }

    const debouncedHandler = debounce(markerHandler, 100);
    let parentContainer: LLayerGroup;

    onMounted(() => {
      if (instance && parent) {
        type propsType = Parameters<typeof propsBinder>;
        propsBinder(instance.proxy, mapObject, props);
        ready.value = true;
        parentContainer = findRealParent(parent);
        parentContainer.addLayer(instance.proxy);
        setPolygons(setupProps.polygons);
        mapObject.on('markers', debouncedHandler);
        DomEvent.on(
          (mapObject as unknown) as HTMLElement,
          listeners as eventMap,
        );
      }
    });

    onBeforeUnmount(() => {
      if (mapObject) {
        mapObject.off('markers');
        DomEvent.off(
          (mapObject as unknown) as HTMLElement,
          listeners as eventMap,
        );
        mapObject.clear();
        setActive(false);
        if (instance) {
          parentContainer.removeLayer(instance.proxy);
        }
      }
    });

    return {
      calculateMode,
      ready,
      mapObject,
      setPolygons,
      setActive,
    };
  }, */
});
</script>

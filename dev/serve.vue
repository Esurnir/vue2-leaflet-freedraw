<template>
  <div id="app">
    <l-map :center="initialCoordinates" :zoom="12">
      <l-control position="topleft">
        <button @click="flipActive">
          {{ isActive ? 'Deactivate' : 'Activate' }}
        </button>
      </l-control>
      <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <l-freedraw v-model="polygons" :mode="mode" @markers="markerHandler" />
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LControl } from 'vue2-leaflet';
import LFreedraw from '@/l-freedraw.vue';
import { ALL, MarkerEvent, NONE } from 'leaflet-freedraw';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    LFreedraw,
    LMap,
    LTileLayer,
    LControl,
  },
  data() {
    return {
      initialCoordinates: latLng(48.8566, 2.3522),
      isActive: false,
      polygons: [
        [
          { lat: 48.8936153614802, lng: 2.3085021972656254 },
          { lat: 48.82992159521573, lng: 2.4235153198242188 },
          { lat: 48.81703747481909, lng: 2.4114990234375004 },
          { lat: 48.81274203195294, lng: 2.4049758911132812 },
          { lat: 48.80595900439478, lng: 2.391929626464844 },
          { lat: 48.801436476249386, lng: 2.3775100708007817 },
          { lat: 48.796913540275355, lng: 2.353477478027344 },
          { lat: 48.794425751649555, lng: 2.328414916992188 },
          { lat: 48.796687382771, lng: 2.273483276367188 },
          { lat: 48.79804431250326, lng: 2.2659301757812504 },
          { lat: 48.80188874741608, lng: 2.251510620117188 },
          { lat: 48.807089572708925, lng: 2.2388076782226567 },
          { lat: 48.813194201165274, lng: 2.228507995605469 },
          { lat: 48.82178464137724, lng: 2.218894958496094 },
          { lat: 48.83353759505566, lng: 2.210311889648438 },
          { lat: 48.83873513761749, lng: 2.207908630371094 },
          { lat: 48.84709527021744, lng: 2.2058486938476567 },
          { lat: 48.86335963646483, lng: 2.207565307617188 },
          { lat: 48.87307055723444, lng: 2.2127151489257817 },
          { lat: 48.882102279983364, lng: 2.2223281860351567 },
          { lat: 48.88639177703194, lng: 2.229881286621094 },
          { lat: 48.892938194770835, lng: 2.248764038085938 },
          { lat: 48.895421094530306, lng: 2.267990112304688 },
          { lat: 48.8936153614802, lng: 2.3085021972656254 },
        ],
      ],
    };
  },
  computed: {
    mode(): number {
      return this.isActive ? ALL : NONE;
    },
  },
  watch: {
    polygons(newPolygons) {
      // Using v-model to watch polygons
      console.log(newPolygons);
    },
  },
  methods: {
    flipActive() {
      this.isActive = !this.isActive;
    },
    markerHandler(event: MarkerEvent) {
      // using the native markers event directly
      console.log(event);
    },
  },
});
</script>

<style>
@import url('~leaflet/dist/leaflet.css');
#app {
  position: absolute;
  height: 100%;
  width: 100%;
}
.map {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

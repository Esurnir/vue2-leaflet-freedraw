# Vue2-Leaflet-Freedraw

This is a [FreeDraw plugin](https://github.com/Wildhoney/Leaflet.FreeDraw/) for [Vue2-Leaflet](https://github.com/vue-leaflet/Vue2Leaflet)

## Install

```
npm install --save leaflet vue2-leaflet vue2-leaflet-freedraw
```

or with yarn:

```
yarn add leaflet vue2-leaflet vue2-leaflet-freedraw
```

## Demo

```
git clone https://github.com/Esurnir/vue2-leaflet-freedraw.git
cd vue2-leaflet-freedraw
yarn
yarn serve
```

The demo should compile and be visible from http://localhost:8080/
The source code of the demo is in the dev folder.

## Usage

### on &lt;template&gt; add

```html
<l-map :zoom="10" :center="center">
  <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
  <l-control position="topleft">
    <button @click="flipActive">
      {{ isActive ? 'Deactivate' : 'Activate' }}
    </button>
  </l-control>
  <l-freedraw v-model="polygons" :mode="mode" />
</l-map>
```

### on &lt;script&gt; add

```typescript
import LFreeDraw from 'vue2-leaflet-freedraw';
import { NONE, ALL } from 'leaflet-freedraw';
...
export default {
  components: {
    ...
    LFreeDraw
  },
  data() {
    return {
      ...
      polygons: [],
      isActive: false,
    }
  },
  computed: {
    mode() {
      return this.isActive ? ALL: NONE;
    }
  },
  methods: {
    flipActive() {
      this.isActive = !this.isActive;
    }
  }
}
```

## Access freedraw directly

If you need to access the freeDraw Object directly :
you can do it with a ref on the markercluster vue element and using the `mapObject` property

```html
...
<l-freedraw ref="freeDrawRef"> ... </l-freedraw>
...
```

```js
    ...
    this.$refs.freeDrawRef.mapObject.clear()
    ...
```

## Props

### Options

Accept all options from FreeDraw

### Mode

Accept a number corresponding to one of the valid modes of freeDraw:

```typescript
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
```

### value

The v-model property : Accept a LatLng[][]

### debounce

From my experience the rate events happened when drawing was a bit excessive, so I throttled the rythm of emitted event by default, setting this to :debounce="false" allow to bypass this settings (I don't remember why I coded it in the first place, there must have been a reason at one point). This might be removed later on if I find there's no use case for it.

## Author

Jean-Baptiste Zeller

## License

MIT

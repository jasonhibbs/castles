import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const mapStart = {
  zoom: 5.75,
  lat: 54.54333,
  lng: -1.92667,
  style: 'mapbox://styles/jasonhibbs/ckapkbzfh0fmw1instsyk4cph?fresh=true',
}

export default new Vuex.Store({
  state: {
    mapConfig: {
      accessToken:
        'pk.eyJ1IjoiamFzb25oaWJicyIsImEiOiJjajhvbXR4bzEwNWt3Mndta2F1YndoeWxtIn0.h6J1nO-0WLtT1crICzIlJg',
      styleUrl: mapStart.style,
      center: [mapStart.lng, mapStart.lat],
      zoom: mapStart.zoom,
    },
    mapView: {
      bounds: {
        west: 0,
        south: 0,
        east: 0,
        north: 0,
      },
      center: {
        lat: mapStart.lat,
        lng: mapStart.lng,
      },
      zoom: 14,
      bearing: 0,
    },
  },
  mutations: {},
  actions: {},
  modules: {},
})

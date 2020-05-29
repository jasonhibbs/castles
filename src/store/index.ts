import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const mapStart = {
  style: 'mapbox://styles/jasonhibbs/ckapkbzfh0fmw1instsyk4cph?fresh=true',
  center: {
    lat: 54, // 52, // 54.54333,
    lng: -1.59, // -2, // -1.92667,
  },
  context: {
    lat: 54.7476636,
    lng: -1.5904523,
  },
  zoom: 5.75,
}

export default new Vuex.Store({
  state: {
    mapConfig: {
      accessToken:
        'pk.eyJ1IjoiamFzb25oaWJicyIsImEiOiJjajhvbXR4bzEwNWt3Mndta2F1YndoeWxtIn0.h6J1nO-0WLtT1crICzIlJg',
      center: [mapStart.center.lng, mapStart.center.lat],
      styleUrl: mapStart.style,
      zoom: mapStart.zoom,
    },
    mapView: {
      bearing: 0,
      bounds: {
        west: 0,
        south: 0,
        east: 0,
        north: 0,
      },
      center: {
        lat: mapStart.center.lat,
        lng: mapStart.center.lng,
      },
      context: {
        lat: mapStart.context.lat,
        lng: mapStart.context.lng,
      },
      sheet: {
        stop: 'bottom',
        height: 0,
      },
      padding: {
        bottom: 0,
        left: 0,
      },
      zoom: 14,
    },
  },
  mutations: {
    updateContext(state, coords) {
      state.mapView.context = coords
    },
    updateSheet(state, sheet) {
      state.mapView.sheet = sheet
    },
    updatePadding(state, padding) {
      state.mapView.padding = padding
    },
  },
  actions: {
    sheetStopped(context, sheet) {
      const w = window.innerWidth
      if (w < 768) {
        context.commit('updatePadding', { bottom: sheet.height, left: 0 })
      }
      context.commit('updateSheet', sheet)
    },
  },
  modules: {},
})

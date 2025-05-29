import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSMXML from 'ol/format/OSMXML.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import {transformExtent} from 'ol/proj.js';
import VectorSource from 'ol/source/Vector.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import OSM from 'ol/source/OSM.js';

let map = null;

const styles = {
    'building': {
    '.*': new Style({
      zIndex: 100,
      stroke: new Stroke({
        color: 'rgba(246, 99, 79, 1.0)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(246, 99, 79, 0.3)',
      }),
    }),
  }
};

const vectorSource = new VectorSource({
  format: new OSMXML(),
  loader: function (extent, resolution, projection, success, failure) {
    const client = new XMLHttpRequest();
    client.open('POST', 'https://overpass-api.de/api/interpreter');
    client.addEventListener('load', function () {
      const features = new OSMXML().readFeatures(client.responseText, {
        featureProjection: map.getView().getProjection(),
      });
      vectorSource.addFeatures(features);
      success(features);
    });
    client.addEventListener('error', failure);
    const query = 'way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"Quang Huy NGUYEN"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso0"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso1"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso2"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso3"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso4"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso5"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso6"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso7"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso8"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso9"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso10"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso11"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso12"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso13"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso14"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso15"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso16"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso18"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso19"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso20"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso21"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso22"); out geom; way ["building"] (-12.84307,15.576751,-12.683729,15.768045) (newer:"2025-05-29T07:00:00Z") (user:"leopardo_silenzioso23"); out geom;';
    client.send(query);
  },
  strategy: bboxStrategy,
});

const vector = new VectorLayer({
  source: vectorSource,
  style: function (feature) {
    for (const key in styles) {
      const value = feature.get(key);
      if (value !== undefined) {
        for (const regexp in styles[key]) {
          if (new RegExp(regexp).test(value)) {
            return styles[key][regexp];
          }
        }
      }
    }
    return null;
  },
});

const basemap = new TileLayer({
  source: new OSM(),
})

map = new Map({
  layers: [basemap,vector],
  target: document.getElementById('map'),
  view: new View({
    projection: 'EPSG:4326',
    center: [15.672398000000001,-12.7633995],
    maxZoom: 19,
    zoom: 14,
  }),
});

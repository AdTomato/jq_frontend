import {
    renderer
} from '@cloudpivot/form';

import Vue from 'vue';
// import VueAMap from 'vue-amap';

let vueAMap : any;

export class DefaultLocationService implements renderer.LocationService {

    async initMap() {

        if (vueAMap) {
            return vueAMap;
        }

        vueAMap = await import(/* webpackChunkName: "vue-amap" */'vue-amap');

        Vue.use(vueAMap.default);

        vueAMap.initAMapApiLoader({
            key: 'de01827a5c46df0ffa956bc2d6b11ca0',
            plugin: ['Geocoder', 'AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Map'],
            // 默认高德 sdk 版本为 1.4.4
            v: '1.4.14',
            uiVersion: '1.0.11'
        });
        
        return vueAMap;
    }

    position(range?: number, showMap?: boolean): Promise<renderer.LocationPositionResult> {
        return Promise.resolve({} as any);
    }

    navigation(latitude: number, longitude: number, title: string): void {

    }

    isEl() : void {
        
    }
}

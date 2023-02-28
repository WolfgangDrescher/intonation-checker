import { defineStore } from 'pinia'

export const useMarkersStore = defineStore('markers', {
    state: () => {
        return {
            selectedMarkers: [],
            markers: [],
        };
    },
    actions: {
        addSelectedMarker(marker) {
            if (!this.selectedMarkers.find(m => m.noteIds.some(e => marker.noteIds.includes(e)))) {
                this.selectedMarkers.push(marker);
            }
        },
        removeSelectedMarker(id) {
            this.selectedMarkers = this.selectedMarkers.filter(m => m.id !== id);
        },
        setMarkers(markers) {
            this.markers = markers;
        },
    },
});

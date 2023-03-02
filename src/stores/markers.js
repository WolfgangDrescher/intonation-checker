import { defineStore } from 'pinia';

export const useMarkersStore = defineStore('markers', {
    state: () => {
        return {
            selectedMarkers: [],
            markers: [],
        };
    },
    getters: {
        markersNoteCount(state) {
            return state.markers.reduce((total, marker) => total + marker.noteIds.length, 0);
        },
        missingMarkers(state) {
            return state.markers.filter((marker) => {
                return !state.selectedMarkers.find(m => m.noteIds.some(id => marker.noteIds.includes(id)));
            });
        },
    },
    actions: {
        addSelectedMarker(marker) {
            if (!this.selectedMarkers.find((m) => m.noteIds.some((e) => marker.noteIds.includes(e)))) {
                this.selectedMarkers.push(marker);
            }
        },
        removeSelectedMarker(marker) {
            this.selectedMarkers = this.selectedMarkers.filter((m) => {
                if (typeof marker === 'string') {
                    return !m.noteIds.includes(marker);
                }
                if (Array.isArray(marker)) {
                    return !m.noteIds.some((id) => marker.includes(id));
                }
                if (typeof marker === 'object') {
                    return !m.noteIds.some((id) => marker.noteIds.includes(id));
                }
                return m.noteIds !== marker;
            });
        },
        setMarkers(markers) {
            this.markers = markers;
        },
        validateSelectedMarkers() {
            this.selectedMarkers.forEach((marker) => (marker.validated = true));
        },
        updateSelectedMarkers() {
            this.selectedMarkers.forEach((marker) => (marker.timestamp = Date.now()));
        },
    },
});

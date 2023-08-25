import { ref, computed } from 'vue';

export function useMarkersStore() {

    const selectedSliceMarkers = ref([]);
    const selectedMarkers = ref([]);
    const markers = ref([]);
    const mode = ref('slice');

    const markersNoteCount = computed(() => {
        return markers.value.reduce((total, marker) => total + marker.noteIds.length, 0);
    });

    const missingMarkers = computed(() => {
        return markers.value.filter((marker) => {
            return !selectedMarkers.value.find((m) => m.noteIds.some((id) => marker.noteIds.includes(id)));
        });
    });

    const sortedSelectedSliceMarkers = computed(() => {
        return selectedSliceMarkers.value.sort((a, b) => {
            return a.seekFactor - b.seekFactor;
        });
    });

    const sortedSelectedMarkers = computed(() => {
        return selectedMarkers.value.sort((a, b) => {
            return a.seekFactor - b.seekFactor;
        });
    });

    const countSelectedSliceMarkers = computed(() => selectedSliceMarkers.value.length);

    const countSelectedMarkers = computed(() => selectedMarkers.value.length);
        
    const countSelectedMarkersForMode = computed(() => mode.value === 'slice' ? countSelectedSliceMarkers.value : countSelectedMarkers.value);

    const countMarkers = computed(() => markers.value.length);

    const countMissingMarkers = computed(() => missingMarkers.value.length);

    function getSelectedMarkerById(id) {
        return selectedMarkers.value.find((m) => m.noteIds.includes(id));
    };

    function addSelectedSliceMarker(marker) {
        if (!selectedSliceMarkers.value.find((m) => m.simultaneousNoteIds.some((e) => marker.noteIds.includes(e)))) {
            selectedSliceMarkers.value.push(marker);
        }
    }

    function addSelectedMarker(marker) {
        if (!selectedMarkers.value.find((m) => m.noteIds.some((e) => marker.noteIds.includes(e)))) {
            selectedMarkers.value.push(marker);
        }
    }

    function removeSelectedSliceMarker(marker) {
        selectedSliceMarkers.value = selectedSliceMarkers.value.filter((m) => {
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
    }

    function removeSelectedMarker(marker) {
        selectedMarkers.value = selectedMarkers.value.filter((m) => {
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
    }

    function setMarkers(value) {
        markers.value = value;
    }

    function validateSelectedMarkers() {
        selectedMarkers.value.forEach((marker) => (marker.validated = true));
        selectedMarkers.value = selectedMarkers.value.reduce((accumulator, marker) => {
            const allIds = accumulator.reduce((ids, marker) => {
                ids.push(...marker.noteIds);
                return ids;
            }, []);
            const markerWithId = markers.value.find((m) => m.noteIds.some((id) => marker.noteIds.includes(id)));
            if (!allIds.some((id) => marker.noteIds.includes(id))) {
                accumulator.push(markerWithId ? markerWithId : marker);
            }
            return accumulator;
        }, []);
    }

    function validateSelectedSliceMarkers() {
        selectedSliceMarkers.value.forEach((marker) => (marker.validated = true));
        selectedSliceMarkers.value = selectedSliceMarkers.value.reduce((accumulator, marker) => {
            const foundMarker = markers.value.find(m => m.simultaneousNoteIds.some(id => marker.noteIds.includes(id)));
            if (foundMarker) {
                marker.simultaneousNoteIds = foundMarker.simultaneousNoteIds;
            }
            const foundAccMarker = accumulator.find((m) => m.simultaneousNoteIds.some((id) => marker.noteIds.includes(id)));
            if (!foundAccMarker) {
                accumulator.push(marker);
            }
            return accumulator;
        }, []);
    }

    function updateMarkers() {
        selectedSliceMarkers.value.forEach((marker) => (marker.timestamp = Date.now()));
        selectedMarkers.value.forEach((marker) => (marker.timestamp = Date.now()));
        markers.value.forEach((marker) => (marker.timestamp = Date.now()));
    }

    return {
        mode,
        selectedSliceMarkers,
        selectedMarkers,
        markers,
        markersNoteCount,
        missingMarkers,
        sortedSelectedSliceMarkers,
        sortedSelectedMarkers,
        countSelectedSliceMarkers,
        countSelectedMarkers,
        countSelectedMarkersForMode,
        countMarkers,
        countMissingMarkers,
        getSelectedMarkerById,
        addSelectedSliceMarker,
        addSelectedMarker,
        removeSelectedSliceMarker,
        removeSelectedMarker,
        setMarkers,
        validateSelectedMarkers,
        validateSelectedSliceMarkers,
        updateMarkers,
    };
}

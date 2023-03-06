import { ref, computed } from 'vue';

export function useMarkersStore() {

    const selectedMarkers = ref([]);
    const markers = ref([]);

    const markersNoteCount = computed(() => {
        return markers.value.reduce((total, marker) => total + marker.noteIds.length, 0);
    });

    const missingMarkers = computed(() => {
        return markers.value.filter((marker) => {
            return !selectedMarkers.value.find((m) => m.noteIds.some((id) => marker.noteIds.includes(id)));
        });
    });

    const sortedSelectedMarkers = computed(() => {
        return selectedMarkers.value.sort((a, b) => {
            return a.seekFactor - b.seekFactor;
        });
    });

    const countSelectedMarkers = computed(() => selectedMarkers.value.length);

    const countMarkers = computed(() => markers.value.length);

    const countMissingMarkers = computed(() => missingMarkers.value.length);

    function getSelectedMarkerById(id) {
        return selectedMarkers.value.find((m) => m.noteIds.includes(id));
    };

    function addSelectedMarker(marker) {
        if (!selectedMarkers.value.find((m) => m.noteIds.some((e) => marker.noteIds.includes(e)))) {
            selectedMarkers.value.push(marker);
        }
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
        console.log({value});
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

    function updateMarkers() {
        selectedMarkers.value.forEach((marker) => (marker.timestamp = Date.now()));
        markers.value.forEach((marker) => (marker.timestamp = Date.now()));
    }

    return {
        selectedMarkers,
        markers,
        markersNoteCount,
        missingMarkers,
        sortedSelectedMarkers,
        countSelectedMarkers,
        countMarkers,
        countMissingMarkers,
        getSelectedMarkerById,
        addSelectedMarker,
        removeSelectedMarker,
        setMarkers,
        validateSelectedMarkers,
        updateMarkers,
    };
}

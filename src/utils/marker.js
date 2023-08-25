let letterIndex = 0;

export class Marker {
    marker;
    correct = true;
    validated = true;
    simultaneousNoteIds = [];

    constructor(marker = {}, simultaneousNoteIds) {
        this.marker = marker;
        this.simultaneousNoteIds = simultaneousNoteIds;
        this.timestamp = Date.now();
    }

    get id() {
        return this.noteIds.join(',');
    }

    get noteIds() {
        return this.marker.noteIds;
    }

    get measure() {
        return this.marker.measure;
    }

    get comment() {
        return this.marker.comment;
    }

    get time() {
        return this.marker.time;
    }

    get isCorrect() {
        return this.correct;
    }
}

export class SelectedMarker extends Marker {
    correct;
    letterIndex;
    validated = false;

    constructor(marker, correct = null) {
        super(marker);
        this.correct = correct;
        this.letterIndex = ++letterIndex;
    }

    get readableId() {
        return String.fromCharCode(64 + this.letterIndex);
    }

    get seekFactor() {
        return this.marker.seekFactor;
    }
}

export class SelectedSliceMarker extends SelectedMarker {}


function checkIfSelectedMarkerIsCorrect(marker, markers, compareSlice) {
    return markers
        .reduce((accumulator, item) => {
            accumulator.push(...item.noteIds);
            if (compareSlice) {
                accumulator.push(...item.simultaneousNoteIds);
            }
            return accumulator;
        }, [])
        .some((id) => marker.noteIds.includes(id));
}

export function createSelectedMarker(marker, markers) {
    const isCorrect = checkIfSelectedMarkerIsCorrect(marker, markers, false);
    return new SelectedMarker(marker, isCorrect);
}

export function createSelectedSliceMarker(marker, markers) {
    const isCorrect = checkIfSelectedMarkerIsCorrect(marker, markers, true);
    return new SelectedSliceMarker(marker, isCorrect);
}

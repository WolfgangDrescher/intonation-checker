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

    getId(separator = '') {
        return this.noteIds.join(separator);
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
    readableId;
    validated = false;

    constructor(marker, correct = null, readableId, simultaneousNoteIds) {
        super(marker, simultaneousNoteIds);
        this.correct = correct;
        this.readableId = readableId;
    }

    get seekFactor() {
        return this.marker.seekFactor;
    }
}

export class SelectedSliceMarker extends SelectedMarker {}

export async function getSimultaneousNoteIds(toolkit, scoreIsReadyPromise, id) {
    await scoreIsReadyPromise;
    const elems = [];
    const time = await toolkit.getTimeForElement(id);
    elems.push(...(await toolkit.getElementsAtTime(time + 10)).notes);
    return [...new Set(elems)];
}

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

export function createSelectedMarker(marker, markers, readableId) {
    const isCorrect = checkIfSelectedMarkerIsCorrect(marker, markers, false);
    return new SelectedMarker(marker, isCorrect, readableId);
}

export function createSelectedSliceMarker(marker, markers, readableId, simultaneousNoteIds) {
    const isCorrect = checkIfSelectedMarkerIsCorrect(marker, markers, true);
    return new SelectedSliceMarker(marker, isCorrect, readableId, simultaneousNoteIds);
}

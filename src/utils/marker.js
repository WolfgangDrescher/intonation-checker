export class Marker {

    marker;
    correct;

    constructor(marker = {}) {
        this.marker = marker;
        this.timestamp = Date.now();
    }

    get id() {
        return this.noteIds.join();
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

    get time() {
        return this.marker.time;
    }

};

export class SelectedMarker extends Marker {

    correct;
    validated = false;

    constructor(marker, correct = null) {
        super(marker)
        this.correct = correct;
    }

    get seekFactor() {
        return this.marker.seekFactor;
    }

    get isCorrect() {
        return this.correct;
    }

};

export function createSelectedMarker(marker, markers) {
    const isCorrect = markers.reduce((accumulator, item) => {
        accumulator.push(...item.noteIds);
        return accumulator;
    }, []).some(id => marker.noteIds.includes(id));
    return new SelectedMarker(marker, isCorrect);
};

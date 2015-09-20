/**
 * @author Harri
 */

/**
 * Represents a halfEdge.
 * @constructor
 */
function PlanktonHalfEdge(start, face) {
    //think these are all ints..
    this.startVertex = start;
    this.adjacentFace = face;
    this.nextHalfEdge = -1;
    this.oppositeHalfEdge = -1;
}
/**
 * @author Harri
 */

/**
 * Represents a halfEdge.
 * @constructor
 */
function PlanktonHalfEdge(start, face, next) {
    //think these are all ints..
    this.startVertex = start;
    this.adjacentFace = face;
    this.nextHalfEdge = next;
}
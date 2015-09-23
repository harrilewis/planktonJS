/**
 * @author Harri
 */

/**
 * Represents a halfEdge.
 * @constructor
 */
function PlanktonHalfEdge(start, face, length) {
    this.startVertex = start;
    this.adjacentFace = face;
    this.nextHalfEdge = null;
    this.oppositeHalfEdge = null;
    this.index = length;
}
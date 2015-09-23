/**
 * @author Harri
 */

/**
 * Represents a face.
 * @constructor
 */
function PlanktonFace(edge, length) {
    this.firstHalfEdge = edge;
    this.index = length;
}
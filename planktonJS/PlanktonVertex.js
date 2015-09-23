/**
 * @author Harri
 */

/**
 * Represents a vertex.
 * @constructor
 */
function PlanktonVertex(x,y,z, length) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.index = length;

    this.halfEdge = null;
}

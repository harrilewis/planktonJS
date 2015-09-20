/**
 * @author Harri
 */

/**
 * Represents a vertex.
 * @constructor
 */
function PlanktonVertex(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;

    //could we simply not create this, wait until it is set and check for vertex.hasOwnProperty(halfEdge)?
    this.halfEdge = -1;
}

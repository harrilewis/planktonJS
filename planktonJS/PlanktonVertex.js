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

    //if the vertex is on the boundary this should also be a boundary edge - in particular the half edge on the boundary side..the first out going edge with out an adjacent face
    this.halfEdge = null;
}

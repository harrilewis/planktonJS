/**
 * @author Harri
 */

/**
 * Represents a mesh.
 * @constructor
 */
function PlanktonMesh() {
    //for now have them in here - to recreate plankton more closely perhaps create planktonFaceList etc object
    this.vertices = [];
    this.halfEdges = [];
    this.faces = [];
}

PlanktonMesh.prototype.addVertex  = function(x,y,z){
    var newVertex = new PlanktonVertex(x,y,x);
    this.vertices.push(newVertex);
    return newVertex;
};

PlanktonMesh.prototype.addEdgePair  = function(start, end, face){
    var firstEdge = new PlanktonHalfEdge(start, face);
    this.halfEdges.push(firstEdge);
    var secondEdge = new PlanktonHalfEdge(end,-1);
    this.halfEdges.push(secondEdge);
};

//this is where the action happens
PlanktonMesh.prototype.addFace  = function(){

};
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

PlanktonMesh.prototype.addHalfEdge  = function(){
    var newEdge = new PlanktonHalfEdge()
    this.halfEdges.push(new PlanktonHalfEdge())
};

//this is where the action happens
PlanktonMesh.prototype.addFace  = function(){

};
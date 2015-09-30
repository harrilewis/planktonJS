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
    var newVertex = new PlanktonVertex(x,y,x, this.vertices.length);
    this.vertices.push(newVertex);
    return newVertex;
};

PlanktonMesh.prototype.addEdgePair  = function(start, end, face){
    var firstEdge = new PlanktonHalfEdge(start, face, this.halfEdges.length);
    this.halfEdges.push(firstEdge);
    var secondEdge = new PlanktonHalfEdge(end, null, this.halfEdges.length);
    this.halfEdges.push(secondEdge);
    //should this return the edges?
};

PlanktonMesh.prototype.addFaceFromIndices = function(indices) {
    //TODO get the vertices and then call addFace
    //have a check in here to make sure vertices exist?
};

PlanktonMesh.prototype.addFace  = function(vertices){
    var n = vertices.length;

    // don't allow degenerate faces - must be at least a triangle..
    if (n < 3) {
        return -1;
    }

    // for each pair of vertices, check for an existing halfedge
    // if it exists, check that it doesn't already have a face
    // if it doesn't exist, mark for creation of a new halfedge pair
    var loop = [];
    var is_new = [];
    for (var i = 0; i < n; i++) {
        //iterate through each proposed edge
        var proposedEdge = this.findHalfedge(vertices[i], vertices[(i + 1) % n]);
        //could this cause a problem with undefined? if it is a new edge I think it will return undefined..
        if (proposedEdge.adjacentFace !== null) {
            //non-manifold therefore - for half edge there is only ever one edge with a certain sequence of vertices
            return -2;
        }
        loop.push(proposedEdge);
        //findHalfedge returned -1 if it was new
        //again need to check what is returned when an edge is compared to -1..
        is_new.push(proposedEdge === -1);
    }

    //create the face here.. so I can link it to an existing half edge below.
    var newFace = new PlanktonFace(loop[0],this.faces.length);
    this.faces.push(newFace);

    // now create any missing halfedge pairs...
    // (this could be done in the loop above but it avoids having to tidy up
    // any recently added halfedges should a non-manifold edge be found.)
    for (var i = 0; i < n; i++) {
        if (is_new[i]) { // new halfedge pair required
            var start = vertices[i];
            var end = vertices[(i + 1) % n];
            loop[i] = this.addEdgePair(start, end, newFace);
        } else {
            // Link existing halfedge to new face
            //this is where I need to have a reference to the created face!
            loop[i].adjacentFace = newFace;
        }
    }

    //by this point loop[] has all the edges (either exisitng or created..
    //carry on from here..

    // link all the halfedges
    for (var i = 0, ii = 1; i < n; i++, ii++, ii %= n) {
        // Link outer halfedges
        var outer_prev = -1, outer_next = -1;
        var id = 0;
        if (is_new[i]) {
            id += 1; // first is new
        }
        if (is_new[ii]) {
            id += 2; // second is new
        }

        switch(id)
        {
            case 1: // first is new, second is old
                // TODO: iterate through halfedges clockwise around end vertex until boundary
                outer_prev = mesh.halfedges[loop[ii]].prev;
                outer_next = getPairHalfedge(loop[i]);
                break;
            case 2: // second is new, first is old
                outer_prev = getPairHalfedge(loop[ii]);
                outer_next = mesh.halfedges[loop[i]].next;
                break;
            default: // (case 3) both are new
                outer_prev = getPairHalfedge(loop[ii]);
                outer_next = getPairHalfedge(loop[i]);
        }

        if (outer_prev > -1 && outer_next > -1)
        {
            mesh.halfedges[outer_prev].next = outer_next;
            mesh.halfedges[outer_next].prev = outer_prev;
        }

        // link inner halfedges
        mesh.halfedges[loop[i]].next = loop[ii];
        mesh.halfedges[loop[ii]].prev = loop[i];

        // ensure vertex->outgoing is boundary if vertex is boundary
        if (is_new[i]) { // first is new
            mesh.vertices[vertices[ii]].halfedge = loop[i] + 1;
        }
    }

    //should this return the face?
};

//function called in add face
//return the halfedge if it exists or -1 if not
//haven't tested this
PlanktonMesh.prototype.findHalfedge = function(start, end) {
    var edgesAroundThisVertex = getVertexHalfEdges(start);
    for (var i=0;i<edgesAroundThisVertex.length;i++)
    {
        if (end == edgesAroundThisVertex[i].oppositeHalfEdge.start)
            return edgesAroundThisVertex[i];
    }
    return -1;
};

PlanktonMesh.prototype.getVertexHalfEdges = function(vertex) {
    //TODO create circulator to return all halfedges around a vertex in an array
};

PlanktonMesh.prototype.getFaceHalfEdges = function(face){
    //TODO create circulator to return halfedges array
};

PlanktonMesh.prototype.getFaceVertices = function(face){
    //TODO create circulator to return vertices array
    //probably calls gethalfedges and then grabs the vertices?
};
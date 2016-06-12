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

/**
 * using p5.js to draw the mesh
 */
PlanktonMesh.prototype.draw2d = function() {
    for (var i = 0; i<this.vertices.length;i++) {
        point(this.vertices[i].x,this.vertices[i].y);
    }
};

/**
 * @method addVertex
 * @param {number} x  - the distance along the x-axis
 * @param {number} y  - the distance along the y-axis
 * @param {number} z  - the distance along the z-axis
 * @returns {PlanktonVertex} - the added vertex
 */
PlanktonMesh.prototype.addVertex  = function(x,y,z){
    var newVertex = new PlanktonVertex(x,y,z, this.vertices.length);
    this.vertices.push(newVertex);
    return newVertex;
};

PlanktonMesh.prototype.addEdgePair  = function(start, end, face){
    var firstEdge = new PlanktonHalfEdge(start, face, this.halfEdges.length);
    this.halfEdges.push(firstEdge);
    var secondEdge = new PlanktonHalfEdge(end, null, this.halfEdges.length);
    this.halfEdges.push(secondEdge);
    //set the opposites/pairs. They should always be the nest or previous in the edge list but nice to be able to get them directly
    firstEdge.oppositeHalfEdge = secondEdge;
    secondEdge.oppositeHalfEdge = firstEdge;
    //return an array containing the two edges
    return [firstEdge, secondEdge];
};

PlanktonMesh.prototype.addFaceFromIndices = function(indices) {
    //TODO get the vertices and then call addFace
    //have a check in here to make sure vertices exist?
};

PlanktonMesh.prototype.addFace  = function(vertices){

    //make sure something has been sent in
    if (vertices === undefined) {
        return -1;
    }

    var n = vertices.length;
    // don't allow degenerate faces - must be at least a triangle..
    if (n < 3) {
        return -2;
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
            return -3;
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

        //is this where you set the halfedge for the vertex? - think so.
        // ensure vertex->outgoing is boundary if vertex is boundary
        //see notes in planktonVertex - this must be the out going edge without a face yet..
        if (is_new[i]) { // first is new
            mesh.vertices[vertices[ii]].halfedge = loop[i] + 1;
        }
    }

    return newFace;
};

//function called in add face
//return the halfedge if it exists or -1 if not
PlanktonMesh.prototype.findHalfedge = function(start, end) {
    var edgesAroundThisVertex = this.getVertexHalfEdges(start);
    for (var i=0;i<edgesAroundThisVertex.length;i++)
    {
        if (end == edgesAroundThisVertex[i].oppositeHalfEdge.start)
            return edgesAroundThisVertex[i];
    }
    return -1;
};

//get all the outgoing halfedges from a vertex
//if the above way of setting the halfedge belonging to a vertex works then the vertex.halfedge should always be the outer boundary edge going out of the node
PlanktonMesh.prototype.getVertexHalfEdges = function(vertex) {
    var halfEdges =[];

    //check if there are no edges yet attached to this vertex
    if(vertex.halfedge === null) {
        return halfEdges;
    }

    //if there are loop round until you get back to the start or to a boundary
    var edge = vertex.halfedge;
    do {
        halfEdges.push(edge);
        edge = edge.oppositeHalfEdge.nextHalfEdge;
    } while (edge != vertex.halfedge || edge.oppositeHalfEdge.adjacentFace ===null);
    return halfEdges;
};

PlanktonMesh.prototype.circulateHalfEdge = function(startEdge) {
    var halfEdges = [];
    var edge = startEdge;
    do {
        halfEdges.push(edge);
        edge = edge.nextHalfEdge;
        if (edge == null) { throw "not a closed loop of edges"; }
    } while (edge !== startEdge);
    return halfEdges;
};

PlanktonMesh.prototype.getFaceHalfEdges = function(face){
    return this.circulateHalfEdge(face.firstHalfEdge);
};

PlanktonMesh.prototype.getFaceVertices = function(face){
    var halfEdges = this.circulateHalfEdge(face.firstHalfEdge);
    var vertices = [];
    //testing out forEach. Perhaps just use a for loop though more consistent.
    halfEdges.forEach(function(item) {
        vertices.push(item.startVertex);
    });
    return vertices;
};
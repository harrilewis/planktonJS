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

//lifted from pearswj/mesh.js
PlanktonMesh.prototype.addFace  = function(vertices){
    var n = vertices.length;

    // don't allow degenerate faces
    if (n < 3) {
        return -1;
    }

    // check that all vertex indices exist in this mesh
    //check this still makes sense - i will never be <0! confusion between indices and vertices..
    for (var i = 0; i < n; i++) {
        if (i < 0 || i >= mesh.vertices.length) {
            return -2;
        }
    }

    // for each pair of vertices, check for an existing halfedge
    // if it exists, check that it doesn't already have a face
    // if it doesn't exist, mark for creation of a new halfedge pair
    var loop = [];
    var is_new = [];
    for (var i = 0; i < n; i++) {
        var h = findHalfedge(vertices[i], vertices[(i + 1) % n]);
        if (h.adj >= 0) {
            return -3;
        }
        loop.push(h);
        is_new.push(h < 0);
    }

    // now create any missing halfedge pairs...
    // (this could be done in the loop above but it avoids having to tidy up
    // any recently added halfedges should a non-manifold edge be found.)
    for (var i = 0; i < n; i++) {
        //if (loop[i] < 0) { // new halfedge pair required
        if (is_new[i]) { // new halfedge pair required
            var start = vertices[i];
            var end = vertices[(i + 1) % n];
            loop[i] = addPair(start, end, mesh.faces.length);
        } else {
            // Link existing halfedge to new face
            mesh.halfedges[loop[i]].adj = mesh.faces.length;
        }
    }

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

    // finally, add the face
    mesh.faces.push({
        halfedge: loop[0]
    });

};
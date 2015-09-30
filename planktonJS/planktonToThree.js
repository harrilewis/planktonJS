/**
 * Created by Harri on 20/09/15.
 */


function convertPlanktonToThreeGeometry(planktonMesh) {
    var geometry = new THREE.Geometry();

    for (var i=0; i<planktonMesh.vertices.length;i++) {
        geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z));
    }

    for (var i=0; i<planktonMesh.faces.length; i++) {
        var vertices = planktonMesh.getFaceVertices(planktonMesh.faces[i]);
        //calculate the average of the vertices and make a triangle fan around it.
        //would be good to somehow maintain the vertex numbering and even face numbering from the planktonMesh..
    }
}
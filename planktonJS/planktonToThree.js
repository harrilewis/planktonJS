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
        //do some sort of triangle fan thing to make triangular faces.
    }
}
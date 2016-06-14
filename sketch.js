

var testMesh;

function setup() {
    createCanvas(400,200);
    stroke(255);
    strokeWeight(5);
    var verts = [];

    testMesh = new PlanktonMesh();
    verts.push(testMesh.addVertex(0,0,0));
    verts.push(testMesh.addVertex(10,10,0));
    verts.push(testMesh.addVertex(10,10,0));

    testMesh.addFace(verts);

    var vertsAgain = testMesh.getFaceVertices(testMesh.faces[0]);
}

function draw() {
    background(0);
    testMesh.draw2d();
}

function mousePressed() {
    if(mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) {
        testMesh.addVertex(mouseX,mouseY);
    }
    return false;
}


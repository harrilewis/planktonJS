

var testMesh;

function setup() {
    createCanvas(400,200);
    var verts = [];

    testMesh = new PlanktonMesh();
    verts.push(testMesh.addVertex(0,0,0));
    verts.push(testMesh.addVertex(10,10,0));
    verts.push(testMesh.addVertex(10,10,0));
    stroke(255);
    strokeWeight(5);
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


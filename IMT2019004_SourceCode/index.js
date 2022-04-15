import { Scene, WebGLRenderer, Shader, Camera, Shape } from './lib/threeD.js';
import { vertexShaderSrc } from './shaders/vertex.js';
import { fragmentShaderSrc } from './shaders/fragment.js';
import * as dat from 'https://cdn.skypack.dev/dat.gui';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import objLoader from 'https://cdn.skypack.dev/webgl-obj-loader';

const renderer = new WebGLRenderer();
let width = 730;
let height = 730;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
window.projMatrix = mat4.create();
mat4.perspective(window.projMatrix, 45 * Math.PI / 180, 1, 0.1, 1000);
const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();
let camera = new Camera();
const scene = new Scene(camera);
const transformSettings = { translateX: 0, translateY: 0, translateZ: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }
const userInterface = new dat.GUI();

async function getModelObject(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return new objLoader.Mesh(text);
}

let XaxisMesh = await getModelObject('./axes/x_axis.obj');
let x_axis = new Shape(XaxisMesh, [1, 0, 0, 1]);
let YaxisMesh = await getModelObject('./axes/y_axis.obj');
let y_axis = new Shape(YaxisMesh, [0, 1, 0, 1]);
let ZaxisMesh = await getModelObject('./axes/z_axis.obj');
let z_axis = new Shape(ZaxisMesh, [0, 0, 1, 1]);
let object1Mesh = await getModelObject('./objects/object1.obj');
let obj1 = new Shape(object1Mesh, [1, 0.062, 0.94, 1]);
let object2Mesh = await getModelObject('./objects/object2.obj');
let obj2 = new Shape(object2Mesh, [1, 0.647, 0, 1]);
let mesh_cube = await getModelObject('./objects/object3.obj');
let obj3 = new Shape(mesh_cube, [0.039, 0.796, 0.933, 1]);
let systemMode = 0;
let itemsList = new Array(3);
let eyeView3D = [0, 0, 0];
let ct = 0;
let gl = renderer.glContext();
let pixelColor = new Uint8Array(4);
let chosenShape = null;
let mouseX;
let mouseY;
let mouseTrack = false;
let isAnimated = false;
let clickingPoint;
let animationPoint1;
let animationPoint2;
let numberOfClicks = 0;
let mulFactor = 0;
let changeInSize = 0.005;

x_axis.transform.scale = [0.424, 0.3, 0.3];
y_axis.transform.scale = [0.3, 0.424, 0.3];
z_axis.transform.scale = [0.3, 0.3, 0.424];
x_axis.choose = false;
y_axis.choose = false;
z_axis.choose = false;
obj1.transform.scale = [0.3, 0.3, 0.3];
obj2.transform.scale = [0.3, 0.3, 0.3];
obj3.transform.scale = [0.3, 0.3, 0.3];
obj1.transform.translate = [0.7, 0.7, 0];
obj2.transform.translate = [-0.7, 0.7, 0];
obj3.transform.translate = [0.7, -0.7, 0];
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);
scene.add(obj1)
scene.add(obj2)
scene.add(obj3)

function animation() {
    renderer.clear(0.75, 0.75, 0.75, 1);
    renderer.render(scene, shader);
    objectAnimation();
}

function clipConvert(point) {
    let viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, window.projMatrix, camera.transform.viewMatrix);
    let inverseViewProjectionMatrix = mat4.create();
    mat4.invert(inverseViewProjectionMatrix, viewProjectionMatrix);
    let pointIn3Dimension = vec3.fromValues(point[0], point[1], 0.964);
    let worldCoordinates = vec3.create();
    vec3.transformMat4(worldCoordinates, pointIn3Dimension, inverseViewProjectionMatrix);
    return worldCoordinates;
}

function mouseConvert(mouse) {
    return clipConvert(renderer.mouseToClipCoord(mouse[0], mouse[1], 0));
}

function objectAnimation() {
    if (chosenShape == null || clickingPoint == null || animationPoint1 == null || animationPoint2 == null || !isAnimated)
        return;
    else if (isAnimated) {
        if (mulFactor < 1) {
            let ax = 2 * clickingPoint[0] + 2 * animationPoint2[0] - 4 * animationPoint1[0];
            let ay = 2 * clickingPoint[1] + 2 * animationPoint2[1] - 4 * animationPoint1[1];
            let az = 2 * clickingPoint[2] + 2 * animationPoint2[2] - 4 * animationPoint1[2];
            let bx = 4 * animationPoint1[0] - 3 * clickingPoint[0] - animationPoint2[0];
            let by = 4 * animationPoint1[1] - 3 * clickingPoint[1] - animationPoint2[1];
            let bz = 4 * animationPoint1[2] - 3 * clickingPoint[2] - animationPoint2[2];
            let cx = clickingPoint[0];
            let cy = clickingPoint[1];
            let cz = clickingPoint[2];
            let tempX = ax * mulFactor * mulFactor + bx * mulFactor + cx;
            let tempY = ay * mulFactor * mulFactor + by * mulFactor + cy;
            let tempZ = az * mulFactor * mulFactor + bz * mulFactor + cz;
            chosenShape.transform.translate[0] = tempX;
            chosenShape.transform.translate[1] = tempY;
            chosenShape.transform.translate[2] = tempZ;
            mulFactor += changeInSize;
        } else {
            mulFactor = 0;
            isAnimated = false;
            changeInSize = 0.005;
            chosenShape = null;
            clickingPoint = null;
            animationPoint1 = null;
            animationPoint2 = null;
        }
    }
}

itemsList[0] = userInterface.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function() {
    chosenShape.transform.translate = [transformSettings.translateX, chosenShape.transform.translate[1], chosenShape.transform.translate[2]];
});

itemsList[1] = userInterface.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function() {
    chosenShape.transform.translate = [chosenShape.transform.translate[0], transformSettings.translateY, chosenShape.transform.translate[2]];
});

itemsList[2] = userInterface.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function() {
    chosenShape.transform.translate = [chosenShape.transform.translate[0], chosenShape.transform.translate[1], transformSettings.translateZ];
});

itemsList[3] = userInterface.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function() {
    chosenShape.transform.rotationAngle_X = transformSettings.rotateX;
});

itemsList[4] = userInterface.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function() {
    chosenShape.transform.rotationAngle_Y = transformSettings.rotateY;
});

itemsList[5] = userInterface.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function() {
    chosenShape.transform.rotationAngle_Z = transformSettings.rotateZ;
});

document.addEventListener('keydown', function(event) {
    if (event.key == "m") {
        systemMode = (systemMode += 1) % 2
        if (systemMode == 0) {
            itemsList[0] = userInterface.add(transformSettings, 'translateX', -1, 1).step(0.01).onChange(function() {
                chosenShape.transform.translate = [transformSettings.translateX, chosenShape.transform.translate[1], chosenShape.transform.translate[2]];
            });
            itemsList[1] = userInterface.add(transformSettings, 'translateY', -1, 1).step(0.01).onChange(function() {
                chosenShape.transform.translate = [chosenShape.transform.translate[0], transformSettings.translateY, chosenShape.transform.translate[2]];
            });
            itemsList[2] = userInterface.add(transformSettings, 'translateZ', -1, 1).step(0.01).onChange(function() {
                chosenShape.transform.translate = [chosenShape.transform.translate[0], chosenShape.transform.translate[1], transformSettings.translateZ];
            });
            itemsList[3] = userInterface.add(transformSettings, 'rotateX', -Math.PI, Math.PI).step(0.01).onChange(function() {
                chosenShape.transform.rotationAngle_X = transformSettings.rotateX;
            });
            itemsList[4] = userInterface.add(transformSettings, 'rotateY', -Math.PI, Math.PI).step(0.01).onChange(function() {
                chosenShape.transform.rotationAngle_Y = transformSettings.rotateY;
            });
            itemsList[5] = userInterface.add(transformSettings, 'rotateZ', -Math.PI, Math.PI).step(0.01).onChange(function() {
                chosenShape.transform.rotationAngle_Z = transformSettings.rotateZ;
            });
            eyeView3D = camera.transform.eye;
            camera.transform.eye = [0, 0, 6];
            camera.transform.rotationAngle_X = 0;
            camera.transform.rotationAngle_Y = 0;
            camera.transform.rotationAngle_Z = 0;
            camera.transform.updateViewTransformMatrix();
        } else {
            for (let i = 0; i < 6; i++)
                userInterface.remove(itemsList[i]);
            if (ct == 0) {
                camera.transform.eye = [-5, 5, -5];
                ct = 1;
            } else {
                camera.transform.eye = eyeView3D;
                camera.transform.rotationAngle_X = 0;
                camera.transform.rotationAngle_Y = 0;
                camera.transform.rotationAngle_Z = 0;
            }
            camera.transform.updateViewTransformMatrix();
        }
    } else if (event.key == "+" && systemMode == 0)
        chosenShape.transform.scale = chosenShape.transform.scale.map(x => x * 1.1);
    else if (event.key == "-" && systemMode == 0)
        chosenShape.transform.scale = chosenShape.transform.scale.map(x => x / 1.1);
    else if (event.key == "a" && systemMode == 0) {
        if (isAnimated)
            isAnimated = false;
        else
            isAnimated = true;
    } else if (event.key == "ArrowDown" && isAnimated)
        changeInSize -= 0.0002;
    else if (event.key == "ArrowUp" && isAnimated)
        changeInSize += 0.0002;
}, false);

let mouseClickLocation;
renderer.getDomElement().addEventListener('mousedown', (event) => {
    if (systemMode == 0 && !isAnimated) {
        const rect = renderer.getDomElement().getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
        const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;
        renderer.render(scene, shader);
        gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelColor);
        let s = chosenShape;
        chosenShape = scene.selectShape(pixelColor);
        if (s != null)
            s.color = s.originalColor;
        if (chosenShape != null)
            chosenShape.color = [0, 0, 0, 1];
    } else if (systemMode == 0 && isAnimated) {
        if (numberOfClicks == 0) {
            numberOfClicks++;
            clickingPoint = [chosenShape.transform.translate[0], chosenShape.transform.translate[1], 0];
            animationPoint1 = mouseConvert([event.clientX, event.clientY]);
        } else if (numberOfClicks == 1) {
            numberOfClicks = 0;
            animationPoint2 = mouseConvert([event.clientX, event.clientY]);
        }
    } else if (systemMode == 1) {
        if (mouseTrack)
            mouseTrack = false;
        else
            mouseTrack = true;
        mouseClickLocation = event.clientX;
    }
});

renderer.getDomElement().addEventListener('mousemove', (event) => {
    if (mouseTrack && systemMode == 1) {
        camera.transform.rotationAngle_Y = -0.002 * (event.clientX - mouseClickLocation);
        camera.transform.updateViewTransformMatrix();
    }
});

renderer.setAnimationLoop(animation);
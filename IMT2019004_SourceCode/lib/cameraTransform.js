import { vec4, vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class CameraTransform {
    constructor() {
        this.eye = [0, 0, 6];
        this.up = [0, 1, 0];
        this.rotationAngle_X = 0;
        this.rotationAngle_Y = 0;
        this.rotationAngle_Z = 0;
        this.rotationAxis_X = vec3.create();
        vec3.set(this.rotationAxis_X, 1, 0, 0);
        this.rotationAxis_Y = vec3.create();
        vec3.set(this.rotationAxis_Y, 0, 1, 0);
        this.rotationAxis_Z = vec3.create();
        vec3.set(this.rotationAxis_Z, 0, 0, 1);
        this.viewMatrix = mat4.create();
        mat4.identity(this.viewMatrix);
        this.updateViewTransformMatrix();
    }

    updateViewTransformMatrix() {
        this.rotateCamera(this.rotationAxis_X, this.rotationAngle_X);
        this.rotateCamera(this.rotationAxis_Y, this.rotationAngle_Y);
        this.rotateCamera(this.rotationAxis_Z, this.rotationAngle_Z);
    }

    rotateCamera(rotationAxis, rotationAngle) {
        let temp = [this.eye[0], this.eye[1], this.eye[2], 1];
        let transfromMatrix = mat4.create();
        mat4.identity(transfromMatrix);
        mat4.rotate(transfromMatrix, transfromMatrix, rotationAngle, rotationAxis);
        vec4.transformMat4(temp, temp, transfromMatrix);
        this.eye = temp.slice(0, 3);
        temp = [this.up[0], this.up[1], this.up[2], 1];
        mat4.identity(transfromMatrix);
        mat4.rotate(transfromMatrix, transfromMatrix, rotationAngle, rotationAxis);
        vec4.transformMat4(temp, temp, transfromMatrix);
        this.up = temp.slice(0, 3);
        mat4.lookAt(this.viewMatrix, this.eye, [0, 0, 0], this.up);
    }
}
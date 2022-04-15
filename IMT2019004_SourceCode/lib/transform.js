import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform {
    constructor() {
        this.translate = vec3.create();
        vec3.set(this.translate, 0, 0, 0);
        this.scale = vec3.create();
        vec3.set(this.scale, 1, 1, 1);
        this.rotationAngle_X = 0;
        this.rotationAngle_Y = 0;
        this.rotationAngle_Z = 0;
        this.rotationAxis_X = vec3.create();
        vec3.set(this.rotationAxis_X, 1, 0, 0);
        this.rotationAxis_Y = vec3.create();
        vec3.set(this.rotationAxis_Y, 0, 1, 0);
        this.rotationAxis_Z = vec3.create();
        vec3.set(this.rotationAxis_Z, 0, 0, 1);
        this.modelTransformMatrix = mat4.create();
        mat4.identity(this.modelTransformMatrix);
        this.updateModelTransformMatrix();
    }

    updateModelTransformMatrix() {
        mat4.identity(this.modelTransformMatrix);
        mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
        mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle_X, this.rotationAxis_X);
        mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle_Y, this.rotationAxis_Y);
        mat4.rotate(this.modelTransformMatrix, this.modelTransformMatrix, this.rotationAngle_Z, this.rotationAxis_Z);
        mat4.scale(this.modelTransformMatrix, this.modelTransformMatrix, this.scale);
    }
}
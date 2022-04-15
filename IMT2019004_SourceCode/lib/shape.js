import { Transform } from './transform.js';


export class Shape {
    constructor(meshObj, color) {
        this.meshObj = meshObj;
        this.vertexPositions = new Float32Array(this.meshObj.vertices);
        this.indexData = new Uint16Array(this.meshObj.indices);
        this.choose = true;
        this.centerX = 0;
        this.centerY = 0;
        this.centerZ = 0;
        this.color = color;
        this.originalColor = color;
        this.transform = new Transform();
    }

    getCenterX() {
        this.centerX = this.transform.translate[0];
        return this.centerX;
    }

    getCenterY() {
        this.centerY = this.transform.translate[1];
        return this.centerY;
    }

    getCenterZ() {
        this.centerZ = this.transform.translate[2];
        return this.centerZ;
    }

    setCenterX(coordinates) {
        this.centerX = coordinates;
    }

    setCenterY(coordinates) {
        this.centerY = coordinates;
    }

    setCenterZ(coordinates) {
        this.centerZ = coordinates;
    }
}
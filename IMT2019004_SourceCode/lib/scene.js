export class Scene {
    constructor(camera) {
        this.camera = camera;
        this.primitives = []
    }

    add(primitive) {
        if (this.primitives && primitive)
            this.primitives.push(primitive);
    }

    selectShape(pixelColor) {
        let pixelCol = new Float32Array(pixelColor);
        let color = pixelCol.map(function(x) { return x / 255.0; })
        console.log("color = ", color);
        if (this.colorDiff([1, 1, 1, 1], color) < 0.002)
            return null;
        let selectedShape;
        for (let i = 0; i < this.primitives.length; i++) {
            if (!this.primitives[i].choose)
                continue;
            if (this.colorDiff(this.primitives[i].color, color) < 0.002)
                selectedShape = this.primitives[i];
        }
        return selectedShape;
    }

    colorDiff(color1, color2) {
        let length = 0;
        for (let i = 0; i < color1.length; i++)
            length += (color1[i] - color2[i]) * (color1[i] - color2[i]);
        return Math.sqrt(length);
    }
}
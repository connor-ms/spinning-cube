import Cube from "./cube";

interface Coord2D {
    x: number;
    y: number;
};

interface Coord3D {
    x: number;
    y: number;
    z: number;
};

export default class Renderer {
    private view_height: number;
    private view_width: number;

    constructor(width: number, height: number) {
        this.view_width = width;
        this.view_height = height;
    }

    public buildNextFrame(): string {
        let frame = "";
        let origin: Coord2D = { x: Math.round(this.view_width / 2), y: Math.round(this.view_height / 2) };

        console.log(origin);

        let vertices = [
            [0, 0], [1, 0],
            [1, 1], [0, 1]
        ];

        for (let y = 0; y < this.view_height; y++) {
            for (let x = 0; x < this.view_width; x++) {
                if (origin.x === x && origin.y === y)
                    frame += "x";
                else
                    frame += "-";
            }

            frame += "\n";
        }

        return frame;
    }
}
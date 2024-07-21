import Cube from "./cube";

export default class Renderer {
    private view_height: number;
    private view_width: number;

    constructor(width: number, height: number) {
        this.view_width = width;
        this.view_height = height;
    }

    public buildNextFrame(): string {
        let frame = "";
        let origin = [this.view_width / 2, this.view_height / 2];

        let vertices = [
            [0, 0], [1, 0],
            [1, 1], [0, 1]
        ];

        for (let i = 0; i < this.view_width; i++) {
            for (let j = 0; j < this.view_height; j++) {
                if (origin[])
                    frame += " ";
            }
        }

        return frame;
    }
}
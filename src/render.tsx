class Vertex {
    constructor(public x: number, public y: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
}

class Triangle {
    constructor(public v0: Vertex, public v1: Vertex, public v2: Vertex, public char: string) { }

    origin() {
        return new Vertex((this.v0.x + this.v1.x + this.v2.x) / 3, (this.v0.y + this.v1.y + this.v2.y) / 3);
    }

    rotate(angle: number, origin: Vertex = this.origin()): Triangle {
        const v0 = this.rotateVertex(this.v0, angle, origin);
        const v1 = this.rotateVertex(this.v1, angle, origin);
        const v2 = this.rotateVertex(this.v2, angle, origin);
        return new Triangle(v0, v1, v2, this.char);
    }

    private rotateVertex(vertex: Vertex, angle: number, origin: Vertex = new Vertex(0, 0)): Vertex {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const translatedX = vertex.x - origin.x;
        const translatedY = vertex.y - origin.y;

        const rotatedX = translatedX * cos - translatedY * sin;
        const rotatedY = translatedX * sin + translatedY * cos;

        return new Vertex(rotatedX + origin.x, rotatedY + origin.y);
    }
}

export default class Renderer {
    private view_height: number;
    private view_width: number;
    private frame: number;

    constructor(width: number, height: number) {
        this.view_width = width;
        this.view_height = height;
        this.frame = 0;
    }

    private frameAsDegrees() {
        return this.frame % 360;
    }

    private frameAsRadians() {
        return this.frameAsDegrees() * Math.PI / 180;
    }

    private createGrid(width: number, height: number): string[][] {
        const grid: string[][] = [];
        for (let y = 0; y < height; y++) {
            const row: string[] = [];
            for (let x = 0; x < width; x++) {
                row.push(' ');
            }
            grid.push(row);
        }
        return grid;
    }

    private gridToString(grid: string[][]): string {
        return grid.map(row => row.join('')).join('\n');
    }

    public buildNextFrame(step: number): string {
        let grid = this.createGrid(this.view_width, this.view_height);

        /* To render multiple elements:*/

        const triangles: Triangle[] = [
            new Triangle(new Vertex(10, 5), new Vertex(20, 15), new Vertex(10, 15), "-"),
            new Triangle(new Vertex(10, 5), new Vertex(20, 5), new Vertex(20, 15), "_"),
        ];

        for (const triangle of triangles) {
            let origin = new Vertex(15, 10);
            this.rasterizeTriangle(triangle.rotate(this.frameAsDegrees(), origin), grid, triangle.char);
        }

        //let triangle = new Triangle(new Vertex(10, 5), new Vertex(20, 15), new Vertex(5, 15), "0");

        //this.rasterizeTriangle(triangle.rotate(this.frameAsDegrees()), grid, triangle.char);

        this.frame += step;

        return this.gridToString(grid);
    }

    private rasterizeTriangle(triangle: Triangle, grid: string[][], char: string): void {
        const { v0, v1, v2 } = triangle;
        const minX = Math.min(v0.x, v1.x, v2.x);
        const maxX = Math.max(v0.x, v1.x, v2.x);
        const minY = Math.min(v0.y, v1.y, v2.y);
        const maxY = Math.max(v0.y, v1.y, v2.y);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const p = new Vertex(x, y);
                const w0 = this.edgeFunction(v1, v2, p);
                const w1 = this.edgeFunction(v2, v0, p);
                const w2 = this.edgeFunction(v0, v1, p);
                if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                    grid[Math.round(y)][Math.round(x)] = char;

                    if (Math.round(x) === v0.x && Math.round(y) === v0.y) {
                        grid[Math.round(y)][Math.round(x)] = "0";
                    }
                    if (Math.round(x) === v1.x && Math.round(y) === v1.y) {
                        grid[Math.round(y)][Math.round(x)] = "1";
                    }
                    if (Math.round(x) === v2.x && Math.round(y) === v2.y) {
                        grid[Math.round(y)][Math.round(x)] = "2";
                    }
                }
            }
        }

        grid[triangle.origin().y][triangle.origin().x] = "X";
    }

    private edgeFunction(a: Vertex, b: Vertex, c: Vertex): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }
}
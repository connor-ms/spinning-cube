import Cube from "./cube";

class Vertex {
    constructor(public x: number, public y: number) { }
}

class Triangle {
    constructor(public v0: Vertex, public v1: Vertex, public v2: Vertex) { }
}

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

    public buildNextFrame(): string {
        let grid = this.createGrid(this.view_width, this.view_height);
        let frame = "";
        /*let origin: Coord2D = { x: Math.round(this.view_width / 2), y: Math.round(this.view_height / 2) };

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
        }*/

        const triangles: Triangle[] = [
            new Triangle(new Vertex(10, 5), new Vertex(20, 15), new Vertex(5, 15)),
            new Triangle(new Vertex(30, 10), new Vertex(40, 20), new Vertex(25, 20)),
            // Add more triangles as needed
        ];

        for (const triangle of triangles) {
            this.rasterizeTriangle(triangle, grid, "#");
        }

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
                    grid[y][x] = char;
                }
            }
        }
    }

    private edgeFunction(a: Vertex, b: Vertex, c: Vertex): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }
}
class Vertex {
    constructor(public x: number, public y: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
}

class Vertex3D {
    constructor(public x: number, public y: number, public z: number) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.z = Math.round(z);
    }

    to2D(camera: Vertex3D) {
        let temp: Vertex = new Vertex(0, 0);
        let f = this.z - camera.z;

        temp.x = (this.x - camera.x) * (f / this.z) + camera.x;
        temp.y = (this.y - camera.y) * (f / this.z) + camera.y;

        return temp;
    }
}

class Triangle {
    constructor(public v0: Vertex, public v1: Vertex, public v2: Vertex, public char: string) { }

    origin() {
        return new Vertex((this.v0.x + this.v1.x + this.v2.x) / 3, (this.v0.y + this.v1.y + this.v2.y) / 3);
    }

    rotate(angle: number, origin: Vertex = this.origin()) {
        this.v0 = this.rotateVertex(this.v0, angle, origin);
        this.v1 = this.rotateVertex(this.v1, angle, origin);
        this.v2 = this.rotateVertex(this.v2, angle, origin);
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

class Triangle3D {
    constructor(public v0: Vertex3D, public v1: Vertex3D, public v2: Vertex3D, public char: string) { }

    to2D(camera: Vertex3D) {
        let temp1 = this.v0.to2D(camera);
        let temp2 = this.v1.to2D(camera);
        let temp3 = this.v2.to2D(camera);

        return new Triangle(temp1, temp2, temp3, this.char);
    }

    origin() {
        return new Vertex3D(
            (this.v0.x + this.v1.x + this.v2.x) / 3,
            (this.v0.y + this.v1.y + this.v2.y) / 3,
            (this.v0.z + this.v1.z + this.v2.z) / 3,
        );
    }

    rotate(angle: number, origin: Vertex3D = this.origin()) {
        this.v0 = this.rotateVertex(this.v0, angle, origin);
        this.v1 = this.rotateVertex(this.v1, angle, origin);
        this.v2 = this.rotateVertex(this.v2, angle, origin);
    }

    private rotateVertex(vertex: Vertex, angle: number, origin: Vertex3D = new Vertex3D(0, 0, 0)): Vertex3D {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const translatedX = vertex.x - origin.x;
        const translatedY = vertex.y - origin.y;

        const rotatedX = translatedX * cos - translatedY * sin;
        const rotatedY = translatedX * sin + translatedY * cos;

        //return new Vertex(rotatedX + origin.x, rotatedY + origin.y);
        return new Vertex3D(0, 0, 0);
    }
}

class Square {
    public triangles: Triangle[];

    constructor(public length: number, public origin: Vertex) {
        this.length = Math.round(length);
        this.triangles = [
            new Triangle(
                new Vertex(this.origin.x - length, this.origin.y - length),
                new Vertex(this.origin.x + length, this.origin.y + length),
                new Vertex(this.origin.x - length, this.origin.y + length),
                "+"
            ),
            new Triangle(
                new Vertex(this.origin.x - length, this.origin.y - length),
                new Vertex(this.origin.x + length, this.origin.y - length),
                new Vertex(this.origin.x + length, this.origin.y + length),
                "-"
            ),
        ];
    }

    public rotate2D(degrees: number) {
        for (let triangle of this.triangles)
            triangle.rotate(degrees, this.origin);
    }
}

class Square3D {
    public triangles: Triangle3D[];

    constructor(public length: number, public origin: Vertex) {
        this.length = Math.round(length);
        this.triangles = [
            new Triangle3D(
                new Vertex3D(this.origin.x - length, this.origin.y - length, 0),
                new Vertex3D(this.origin.x + length, this.origin.y + length, 0),
                new Vertex3D(this.origin.x - length, this.origin.y + length, 0),
                "+"
            ),
            new Triangle3D(
                new Vertex3D(this.origin.x - length, this.origin.y - length, 0),
                new Vertex3D(this.origin.x + length, this.origin.y - length, 0),
                new Vertex3D(this.origin.x + length, this.origin.y + length, 0),
                "-"
            ),
        ];
    }

    // public rotate2D(degrees: number) {
    //     for (let triangle of this.triangles)
    //         triangle.rotate(degrees, this.origin);
    // }
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

        const square = new Square(10, new Vertex(this.view_width / 2, this.view_height / 2 - 1));

        square.rotate2D(this.frameAsDegrees());

        for (const triangle of square.triangles) {
            this.rasterizeTriangle(triangle, grid, triangle.char);
        }

        // const square = new Square3D(10, new Vertex(this.view_width / 2, this.view_height / 2 - 1));

        // //square.rotate2D(this.frameAsDegrees());
        // let camera = new Vertex3D(0, 0, 0);

        // for (const triangle of square.triangles) {
        //     this.rasterizeTriangle(triangle.to2D(camera), grid, triangle.char);
        // }

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
                    let tempY = Math.round(y);
                    let tempX = Math.round(x);

                    if (grid[tempY] && grid[tempY][tempX]) {
                        grid[tempY][tempX] = char;

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
        }

        grid[triangle.origin().y][triangle.origin().x] = "X";
    }

    private edgeFunction(a: Vertex, b: Vertex, c: Vertex): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }
}
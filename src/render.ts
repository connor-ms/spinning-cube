import { Settings } from "./components/Settings";
import { Vec2, Vec4 } from "./util/vector";
import Mat4x4 from "./util/matrix";

export class Triangle {
    constructor(public v0: Vec4 = new Vec4(), public v1: Vec4 = new Vec4(), public v2: Vec4 = new Vec4()) {}

    toMatrix() {
        return new Mat4x4([
            [this.v0.x, this.v1.x, this.v2.x, 0],
            [this.v0.y, this.v1.y, this.v2.y, 0],
            [this.v0.z, this.v1.z, this.v2.z, 0],
            [this.v0.w, this.v1.w, this.v2.w, 1],
        ]);
    }
}

class Mesh {
    public triangles: Triangle[];
    public origin: Vec4;

    constructor(x: number, y: number, z: number) {
        this.triangles = [
            // Front face
            new Triangle(new Vec4(-0.5, -0.5, 0.5), new Vec4(0.5, -0.5, 0.5), new Vec4(0.5, 0.5, 0.5)),
            new Triangle(new Vec4(-0.5, -0.5, 0.5), new Vec4(0.5, 0.5, 0.5), new Vec4(-0.5, 0.5, 0.5)),

            // Back face
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(0.5, 0.5, -0.5), new Vec4(0.5, -0.5, -0.5)),
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(-0.5, 0.5, -0.5), new Vec4(0.5, 0.5, -0.5)),

            // Top face
            new Triangle(new Vec4(-0.5, 0.5, -0.5), new Vec4(-0.5, 0.5, 0.5), new Vec4(0.5, 0.5, 0.5)),
            new Triangle(new Vec4(-0.5, 0.5, -0.5), new Vec4(0.5, 0.5, 0.5), new Vec4(0.5, 0.5, -0.5)),

            // Bottom face
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(0.5, -0.5, 0.5), new Vec4(-0.5, -0.5, 0.5)),
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(0.5, -0.5, -0.5), new Vec4(0.5, -0.5, 0.5)),

            // Right face
            new Triangle(new Vec4(0.5, -0.5, -0.5), new Vec4(0.5, 0.5, 0.5), new Vec4(0.5, -0.5, 0.5)),
            new Triangle(new Vec4(0.5, -0.5, -0.5), new Vec4(0.5, 0.5, -0.5), new Vec4(0.5, 0.5, 0.5)),

            // Left face
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(-0.5, -0.5, 0.5), new Vec4(-0.5, 0.5, 0.5)),
            new Triangle(new Vec4(-0.5, -0.5, -0.5), new Vec4(-0.5, 0.5, 0.5), new Vec4(-0.5, 0.5, -0.5)),
        ];

        this.origin = new Vec4(x, y, z);
    }
}

export function toRad(angle: number) {
    return ((angle % 360) * Math.PI) / 180;
}

export default class Renderer {
    public curFrame: string;
    public projMatrix: Mat4x4;
    public cubeRotation: Vec4;
    public camera: Vec4;
    public settings: Settings;
    private luminance: string;

    constructor() {
        this.curFrame = "";

        // default settings
        this.settings = {
            viewSize: new Vec2(84, 84),
            fontSize: 10,
            paused: false,
            step: new Vec4(1, 1, 1),
            rotationSpeed: 5,
            frametime: 15,
            distance: 5,
            execTime: 0,
        };

        let near = 0.1;
        let far = 1000;
        let fov = 90;
        let aspectRatio = this.settings.viewSize.x / this.settings.viewSize.y;
        let fovRad = 1.0 / Math.tan(((fov * 0.5) / 180) * Math.PI);

        this.projMatrix = new Mat4x4([
            [aspectRatio * fovRad, 0, 0, 0],
            [0, fovRad, 0, 0],
            [0, 0, -(far / (far - near)), -1],
            [0, 0, -(far / (far - near)), 0],
        ]);

        this.cubeRotation = new Vec4();
        this.camera = new Vec4();

        this.luminance = "`.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";
    }

    changeResolution(step: number) {
        this.settings.fontSize += step;

        if (this.settings.fontSize === 0) this.settings.fontSize = 1;

        // Trial and error came to the conclusion that 1.68 was the best multiplier. No idea why...
        this.settings.viewSize.x = Math.ceil((500 / this.settings.fontSize) * 1.68);
        this.settings.viewSize.y = Math.ceil((500 / this.settings.fontSize) * 1.68);
    }

    buildNextFrame() {
        let startTime = performance.now();
        let grid = this.createGrid(this.settings.viewSize.x, this.settings.viewSize.y);

        if (!this.settings.paused) {
            this.cubeRotation.addAndWrap(this.settings.step);
        }

        let world = Mat4x4.makeIdentity();

        world = world.multiply(Mat4x4.makeRotX(this.cubeRotation.x));
        world = world.multiply(Mat4x4.makeRotY(this.cubeRotation.y));
        world = world.multiply(Mat4x4.makeRotZ(this.cubeRotation.z));

        let meshes = new Array<Mesh>();

        meshes.push(new Mesh(0, 0, 0));
        //meshes.push(new Mesh(0, 0, 3));

        for (let mesh of meshes) {
            let translate = Mat4x4.makeTranslation(mesh.origin.x, mesh.origin.y, mesh.origin.z + this.settings.distance);

            for (let i = 0; i < mesh.triangles.length; i++) {
                let triangle = mesh.triangles[i].toMatrix();

                triangle = world.multiply(triangle);
                triangle = translate.multiply(triangle);
                triangle = this.projMatrix.multiply(triangle);

                triangle.scaleRow(0);
                triangle.scaleRow(1);
                triangle.scaleRow(2);

                triangle.values[0][0] = ((triangle.values[0][0] + 1) * this.settings.viewSize.x) / 2;
                triangle.values[1][0] = ((triangle.values[1][0] + 1) * this.settings.viewSize.x) / 2;
                triangle.values[0][1] = ((triangle.values[0][1] + 1) * this.settings.viewSize.x) / 2;
                triangle.values[1][1] = ((triangle.values[1][1] + 1) * this.settings.viewSize.x) / 2;
                triangle.values[0][2] = ((triangle.values[0][2] + 1) * this.settings.viewSize.x) / 2;
                triangle.values[1][2] = ((triangle.values[1][2] + 1) * this.settings.viewSize.x) / 2;

                let char: string;

                if (i === 0 || i === 1) char = "M";
                else if (i === 2 || i === 3) char = "*";
                else if (i === 4 || i === 5) char = "W";
                else if (i === 6 || i === 7) char = "-";
                else if (i === 8 || i === 9) char = "_";
                else char = "6";

                this.rasterizeTriangle(triangle.toTriangle(), grid, char);
            }

            this.curFrame = this.gridToString(grid);
            this.settings.execTime = performance.now() - startTime;
        }
    }

    private createGrid(width: number, height: number): string[][] {
        const grid: string[][] = [];
        for (let y = 0; y < height; y++) {
            const row: string[] = [];
            for (let x = 0; x < width; x++) {
                row.push(" ");
            }
            grid.push(row);
        }
        return grid;
    }

    private gridToString(grid: string[][]): string {
        return grid.map((row) => row.join("")).join("\n");
    }

    private rasterizeTriangle(triangle: Triangle, grid: string[][], char: string): void {
        let min = new Vec2(
            Math.max(0, Math.floor(Math.min(triangle.v0.x, triangle.v1.x, triangle.v2.x))),
            Math.max(0, Math.floor(Math.min(triangle.v0.y, triangle.v1.y, triangle.v2.y)))
        );

        let max = new Vec2(
            Math.min(this.settings.viewSize.x - 1, Math.ceil(Math.max(triangle.v0.x, triangle.v1.x, triangle.v2.x))),
            Math.min(this.settings.viewSize.y - 1, Math.ceil(Math.max(triangle.v0.y, triangle.v1.y, triangle.v2.y)))
        );

        for (let y = min.y; y <= max.y; y++) {
            for (let x = min.x; x <= max.x; x++) {
                const p = new Vec2(x + 0.5, y + 0.5);
                const w0 = this.edgeFunction(triangle.v1, triangle.v2, p);
                const w1 = this.edgeFunction(triangle.v2, triangle.v0, p);
                const w2 = this.edgeFunction(triangle.v0, triangle.v1, p);

                if (w0 <= 0 && w1 <= 0 && w2 <= 0) {
                    if (grid[y] && grid[y][x]) {
                        grid[y][x] = char;
                    }
                }
            }
        }
    }

    edgeFunction(a: Vec2, b: Vec2, c: Vec2): number {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    }
}

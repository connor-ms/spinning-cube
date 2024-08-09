import { Vec2, Vec3 } from '../util/vector';
import { useRenderer } from './RenderContext';
import "./Settings.css"

export interface Settings {
    viewSize: Vec2;
    fontSize: number;
    paused: boolean;
    step: Vec3;
    rotationSpeed: number;
    frametime: number;
    distance: number;

    execTime: number;
}

export default function SettingsPanel() {
    const { renderer } = useRenderer();

    return (
        <div className="Settings">

            {renderer.settings.execTime}ms <br />

            Resolution: {Math.ceil(renderer.settings.viewSize.x)}x{Math.ceil(renderer.settings.viewSize.y)}<br></br>
            <button onClick={() => { renderer.changeResolution(1) }}>-</button>
            <button onClick={() => { renderer.changeResolution(-1) }} disabled={renderer.settings.fontSize === 1}>+</button>
            <br />

            X: <input type="range" min="0" max="360" value={renderer.cubeRotation.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.x = Number.parseInt(event.target.value) }} />
            <label className="range-value">({renderer.cubeRotation.x}°)</label>
            <br />
            Step: <input type="number" value={renderer.settings.step.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.settings.step.x = Number.parseFloat(event.target.value); }} />
            <br />

            Y: <input type="range" min="0" max="360" value={renderer.cubeRotation.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.y = Number.parseInt(event.target.value) }} />
            <label className="range-value">({renderer.cubeRotation.y}°)</label>
            <br />
            Step:<input type="number" value={renderer.settings.step.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.settings.step.y = Number.parseFloat(event.target.value) }} />
            <br />

            Z: <input type="range" min="0" max="360" value={renderer.cubeRotation.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.z = Number.parseInt(event.target.value) }} />
            <label className="range-value">({renderer.cubeRotation.z}°)</label>
            <br />
            Step:<input type="number" value={renderer.settings.step.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.settings.step.z = Number.parseFloat(event.target.value) }} />
            <br />
            <br />
            {/* distance: <input type="range" min="1" max="10" step="0.1" value={renderer.settings.distance} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleUpdateSettings({ distance: Number.parseFloat(event.target.value) }) }} /> */}
            <button onClick={() => { renderer.settings.paused = !renderer.settings.paused }}>{
                renderer.settings.paused ? "Unpause" : "Pause"
            }</button>
        </div>
    );
};
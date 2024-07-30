import { Vec3 } from '../render';
import { useRenderer } from './RenderContext';

export interface Settings {
    paused: boolean;
    step: Vec3;
    rotationSpeed: number;
    frametime: number;
    distance: number;
}

export default function SettingsPanel() {
    const { renderer, setSettings } = useRenderer();

    const handleUpdateSettings = (newSettings: { [key: string]: any }) => {
        renderer.updateSettings(newSettings);
        setSettings({ ...renderer.settings });
    };

    return (
        <div className="Settings">
            X: <input type="range" min="0" max="360" value={renderer.cubeRotation.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.x = Number.parseInt(event.target.value) }} />
            <input type="number" value={renderer.settings.step.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                let val = Number.parseFloat(event.target.value);

                if (val === null) val = 0;

                renderer.settings.step.x = Number.parseFloat(event.target.value)
            }} />
            Y: <input type="range" min="0" max="360" value={renderer.cubeRotation.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.y = Number.parseInt(event.target.value) }} />
            <input type="number" value={renderer.settings.step.y} />
            Z: <input type="range" min="0" max="360" value={renderer.cubeRotation.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.z = Number.parseInt(event.target.value) }} />
            <input type="number" value={renderer.settings.step.z} />
            <br />

            distance: <input type="range" min="1" max="10" step="0.1" value={renderer.settings.distance} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleUpdateSettings({ distance: Number.parseFloat(event.target.value) }) }} />

            <button onClick={() => handleUpdateSettings({ paused: !renderer.settings.paused })}>{
                renderer.settings.paused ? "Unpause" : "Pause"
            }</button>
        </div>
    );
};
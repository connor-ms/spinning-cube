import { Vec3 } from '../render';
import { useRenderer } from './RenderContext';

export interface Settings {
    paused: boolean;
    step: Vec3;
    rotationSpeed: number;
    frametime: number;
    delta: number;
}

export default function SettingsPanel() {
    const { renderer, setSettings } = useRenderer();

    const handleUpdateSettings = (newSettings: { [key: string]: any }) => {
        renderer.updateSettings(newSettings);
        setSettings({ ...renderer.settings });
    };

    return (
        <div className="Settings">
            <input type="range" min="0" max="360" value={renderer.cubeRotation.x} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.x = Number.parseInt(event.target.value) }} />
            <input type="range" min="0" max="360" value={renderer.cubeRotation.y} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.y = Number.parseInt(event.target.value) }} />
            <input type="range" min="0" max="360" value={renderer.cubeRotation.z} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { renderer.cubeRotation.z = Number.parseInt(event.target.value) }} />

            <br />

            <button onClick={() => handleUpdateSettings({ paused: !renderer.settings.paused })}>{
                renderer.settings.paused ? "Unpause" : "Pause"
            }</button>
        </div>
    );
};
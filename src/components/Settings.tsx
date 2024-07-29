import React from 'react';
import { useRenderer } from './RenderContext';

export interface Settings {
    paused: boolean;
    thetaX: number;
    thetaY: number;
    thetaZ: number;
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
            <button onClick={() => handleUpdateSettings({ paused: !renderer.settings.paused })}>Toggle Pause</button>
            <input type="range" min="0" max="360" value={renderer.settings.thetaX} />
        </div>
    );
};
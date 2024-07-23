import "./Settings.css"

export interface Settings {
    paused: boolean
}

export default function SettingsPanel({ settings, onSettingsChange }:
    { settings: Settings, onSettingsChange: (newSettings: Settings) => void }) {
    return (
        <div className="Settings">
            <button onClick={() => { settings.paused = !settings.paused }}>Toggle Pause</button>
        </div>
    )
}
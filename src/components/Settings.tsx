import "./Settings.css"

export interface Settings {
    paused: boolean;
    thetaX: number;
    thetaY: number;
    thetaZ: number;
    rotationSpeed: number;
    frametime: number;
    delta: number;
}

export default function SettingsPanel({ settings, setSettings }:
    { settings: Settings, setSettings: React.Dispatch<React.SetStateAction<Settings>> }) {
    return (
        <div className="Settings">
            {
                /* 
                    Here's the broken pause button when the other part isn't commented out.
                    I've tried just setting it to true and that didn't work either.
                    Before, it was also working fine if I set it by doing:
                    settings.paused = !settings.paused
                    and somehow that worked even though I wasn't setting the state, but I'm assuming
                    that's because I rerender the view every 50ms, so there's no need to use a state
                    since it's already being rerendered? But now no matter what if I'm updating the
                    other component using setState this no longer works.
                 */
            }
            <button onClick={() => { setSettings({ ...settings, paused: !settings.paused }) }}>Toggle Pause</button>

            <input type="range" min="0" max="360" value={settings.thetaX} />
        </div >
    )
}
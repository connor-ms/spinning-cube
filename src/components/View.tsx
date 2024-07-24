import { useEffect, useState } from "react";
import Renderer from "../render";
import { Settings } from "./Settings";
import "./View.css"

export default function View({ settings, setSettings }: { settings: Settings, setSettings: React.Dispatch<React.SetStateAction<Settings>> }) {
    const [frame, setFrame] = useState<string>("");

    let renderer = new Renderer(75, 75);

    useEffect(() => {
        const interval = setInterval(() => setFrame(renderer.buildNextFrame(5, settings, setSettings)), 50);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <textarea className="View" value={frame} spellCheck="false"></textarea>
    )
}
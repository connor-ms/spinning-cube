import { useEffect, useState } from "react";
import Renderer from "../render";
import { Settings } from "./Settings";
import "./View.css"

export default function View({ settings }: { settings: Settings }) {
    const [frame, setFrame] = useState<string>("");

    let renderer = new Renderer(75, 75);

    useEffect(() => {
        const interval = setInterval(() => setFrame(renderer.buildNextFrame(5, settings)), 50);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <textarea className="View" value={frame} spellCheck="false"></textarea>
    )
}
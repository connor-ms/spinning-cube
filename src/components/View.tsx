import { useEffect, useState } from "react";
import { useRenderer } from "./RenderContext";
import "./View.css"

export default function View() {
    const { renderer } = useRenderer();
    const [frame, setFrame] = useState<string>("");

    useEffect(() => {
        const interval = setInterval(() => setFrame(renderer.buildNextFrame()), renderer.settings.frametime);
        return () => {
            clearInterval(interval);
        };
    }, [renderer]);

    return <textarea className="View" value={frame} spellCheck="false"></textarea>;
}
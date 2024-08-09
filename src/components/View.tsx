import { useRenderer } from "./RenderContext";
import "./View.css"

export default function View() {
    const { renderer } = useRenderer();

    const dimensions = {
        "height": `500px`,
        "width": `500px`,
        "font-size": `${renderer.settings.fontSize}px`
    } as React.CSSProperties;

    return <textarea className="View" style={dimensions} value={renderer.frame} spellCheck="false"></textarea>;
}
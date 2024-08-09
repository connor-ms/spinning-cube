import React, { ReactNode } from "react";
import Renderer from "../render";
import { RendererContext } from "./RenderContext";

export default function RendererProvider({ children }: { children: ReactNode; }) {
    const [renderer] = React.useState(new Renderer());
    const [settings, setSettings] = React.useState(renderer.settings);

    React.useEffect(() => {
        const interval = setInterval(() => {
            renderer.buildNextFrame();
            setSettings({ ...renderer.settings });
        }, renderer.settings.frametime);

        return () => clearInterval(interval);
    }, [renderer]);

    return (
        <RendererContext.Provider value={{ renderer, settings, setSettings }}>
            {children}
        </RendererContext.Provider >
    );
};
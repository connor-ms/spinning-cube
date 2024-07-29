import React, { createContext, useContext } from 'react';
import Renderer from '../render'
import { Settings } from './Settings';

interface RendererContextType {
    renderer: Renderer;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export const RendererContext = createContext<RendererContextType | undefined>(undefined);

export function useRenderer() {
    const context = useContext(RendererContext);
    if (!context) {
        throw new Error('useRenderer must be used within a RendererProvider');
    }
    return context;
};
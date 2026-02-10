import React, { useEffect, useRef } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';

const transformer = new Transformer();

interface VisualMindMapProps {
    markdown: string;
}

export const VisualMindMap: React.FC<VisualMindMapProps> = ({ markdown }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mmRef = useRef<Markmap | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Initialize markmap
        if (!mmRef.current) {
            mmRef.current = Markmap.create(svgRef.current);
        }

        // Update content
        const { root } = transformer.transform(markdown);
        mmRef.current.setData(root);
        mmRef.current.fit();

        // Add Toolbar
        const renderToolbar = () => {
            const toolbar = Toolbar.create(mmRef.current!);
            const el = toolbar.el;
            el.className = 'markmap-toolbar absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-gray-100';
            containerRef.current?.append(el);
            return el;
        };

        const toolbarEl = renderToolbar();

        return () => {
            toolbarEl?.remove();
        };
    }, [markdown]);

    return (
        <div ref={containerRef} className="relative w-full h-[500px] bg-slate-50/50 rounded-3xl border border-dashed border-gray-200 overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-gray-100 pointer-events-none">
                <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Esquema Visual Boardmix</span>
            </div>
            <svg
                ref={svgRef}
                className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
            />
            <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-[10px] text-gray-400 font-medium">Use scroll para zoom • Arraste para mover</p>
            </div>
        </div>
    );
};

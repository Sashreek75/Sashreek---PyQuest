import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        primaryColor: '#ffb300',
        primaryTextColor: '#fff',
        primaryBorderColor: '#ffb300',
        lineColor: '#ffb300',
        secondaryColor: '#0061ff',
        tertiaryColor: '#fff'
    }
});

const Mermaid = ({ chart }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && chart) {
            ref.current.removeAttribute('data-processed');
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div className="mermaid bg-black/40 p-4 rounded-xl border border-white/10 my-4 overflow-x-auto custom-scrollbar" ref={ref}>
            {chart}
        </div>
    );
};

export default Mermaid;

// toolbar.js

import { nodeConfig } from './nodes/nodeConfig';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="py-4 px-8 bg-bg shadow-md border-b border-bg-dark">
            <div className='flex gap-2 flex-wrap'>
                {Object.entries(nodeConfig).map(([type, config]) => (
                    <DraggableNode key={type} type={type} label={config.label} icon={config.icon} />
                ))}
            </div>
        </div>
    );
};

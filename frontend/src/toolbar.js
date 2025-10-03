// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                {/* Custom 5 nodes */}
                <DraggableNode type='zoho' label='Zoho' />
                <DraggableNode type='googlesheets' label='Google Sheets' />
                <DraggableNode type='slack' label='Slack' />
                <DraggableNode type='webhook' label='Webhook' />
                <DraggableNode type='awss3' label='AWS S3' />

            </div>
        </div>
    );
};

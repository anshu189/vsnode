// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, addEdge, MarkerType } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import 'reactflow/dist/style.css';
import { nodeConfig } from './nodes/nodeConfig';

// Using nodeRender to get all nodes at once
import { nodeRender } from "./nodes/nodeRender";


const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: nodeRender,
  llm: nodeRender,
  customOutput: nodeRender,
  text: nodeRender,
  
  // Custom 5 nodes
  zoho: nodeRender,
  googlesheets: nodeRender,
  slack: nodeRender,
  webhook: nodeRender,
  awss3: nodeRender,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setEdges: state.setEdges,
});


export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setEdges
  } = useStore(selector, shallow);
  
  // Initialize a node's data fields based on its config
  // Each field gets a default value matching its name, except textarea which is empty
  // This helps with variable Handles matching
  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    
    const config = nodeConfig[type];
    config.fields.forEach((field) => {
      // targeting the textarea field to be specific for the dynamic handles connection
      if(field.type!=="textarea"){nodeData[field.name] = field.name;}
      else{
        nodeData[field.name] = "";
      }
    });
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  useEffect(() => {
    // Storing auto-edges in a set to avoid duplicates
    let validAutoEdgeIds = new Set();
    /**
     - For all text nodes present on screen, get {{var}} variables,
     - find source nodes with matching fields to the var,
     - auto-connect the handle to the Text node's dynamic handle.
     */
    nodes.filter((node) => node.type === 'text').forEach((textNode) => {
        const textValue = textNode.data?.text || '';
        // Regex for {{ var }} pattern
        const variables = [...textValue.matchAll(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g)].map(m => m[1]);
        
        variables.forEach(varName => {
          nodes.forEach(srcNode => {
            
            if (srcNode.id === textNode.id) return; // skip self node
            const hasField = Object.values(srcNode.data || {}).includes(varName);

            if (hasField) {
              const newEdgeId = `autoedge-${srcNode.id}-${textNode.id}-${varName}`;
              validAutoEdgeIds.add(newEdgeId);
            }
          });
        });
      });
      
      let nextEdges = edges.filter(
        e => !e.id.startsWith('autoedge-') || validAutoEdgeIds.has(e.id)
      );

      nodes.filter((node) => node.type === 'text').forEach((textNode) => {
        const textValue = textNode.data?.text || '';
        const variables = [...textValue.matchAll(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g)].map(m => m[1]);
        
        variables.forEach(varName => {
          nodes.forEach(srcNode => {
            
            if (srcNode.id === textNode.id) return; // skip self node
            const hasField = Object.values(srcNode.data || {}).includes(varName);

            if (hasField) {
              const newEdgeId = `autoedge-${srcNode.id}-${textNode.id}-${varName}`;
            
              if (!edges.some(e => e.id === newEdgeId)) {
                // The target handle matches how you render dynamic handles:
                const targetHandle = `${textNode.id}-${varName}`;
                let sourceHandle = 'output';

                setEdges(eds => addEdge({
                  id: newEdgeId,
                  source: srcNode.id,
                  sourceHandle,
                  target: textNode.id,
                  targetHandle,
                  type: 'smoothstep',
                  animated: true,
                  style: { strokeDasharray: '6 3' },
                  markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } // adjust if needed
                }, eds));
              }
            }
          })
        })
      })
    // 4. Update edges state only if it actually changed
    if (JSON.stringify(edges) !== JSON.stringify(nextEdges)) {
      setEdges(nextEdges);
    }
  }, [nodes, setEdges]);


  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100wv', height: '70vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  )
}

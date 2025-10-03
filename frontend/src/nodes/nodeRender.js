import React from "react";
import { NodeWrapper } from "./NodeWrapper";
import { nodeConfig } from "./nodeConfig";

export const nodeRender = ({ id, type, data }) => {
  const config = nodeConfig[type];
  if (!config) return <div>Unknown node type: {type}</div>;

  return <NodeWrapper id={id} type={type} data={data} config={config} />;
};

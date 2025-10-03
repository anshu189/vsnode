// src/nodes/NodeWrapper.js
import { Handle, Position } from "reactflow";
import { useStore } from "../store";

export const NodeWrapper = ({ id, type, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <div style={{
      width: config.width || 200,
      minHeight: config.minHeight || 80,
      border: "1px solid black",
      borderRadius: "6px",
      backgroundColor: "#fff",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }}>
      {/* Title */}
      <div style={{ fontWeight: "bold" }}>{config.label}</div>

      {/* Fields */}
      {config.fields?.map((field) => (
        <div key={field.name}>
          <label>
            {field.label}:
            {field.type === "text" && (
              <input
                type="text"
                value={data[field.name] || ""}
                onChange={(e) =>
                  updateNodeField(id, field.name, e.target.value)
                }
              />
            )}
            {field.type === "select" && (
              <select
                value={data[field.name] || field.options[0]}
                onChange={(e) =>
                  updateNodeField(id, field.name, e.target.value)
                }
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>
      ))}

      {/* Handles */}
      {config.handles?.map((h, idx) => (
        <Handle
          key={idx}
          type={h.type}
          position={Position[h.position]}
          id={`${id}-${h.id}`}
          style={h.style || {}}
        />
      ))}
    </div>
  );
};

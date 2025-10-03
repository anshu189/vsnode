// src/nodes/NodeWrapper.js
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useStore } from "../store";
import { useEffect, useRef, useMemo } from "react";

export const NodeWrapper = ({ id, type, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();

  // Autoresize and store refs for textarea fields
  const textareaRefs = useRef({});

  const setTextareaRef = (name) => (el) => {
    if (el) textareaRefs.current[name] = el;
  };

  useEffect(() => {
    (config.fields || []).forEach((field) => {
      if (field.type === "textarea") {
        const el = textareaRefs.current[field.name];
        const val = data?.[field.name] ?? ""; // use it for later handles connections
        if (!el) return;

        // reset then set to scrollHeight so it grows with content
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    });
  }, [data, config.fields]);


  // Extract variables for fields which have variableHandles: true
  // regex only permits valid JS identifiers inside the braces
  const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variableMap = useMemo(() => {
    const map = {};
    (config.fields || []).forEach((field) => {
      if (!field.variableHandles) return;
      const text = data?.[field.name] ?? "";
      const matches = [...text.matchAll(variableRegex)];
      const vars = [...new Set(matches.map((m) => m[1]))]; // unique gets 1st index only
      map[field.name] = vars;
    });
    return map;
  }, [data, config.fields]);
  
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variableMap, updateNodeInternals]);

  // container style must be relative for top% handle positioning to work
  const wrapperStyle = {
    width: config.width ?? 200,
    minHeight: config.minHeight ?? 80,
    border: "1px solid black",
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    position: "relative", // IMPORTANT for handle top %
    boxSizing: "border-box",
  };

   return (
    <div style={wrapperStyle}>
      {/* Title */}
      <div style={{ fontWeight: "bold" }}>{config.label}</div>

      {/* Fields rendering */}
      {config.fields?.map((field) => (
        <div key={field.name} style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: 12, marginBottom: 6 }}>{field.label}</label>

          {/* simple text input */}
          {field.type === "text" && (
            <input
              type="text"
              value={data[field.name] ?? ""}
              onChange={(e) => updateNodeField(id, field.name, e.target.value)}
              style={{ padding: 6, borderRadius: 4 }}
            />
          )}

          {/* select */}
          {field.type === "select" && (
            <select
              value={data[field.name] ?? field.options?.[0] ?? ""}
              onChange={(e) => updateNodeField(id, field.name, e.target.value)}
              style={{ padding: 6, borderRadius: 4 }}
            >
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {/* textarea with auto resize & ref */}
          {field.type === "textarea" && (
            <textarea
              ref={setTextareaRef(field.name)}
              value={data[field.name] ?? ""}
              onChange={(e) => updateNodeField(id, field.name, e.target.value)}
              style={{
                resize: "none",
                overflow: "hidden",
                minWidth: field.minWidth ?? 150,
                minHeight: field.minHeight ?? 40,
                padding: 6,
                borderRadius: 4,
                fontSize: 14,
              }}
            />
          )}
        </div>
      ))}

      {/* static handles declared in config */}
      {config.handles?.map((h, idx) => (
        <Handle
          key={`static-${idx}`}
          type={h.type}
          position={Position[h.position]}
          id={`${id}-${h.id}`}
          style={h.style ?? {}}
        />
      ))}

      {/* dynamic variable handles for each field */}
      {Object.entries(variableMap).map(([fieldName, vars]) =>
        vars.map((v, idx) => {
          // compute top position percentage so handles are spread evenly vertically
          const topPercent = ((idx + 1) / (vars.length + 1)) * 100;
          const handleId = `${id}-${v}`; // unique id
          return (
            <Handle
              key={handleId}
              type="target"
              position={Position.Left}
              id={handleId}
              style={{ top: `${topPercent}%` }}
              isConnectable={true}
            />
          );
        })
      )}
      
    </div>
  );
};

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


   return (
    <div className={`relative flex flex-col gap-1 min-w-[${config.width??200}px] min-h-[${config.minHeight??80}px] bg-bg-light border-2 border-primary3 rounded-lg font-semibold p-1`}>
      {/* Title */}
      <div className="flex items-center gap-2 text-t-light text-lg bg-primary4 border-2 p-1 border-primary2 rounded-md shadow-sh-s">
        {config.icon && <config.icon className="w-4 h-4" />}
        {config.label}
      </div>

      {/* Fields rendering */}
      {config.fields?.map((field, indx) => (
        <div key={field.name} className="flex flex-col gap-1 px-1 mt-1 text-sm">
          {/* Skip the first label */}
          {indx !== 0 && (
            <label className="text-t-light">{field.label}</label>
          )}

          {/* simple text input */}
          {field.type === "text" && (
            <input
              type="text"
              // value={indx===0 ? id: (data[field.name] ?? field.name)}
              value={data[field.name] ?? field.name}
              onChange={(e) => updateNodeField(id, field.name, e.target.value)}
              className={`${indx===0?
                "border px-2 py-1 rounded-md outline-none border-none text-primary text-center bg-primary4":
                "border px-2 py-1 rounded-sm outline-none border-1 border-primary3 text-t-light bg-bg-light focus:ring-1 focus:ring-primary duration-100"
              }`}
            />
          )}

          {/* select */}
          {field.type === "select" && (
            <select
              value={data[field.name] ?? field.options?.[0] ?? ""}
              onChange={(e) => updateNodeField(id, field.name, e.target.value)}
              className="border px-2 py-1 rounded-sm outline-none border-1 border-primary3 text-t-light"
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
              className="resize-none border px-2 py-1 rounded-sm outline-none border-1 border-primary3 text-t-light bg-bg-light focus:ring-1 focus:ring-primary duration-100"
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

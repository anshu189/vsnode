export const nodeConfig = {
  customInput: {
    label: "Input",
    width: 220,
    minHeight: 100,
    fields: [
      { name: "inputName", label: "Name", type: "text" },
      { name: "inputType", label: "Type", type: "select", options: ["Text", "File"] }
    ],
    handles: [
      { id: "value", type: "source", position: "Right" }
    ]
  },

  llm: {
    label: "LLM",
    width: 220,
    minHeight: 100,
    fields: [],
    handles: [
      { id: "system", type: "target", position: "Left", style: { top: "33%" } },
      { id: "prompt", type: "target", position: "Left", style: { top: "66%" } },
      { id: "response", type: "source", position: "Right" }
    ]
  },

  customOutput: {
    label: "Output",
    width: 220,
    minHeight: 100,
    fields: [
      { name: "outputName", label: "Name", type: "text" },
      { name: "outputType", label: "Type", type: "select", options: ["Text", "Image"] }
    ],
    handles: [
      { id: "value", type: "target", position: "Left" }
    ]
  },

  text: {
    label: "Text",
    width: 220,
    minHeight: 100,
    fields: [
      {
        name: "text",
        label: "Text",
        type: "textarea",           // textarea: so wrapper auto-resizes
        variableHandles: true,      // dynamic handles: bool
        minWidth: 150,
        maxWidth: 600,
        minHeight: 40
      }
    ],
    handles: [
      { id: "output", type: "source", position: "Right" }
    ]
  },

  // 5 new nodes definitions  
  zoho: {
    label: "Zoho",
    width: 220,
    minHeight: 120,
    fields: [
      { name: "module", label: "Module", type: "select", options: ["Leads", "Contacts", "Deals"] },
      { name: "operation", label: "Operation", type: "select", options: ["Create", "Update", "Delete"] }
    ],
    handles: [
      { id: "input", type: "target", position: "Left" },
      { id: "output", type: "source", position: "Right" }
    ]
  },

  googlesheets: {
    label: "Google Sheets",
    width: 220,
    minHeight: 120,
    fields: [
      { name: "sheetId", label: "Sheet ID", type: "text" },
      { name: "range", label: "Range", type: "text" },
      { name: "operation", label: "Operation", type: "select", options: ["Read", "Write", "Update"] }
    ],
    handles: [
      { id: "input", type: "target", position: "Left" },
      { id: "output", type: "source", position: "Right" }
    ]
  },

  slack: {
    label: "Slack",
    width: 220,
    minHeight: 120,
    fields: [
      { name: "channel", label: "Channel", type: "text" },
      { name: "message", label: "Message", type: "text" }
    ],
    handles: [
      { id: "input", type: "target", position: "Left" },
      { id: "output", type: "source", position: "Right" }
    ]
  },

  webhook: {
    label: "Webhook",
    width: 220,
    minHeight: 100,
    fields: [
      { name: "url", label: "URL", type: "text" },
      { name: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] }
    ],
    handles: [
      { id: "trigger", type: "target", position: "Left" },
      { id: "response", type: "source", position: "Right" }
    ]
  },

  awss3: {
    label: "AWS S3",
    width: 220,
    minHeight: 140,
    fields: [
      { name: "bucketName", label: "Bucket Name", type: "text" },
      { name: "operation", label: "Operation", type: "select", options: ["Upload", "Download", "Delete"] },
      { name: "filePath", label: "File Path", type: "text" }
    ],
    handles: [
      { id: "input", type: "target", position: "Left" },
      { id: "output", type: "source", position: "Right" }
    ]
  }
};

// draggableNode.js

export const DraggableNode = ({ type, label, icon: Icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`${type} min-w-[calc(100%/19)] min-h-14 shadow-sh-s flex flex-col gap-2 
      items-center justify-center border-2 text-sm text-t-light rounded-xl font-semibold 
      bg-bg-light py-3 px-4 rounded-md cursor-grab hover:border-primary hover:bg-primary2 duration-300`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
       <Icon className="w-6 h-6 text-t-light"/>
      <span>{label}</span>
    </div>
  );
};

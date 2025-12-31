import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  Activity,
} from 'react';
import type { SplitDirection } from '../../types/BSPChatNode';

export default function DropZones({
  onDrop,
}: {
  onDrop: (event: React.DragEvent, action: 'replace' | SplitDirection) => void;
}) {
  // is there a drag event occuring?
  // if so, expose invisible drag detectors
  const [isDragging, setIsDragging] = useState(false);
  const visualFeedbackRef = useRef<VisualFeedbackHandle>(null);

  function handleZoneChange(zone: 'replace' | SplitDirection | null) {
    visualFeedbackRef.current?.setActiveZone(zone);
  }

  useEffect(() => {
    // on drag entering drop zone
    const handleDragEnter = () => setIsDragging(true);
    // on user stops dragging
    const handleDragEnd = () => {
      setIsDragging(false);
      handleZoneChange(null);
    };
    // on user stops dragging while on drop zone
    const handleDrop = () => {
      setIsDragging(false);
      handleZoneChange(null);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <Activity mode={isDragging ? 'visible' : 'hidden'}>
      <div className="pointer-events-none absolute inset-0 z-50 grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr]">
        <VisualFeedbackLayer ref={visualFeedbackRef} />
        {/* North */}
        <div
          className={`pointer-events-auto col-start-1 col-end-4 row-start-1`}
          onDragOver={e => {
            e.preventDefault();
            handleZoneChange('north');
          }}
          onDragLeave={() => handleZoneChange(null)}
          onDrop={e => onDrop(e, 'north')}
        />
        {/* West */}
        <div
          className={`pointer-events-auto col-start-1 row-start-2`}
          onDragOver={e => {
            e.preventDefault();
            handleZoneChange('west');
          }}
          onDragLeave={() => handleZoneChange(null)}
          onDrop={e => onDrop(e, 'west')}
        />
        {/* Center (replace) */}
        <div
          className={`pointer-events-auto col-start-2 row-start-2`}
          onDragOver={e => {
            e.preventDefault();
            handleZoneChange('replace');
          }}
          onDragLeave={() => handleZoneChange(null)}
          onDrop={e => onDrop(e, 'replace')}
        />
        {/* East */}
        <div
          className={`pointer-events-auto col-start-3 row-start-2`}
          onDragOver={e => {
            e.preventDefault();
            handleZoneChange('east');
          }}
          onDragLeave={() => handleZoneChange(null)}
          onDrop={e => onDrop(e, 'east')}
        />
        {/* South */}
        <div
          className={`pointer-events-auto col-start-1 col-end-4 row-start-3`}
          onDragOver={e => {
            e.preventDefault();
            handleZoneChange('south');
          }}
          onDragLeave={() => handleZoneChange(null)}
          onDrop={e => onDrop(e, 'south')}
        />
      </div>
    </Activity>
  );
}

type VisualFeedbackHandle = {
  setActiveZone: (zone: 'replace' | SplitDirection | null) => void;
};

function VisualFeedbackLayer({
  ref,
}: {
  ref: React.Ref<VisualFeedbackHandle>;
}) {
  const [activeZone, setActiveZone] = useState<
    'replace' | SplitDirection | null
  >(null);

  useImperativeHandle(ref, () => ({
    setActiveZone,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {activeZone === 'north' && (
        <div className="absolute inset-x-0 top-0 h-1/2 bg-blue-500/30" />
      )}
      {activeZone === 'south' && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-500/30" />
      )}
      {activeZone === 'west' && (
        <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-500/30" />
      )}
      {activeZone === 'east' && (
        <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-500/30" />
      )}
      {activeZone === 'replace' && (
        <div className="absolute inset-0 bg-green-500/30" />
      )}
    </div>
  );
}

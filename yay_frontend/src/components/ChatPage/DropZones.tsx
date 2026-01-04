import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  Activity,
} from 'react';
import type { SplitDirection } from '../../types/BSPChatNode';

export type DropZonesHandle = {
  enableDropZones: () => void;
  disableDropZones: () => void;
};

export default function DropZones({
  onDrop,
  dropZonesRef,
}: {
  onDrop: (event: React.DragEvent, action: 'replace' | SplitDirection) => void;
  dropZonesRef: React.RefObject<DropZonesHandle>;
}) {
  // is there a drag event occuring?
  // if so, expose invisible drag detectors
  const [isEnabled, setIsEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const visualFeedbackRef = useRef<VisualFeedbackHandle>(null);

  useImperativeHandle(dropZonesRef, () => ({
    enableDropZones: () => setIsEnabled(true),
    disableDropZones: () => setIsEnabled(false),
  }));

  function handleZoneChange(zone: 'replace' | SplitDirection | null) {
    visualFeedbackRef.current?.setActiveZone(zone);
  }

  useEffect(() => {
    // on drag entering drop zone
    const handleDragEnter = (event: DragEvent) => {
      // could use something more rigorous should more drag events appear
      if (isEnabled && event.dataTransfer?.types.includes('channelid')) {
        setIsDragging(true);
      }
    };
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
  }, [isEnabled]);

  return (
    <Activity mode={isDragging ? 'visible' : 'hidden'}>
      <div
        className="pointer-events-none absolute inset-0 z-50"
        onDragLeave={e => {
          // Only reset if dragging completely out of the zones container
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            handleZoneChange(null);
          }
        }}
      >
        <VisualFeedbackLayer ref={visualFeedbackRef} />
        <div className="pointer-events-none grid h-full w-full grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_2fr_1fr]">
          {/* North */}
          <div
            className={`pointer-events-auto col-start-1 col-end-4 row-start-1`}
            onDragOver={e => {
              e.preventDefault();
              handleZoneChange('north');
            }}
            onDrop={e => onDrop(e, 'north')}
          />
          {/* West */}
          <div
            className={`pointer-events-auto col-start-1 row-start-2`}
            onDragOver={e => {
              e.preventDefault();
              handleZoneChange('west');
            }}
            onDrop={e => onDrop(e, 'west')}
          />
          {/* Center (replace) */}
          <div
            className={`pointer-events-auto col-start-2 row-start-2`}
            onDragOver={e => {
              e.preventDefault();
              handleZoneChange('replace');
            }}
            onDrop={e => onDrop(e, 'replace')}
          />
          {/* East */}
          <div
            className={`pointer-events-auto col-start-3 row-start-2`}
            onDragOver={e => {
              e.preventDefault();
              handleZoneChange('east');
            }}
            onDrop={e => onDrop(e, 'east')}
          />
          {/* South */}
          <div
            className={`pointer-events-auto col-start-1 col-end-4 row-start-3`}
            onDragOver={e => {
              e.preventDefault();
              handleZoneChange('south');
            }}
            onDrop={e => onDrop(e, 'south')}
          />
        </div>
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

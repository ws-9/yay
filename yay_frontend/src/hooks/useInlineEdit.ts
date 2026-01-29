import { useState, useRef, useEffect, useEffectEvent } from 'react';

type UseInlineEditOptions = {
  initialValue: string;
  onSave: (value: string) => void;
};

type UseInlineEditReturn = {
  isEditing: boolean;
  editValue: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  handleSaveSuccess: () => void;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
};

export function useInlineEdit({
  initialValue,
  onSave,
}: UseInlineEditOptions): UseInlineEditReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleCancel() {
    setIsEditing(false);
    setEditValue(initialValue);
  }

  const handleCancelEffect = useEffectEvent(() => {
    handleCancel();
  });

  useEffect(() => {
    if (isEditing) {
      // Defer focus until after the render cycle completes
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            editValue.length,
            editValue.length,
          );

          // Auto-resize textarea
          const textarea = textareaRef.current;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      }, 0);
    }
  }, [isEditing, editValue]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    function handleGlobalClick(e: MouseEvent) {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        handleCancelEffect();
      }
    }

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, [isEditing]);

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditValue(e.target.value);

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  function handleEdit() {
    setIsEditing(true);
    setEditValue(initialValue);
  }

  function handleSave() {
    if (editValue.trim() !== initialValue.trim()) {
      onSave(editValue.trim());
      // Note: The parent component should call setIsEditing(false) on success
    } else {
      setIsEditing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

  function handleSaveSuccess() {
    setIsEditing(false);
  }

  return {
    isEditing,
    editValue,
    textareaRef,
    handleEdit,
    handleCancel,
    handleSave,
    handleSaveSuccess,
    handleTextareaChange,
    handleKeyDown,
  };
}

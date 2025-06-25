import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { suppressReactQuillWarnings } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Suppress ReactQuill warnings and deprecation messages
  useEffect(() => {
    const cleanup = suppressReactQuillWarnings();
    return cleanup;
  }, []);

  return (
    <div className={`rich-text-editor-container ${className || ''}`}>
      <ReactQuill
        ref={quillRef}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
};

export default RichTextEditor; 
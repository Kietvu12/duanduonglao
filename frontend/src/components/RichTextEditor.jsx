import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes, $isParagraphNode } from 'lexical';
import { $createParagraphNode } from 'lexical';
import { ImageNode, $createImageNode } from './ImageNode';
import { uploadAPI } from '../services/api';
import './RichTextEditor.css';

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (command) => {
    // Use contentEditable commands (still works with Lexical's ContentEditable)
    document.execCommand(command, false, null);
  };

  const insertHeading = (level) => {
    formatText('formatBlock');
    // Create heading element
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      const contents = range.extractContents();
      heading.appendChild(contents);
      range.insertNode(heading);
      range.collapse(false);
    }
  };

  const insertImage = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!imageTypes.includes(file.type)) {
        alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 20MB');
        return;
      }

      try {
        const response = await uploadAPI.uploadMedia(file);
        const imageUrl = response.data.url;

        // Insert image using Lexical ImageNode
        editor.update(() => {
          const imageNode = $createImageNode(imageUrl, 'Uploaded image');
          const root = $getRoot();
          
          // Get the last child
          const lastChild = root.getLastChild();
          
          // If last child is a paragraph, insert image after it
          if (lastChild && $isParagraphNode(lastChild)) {
            lastChild.insertAfter(imageNode);
          } else {
            // Otherwise append to root
            root.append(imageNode);
          }
          
          // Add a new paragraph after image for continued editing
          const newParagraph = $createParagraphNode();
          root.append(newParagraph);
        });
      } catch (error) {
        alert('Lỗi khi upload ảnh: ' + error.message);
      }
    };
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      formatText('createLink');
      // The createLink command will prompt, but we can also set it manually
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        const contents = range.extractContents();
        link.appendChild(contents);
        range.insertNode(link);
      }
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button type="button" onClick={() => insertHeading(1)} className="toolbar-btn" title="Heading 1">
          H1
        </button>
        <button type="button" onClick={() => insertHeading(2)} className="toolbar-btn" title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => insertHeading(3)} className="toolbar-btn" title="Heading 3">
          H3
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => formatText('bold')} className="toolbar-btn" title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => formatText('italic')} className="toolbar-btn" title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => formatText('underline')} className="toolbar-btn" title="Underline">
          <u>U</u>
        </button>
        <button type="button" onClick={() => formatText('strikeThrough')} className="toolbar-btn" title="Strikethrough">
          <s>S</s>
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => formatText('justifyLeft')} className="toolbar-btn" title="Align Left">
          ⬅
        </button>
        <button type="button" onClick={() => formatText('justifyCenter')} className="toolbar-btn" title="Align Center">
          ⬌
        </button>
        <button type="button" onClick={() => formatText('justifyRight')} className="toolbar-btn" title="Align Right">
          ➡
        </button>
        <button type="button" onClick={() => formatText('justifyFull')} className="toolbar-btn" title="Justify">
          ⬌⬌
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={() => formatText('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
          •
        </button>
        <button type="button" onClick={() => formatText('insertOrderedList')} className="toolbar-btn" title="Numbered List">
          1.
        </button>
        <button type="button" onClick={() => formatText('formatBlock')} className="toolbar-btn" title="Quote">
          "
        </button>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={insertImage} className="toolbar-btn" title="Insert Image">
          📷
        </button>
        <button type="button" onClick={insertLink} className="toolbar-btn" title="Insert Link">
          🔗
        </button>
      </div>
    </div>
  );
}

// Plugin to sync editor content with parent component
function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef(null);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    const handleChange = () => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Debounce to avoid too many updates
      timeoutRef.current = setTimeout(() => {
        // Get HTML directly from contentEditable element
        if (contentEditableRef.current) {
          const html = contentEditableRef.current.innerHTML;
          onChange(html);
        } else {
          // Fallback: try to get from editor state
          editor.getEditorState().read(() => {
            try {
              const htmlString = $generateHtmlFromNodes(editor, null);
              onChange(htmlString);
            } catch (e) {
              // If that fails, get from DOM
              const editorElement = editor.getRootElement();
              if (editorElement) {
                const contentEditable = editorElement.querySelector('[contenteditable="true"]');
                if (contentEditable) {
                  onChange(contentEditable.innerHTML);
                }
              }
            }
          });
        }
      }, 150);
    };

    // Get contentEditable element
    const editorElement = editor.getRootElement();
    if (editorElement) {
      const contentEditable = editorElement.querySelector('[contenteditable="true"]');
      if (contentEditable) {
        contentEditableRef.current = contentEditable;
        contentEditable.addEventListener('input', handleChange);
        contentEditable.addEventListener('paste', handleChange);
      }
    }

    // Also listen to Lexical updates
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        handleChange();
      });
    });

    return () => {
      if (contentEditableRef.current) {
        contentEditableRef.current.removeEventListener('input', handleChange);
        contentEditableRef.current.removeEventListener('paste', handleChange);
      }
      removeListener();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, onChange]);

  return null;
}

// Plugin to set initial content
function InitialContentPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);
  const lastContentRef = useRef('');

  useEffect(() => {
    // Only update if content actually changed
    if (initialContent !== undefined && initialContent !== lastContentRef.current) {
      lastContentRef.current = initialContent || '';
      
      if (initialContent) {
        editor.update(() => {
          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialContent, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
            isInitialized.current = true;
          } catch (error) {
            console.error('Error setting initial content:', error);
            // Fallback: set innerHTML directly
            const editorElement = editor.getRootElement();
            if (editorElement) {
              const contentEditable = editorElement.querySelector('[contenteditable="true"]');
              if (contentEditable) {
                contentEditable.innerHTML = initialContent;
                isInitialized.current = true;
              }
            }
          }
        });
      } else {
        // Clear content if empty
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      }
    }
  }, [editor, initialContent]);

  return null;
}

const theme = {
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  list: {
    listitem: 'ml-4',
    nested: {
      listitem: 'list-none',
    },
  },
};

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }) {
  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError: (error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      ImageNode,
    ],
  };

  return (
    <div className="rich-text-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" />
            }
            placeholder={
              <div className="editor-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={onChange} />
          <InitialContentPlugin initialContent={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}

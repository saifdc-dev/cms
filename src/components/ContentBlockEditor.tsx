import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Type, 
  Image, 
  Video, 
  List, 
  Link, 
  Table, 
  Quote, 
  Code,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  X
} from 'lucide-react';
import { ContentBlock } from '../types';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onMediaSelect?: (callback: (url: string) => void) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({ 
  blocks, 
  onChange, 
  onMediaSelect 
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'rich_text', icon: Type, label: 'Rich Text' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'gallery', icon: Image, label: 'Gallery' },
    { type: 'video', icon: Video, label: 'Video' },
    { type: 'list', icon: List, label: 'List' },
    { type: 'link', icon: Link, label: 'Link' },
    { type: 'table', icon: Table, label: 'Table' },
    { type: 'blockquote', icon: Quote, label: 'Quote' },
    { type: 'code', icon: Code, label: 'Code' }
  ];

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      order: blocks.length,
      settings: {},
      styles: {}
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map((block, i) => 
      i === index ? { ...block, ...updates } : block
    );
    onChange(updatedBlocks);
  };

  const removeBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    onChange(updatedBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    
    // Update order
    updatedBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    onChange(updatedBlocks);
  };

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text':
        return '';
      case 'rich_text':
        return '';
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'gallery':
        return { images: [] };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'list':
        return { type: 'ul', items: [''] };
      case 'link':
        return { url: '', text: '', target: '_self' };
      case 'table':
        return { 
          headers: ['Column 1', 'Column 2'], 
          rows: [['', '']] 
        };
      case 'blockquote':
        return { text: '', author: '' };
      case 'code':
        return { code: '', language: 'javascript' };
      default:
        return {};
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveBlock(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(index, { content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={4}
            placeholder="Enter text content..."
          />
        );

      case 'rich_text':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <ReactQuill
              value={block.content}
              onChange={(content) => updateBlock(index, { content })}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'script': 'sub'}, { 'script': 'super' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              formats={[
                'header', 'bold', 'italic', 'underline', 'strike',
                'list', 'bullet', 'script', 'indent', 'direction',
                'color', 'background', 'align', 'link', 'image', 'video'
              ]}
              placeholder="Enter rich text content..."
              style={{ minHeight: '200px' }}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={block.content.url || ''}
                onChange={(e) => updateBlock(index, { 
                  content: { ...block.content, url: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Image URL"
              />
              {onMediaSelect && (
                <button
                  type="button"
                  onClick={() => onMediaSelect((url) => 
                    updateBlock(index, { content: { ...block.content, url } })
                  )}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={block.content.alt || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, alt: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Alt text"
            />
            <input
              type="text"
              value={block.content.caption || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, caption: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Caption"
            />
            {block.content.url && (
              <img 
                src={block.content.url} 
                alt={block.content.alt} 
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gallery Images ({block.content.images?.length || 0})
              </label>
              {onMediaSelect && (
                <button
                  type="button"
                  onClick={() => onMediaSelect((url) => {
                    const images = [...(block.content.images || []), url];
                    updateBlock(index, { content: { ...block.content, images } });
                  })}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(block.content.images || []).map((image: string, imgIndex: number) => (
                <div key={imgIndex} className="relative group">
                  <img
                    src={image}
                    alt={`Gallery item ${imgIndex + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const images = block.content.images.filter((_: string, i: number) => i !== imgIndex);
                      updateBlock(index, { content: { ...block.content, images } });
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <input
              type="url"
              value={block.content.url || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, url: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Video URL (YouTube, Vimeo, or direct link)"
            />
            <input
              type="text"
              value={block.content.title || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, title: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Video title"
            />
            <textarea
              value={block.content.description || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, description: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={2}
              placeholder="Video description"
            />
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <select
              value={block.content.type || 'ul'}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, type: e.target.value }
              })}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="ul">Unordered List</option>
              <option value="ol">Ordered List</option>
            </select>
            {(block.content.items || []).map((item: string, itemIndex: number) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.content.items || [])];
                    items[itemIndex] = e.target.value;
                    updateBlock(index, { content: { ...block.content, items } });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={`Item ${itemIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const items = block.content.items.filter((_: string, i: number) => i !== itemIndex);
                    updateBlock(index, { content: { ...block.content, items } });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const items = [...(block.content.items || []), ''];
                updateBlock(index, { content: { ...block.content, items } });
              }}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-3">
            <input
              type="url"
              value={block.content.url || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, url: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Link URL"
            />
            <input
              type="text"
              value={block.content.text || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, text: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Link text"
            />
            <select
              value={block.content.target || '_self'}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, target: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="_self">Same window</option>
              <option value="_blank">New window</option>
            </select>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  const headers = [...block.content.headers, `Column ${block.content.headers.length + 1}`];
                  const rows = block.content.rows.map((row: string[]) => [...row, '']);
                  updateBlock(index, { content: { ...block.content, headers, rows } });
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Column
              </button>
              <button
                type="button"
                onClick={() => {
                  const newRow = new Array(block.content.headers.length).fill('');
                  const rows = [...block.content.rows, newRow];
                  updateBlock(index, { content: { ...block.content, rows } });
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr>
                    {block.content.headers.map((header: string, headerIndex: number) => (
                      <th key={headerIndex} className="border border-gray-200 dark:border-gray-700 p-2">
                        <input
                          type="text"
                          value={header}
                          onChange={(e) => {
                            const headers = [...block.content.headers];
                            headers[headerIndex] = e.target.value;
                            updateBlock(index, { content: { ...block.content, headers } });
                          }}
                          className="w-full px-2 py-1 bg-transparent text-center font-medium"
                          placeholder={`Header ${headerIndex + 1}`}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.content.rows.map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: string, cellIndex: number) => (
                        <td key={cellIndex} className="border border-gray-200 dark:border-gray-700 p-2">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => {
                              const rows = [...block.content.rows];
                              rows[rowIndex][cellIndex] = e.target.value;
                              updateBlock(index, { content: { ...block.content, rows } });
                            }}
                            className="w-full px-2 py-1 bg-transparent"
                            placeholder={`Cell ${rowIndex + 1}-${cellIndex + 1}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'blockquote':
        return (
          <div className="space-y-3">
            <textarea
              value={block.content.text || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, text: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Quote text"
            />
            <input
              type="text"
              value={block.content.author || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, author: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Author (optional)"
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <select
              value={block.content.language || 'javascript'}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, language: e.target.value }
              })}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="php">PHP</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
            </select>
            <textarea
              value={block.content.code || ''}
              onChange={(e) => updateBlock(index, { 
                content: { ...block.content, code: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              rows={6}
              placeholder="Enter your code here..."
            />
          </div>
        );

      default:
        return (
          <textarea
            value={JSON.stringify(block.content, null, 2)}
            onChange={(e) => {
              try {
                const content = JSON.parse(e.target.value);
                updateBlock(index, { content });
              } catch (err) {
                // Invalid JSON, ignore
              }
            }}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            rows={4}
            placeholder="JSON content"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2">
        {blockTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const blockType = blockTypes.find(bt => bt.type === block.type);
          const Icon = blockType?.icon || Type;

          return (
            <div
              key={block.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {block.type.replace('_', ' ')} Block
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {renderBlockEditor(block, index)}
            </div>
          );
        })}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No content blocks yet. Add your first block above.</p>
        </div>
      )}
    </div>
  );
};

export default ContentBlockEditor;
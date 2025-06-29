import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Image, 
  Video, 
  FileText, 
  List, 
  Link, 
  Table,
  Calendar,
  Eye,
  Settings,
  Search,
  Upload
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';
import { Post, ContentBlock, SEOData } from '../types';

interface PostEditorProps {
  post?: Post;
  onSave: (postData: any) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const { categories } = useCategories();
  const { media, uploadMedia } = useMedia();
  const [activeTab, setActiveTab] = useState('content');
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    category_id: post?.category_id || '',
    status: post?.status || 'draft',
    scheduled_at: post?.scheduled_at || '',
    content_blocks: post?.content_blocks || [],
    gallery_images: post?.gallery_images || [],
    video_url: post?.video_url || '',
    audio_url: post?.audio_url || ''
  });

  const [seoData, setSeoData] = useState<SEOData>({
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || [],
    canonical_url: post?.canonical_url || '',
    og_image: post?.og_image || '',
    robots: post?.robots || 'index,follow'
  });

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'featured' | 'gallery' | 'content'>('featured');

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      ...seoData,
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    };

    const result = await onSave(postData);
    if (result.success) {
      onCancel();
    }
  };

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      order: formData.content_blocks.length,
      settings: {}
    };

    setFormData(prev => ({
      ...prev,
      content_blocks: [...prev.content_blocks, newBlock]
    }));
  };

  const getDefaultContent = (type: ContentBlock['type']) => {
    switch (type) {
      case 'text':
      case 'rich_text':
        return '';
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'gallery':
        return { images: [] };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'audio':
        return { url: '', title: '', description: '' };
      case 'table':
        return { headers: ['Column 1', 'Column 2'], rows: [['', '']] };
      case 'list':
        return { type: 'ul', items: [''] };
      case 'link':
        return { url: '', text: '', target: '_self' };
      default:
        return {};
    }
  };

  const updateContentBlock = (index: number, updates: Partial<ContentBlock>) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, i) => 
        i === index ? { ...block, ...updates } : block
      )
    }));
  };

  const removeContentBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((_, i) => i !== index)
    }));
  };

  const handleMediaSelect = (mediaItem: any) => {
    if (selectedMediaType === 'featured') {
      setFormData(prev => ({ ...prev, featured_image: mediaItem.url }));
    } else if (selectedMediaType === 'gallery') {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, mediaItem.url]
      }));
    }
    setShowMediaModal(false);
  };

  const renderContentBlockEditor = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
      case 'rich_text':
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateContentBlock(index, { content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={block.type === 'rich_text' ? 8 : 4}
            placeholder={`Enter ${block.type === 'rich_text' ? 'rich text content' : 'text content'}...`}
          />
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={block.content.url || ''}
                onChange={(e) => updateContentBlock(index, { 
                  content: { ...block.content, url: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedMediaType('content');
                  setShowMediaModal(true);
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Image className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={block.content.alt || ''}
              onChange={(e) => updateContentBlock(index, { 
                content: { ...block.content, alt: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Alt text"
            />
            <input
              type="text"
              value={block.content.caption || ''}
              onChange={(e) => updateContentBlock(index, { 
                content: { ...block.content, caption: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Caption"
            />
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <select
              value={block.content.type || 'ul'}
              onChange={(e) => updateContentBlock(index, { 
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
                    const newItems = [...(block.content.items || [])];
                    newItems[itemIndex] = e.target.value;
                    updateContentBlock(index, { 
                      content: { ...block.content, items: newItems }
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={`Item ${itemIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = (block.content.items || []).filter((_: any, i: number) => i !== itemIndex);
                    updateContentBlock(index, { 
                      content: { ...block.content, items: newItems }
                    });
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
                const newItems = [...(block.content.items || []), ''];
                updateContentBlock(index, { 
                  content: { ...block.content, items: newItems }
                });
              }}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        );

      default:
        return (
          <textarea
            value={JSON.stringify(block.content, null, 2)}
            onChange={(e) => {
              try {
                const content = JSON.parse(e.target.value);
                updateContentBlock(index, { content });
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Post</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {['content', 'media', 'seo', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeTab === 'content' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Basic Fields */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Blocks */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Blocks</h3>
                    <div className="flex items-center space-x-2">
                      {[
                        { type: 'text', icon: FileText, label: 'Text' },
                        { type: 'image', icon: Image, label: 'Image' },
                        { type: 'video', icon: Video, label: 'Video' },
                        { type: 'list', icon: List, label: 'List' },
                        { type: 'link', icon: Link, label: 'Link' },
                        { type: 'table', icon: Table, label: 'Table' }
                      ].map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => addContentBlock(type as ContentBlock['type'])}
                          className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          title={`Add ${label}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.content_blocks.map((block, index) => (
                      <div key={block.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {block.type.replace('_', ' ')} Block
                          </span>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {renderContentBlockEditor(block, index)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Featured Image */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="url"
                      value={formData.featured_image}
                      onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Featured image URL"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMediaType('featured');
                        setShowMediaModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Image className="w-4 h-4" />
                      <span>Browse</span>
                    </button>
                  </div>
                  {formData.featured_image && (
                    <div className="mt-4">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gallery</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMediaType('gallery');
                        setShowMediaModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Images</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.gallery_images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              gallery_images: prev.gallery_images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video & Audio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Video URL</h3>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="YouTube, Vimeo, or direct video URL"
                    />
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audio URL</h3>
                    <input
                      type="url"
                      value={formData.audio_url}
                      onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Direct audio file URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={seoData.seo_title}
                        onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Leave empty to use post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={seoData.seo_description}
                        onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Brief description for search engines"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={seoData.seo_keywords?.join(', ') || ''}
                        onChange={(e) => setSeoData({ 
                          ...seoData, 
                          seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={seoData.canonical_url}
                        onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="https://example.com/canonical-url"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Open Graph Image
                      </label>
                      <input
                        type="url"
                        value={seoData.og_image}
                        onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Image URL for social media sharing"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Post Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {formData.status === 'scheduled' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Scheduled Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.scheduled_at}
                          onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowMediaModal(false)} />
            
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Media</h3>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMediaSelect(item)}
                    className="relative group cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;
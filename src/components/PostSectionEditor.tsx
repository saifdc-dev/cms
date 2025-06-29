import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  Settings,
  X,
  Save
} from 'lucide-react';
import { PostSection, PostListItem, ContentBlock } from '../types';
import ContentBlockEditor from './ContentBlockEditor';

interface PostSectionEditorProps {
  sections: PostSection[];
  onChange: (sections: PostSection[]) => void;
  onMediaSelect?: (callback: (url: string) => void) => void;
}

const PostSectionEditor: React.FC<PostSectionEditorProps> = ({ 
  sections, 
  onChange, 
  onMediaSelect 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedPostLists, setExpandedPostLists] = useState<Set<string>>(new Set());

  const sectionTypes = [
    { value: 'banner', label: 'Banner' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'child_page', label: 'Child Page' },
    { value: 'section', label: 'Section' },
    { value: 'slider', label: 'Slider' },
    { value: 'video', label: 'Video' },
    { value: 'image', label: 'Image' }
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addSection = () => {
    const newSection: PostSection = {
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      content_blocks: [],
      type: 'section',
      post_list: [],
      order: sections.length
    };
    onChange([...sections, newSection]);
    setExpandedSections(prev => new Set([...prev, newSection.id]));
  };

  const updateSection = (index: number, updates: Partial<PostSection>) => {
    const updatedSections = sections.map((section, i) => {
      if (i === index) {
        const updated = { ...section, ...updates };
        // Auto-generate slug if title changed
        if (updates.title && updates.title !== section.title) {
          updated.slug = generateSlug(updates.title);
        }
        return updated;
      }
      return section;
    });
    onChange(updatedSections);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    onChange(updatedSections);
  };

  const addPostListItem = (sectionIndex: number) => {
    const newPostListItem: PostListItem = {
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      content_blocks: [],
      type: 'section',
      order: sections[sectionIndex].post_list?.length || 0
    };

    const updatedSections = [...sections];
    if (!updatedSections[sectionIndex].post_list) {
      updatedSections[sectionIndex].post_list = [];
    }
    updatedSections[sectionIndex].post_list!.push(newPostListItem);
    onChange(updatedSections);
    setExpandedPostLists(prev => new Set([...prev, newPostListItem.id]));
  };

  const updatePostListItem = (sectionIndex: number, itemIndex: number, updates: Partial<PostListItem>) => {
    const updatedSections = [...sections];
    const updated = { ...updatedSections[sectionIndex].post_list![itemIndex], ...updates };
    
    // Auto-generate slug if title changed
    if (updates.title && updates.title !== updatedSections[sectionIndex].post_list![itemIndex].title) {
      updated.slug = generateSlug(updates.title);
    }
    
    updatedSections[sectionIndex].post_list![itemIndex] = updated;
    onChange(updatedSections);
  };

  const removePostListItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].post_list = updatedSections[sectionIndex].post_list!.filter((_, i) => i !== itemIndex);
    onChange(updatedSections);
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const togglePostListExpanded = (postListId: string) => {
    setExpandedPostLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postListId)) {
        newSet.delete(postListId);
      } else {
        newSet.add(postListId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      <button
        type="button"
        onClick={addSection}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Section</span>
      </button>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <button
                    type="button"
                    onClick={() => toggleSectionExpanded(section.id)}
                    className="flex items-center space-x-2"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {section.title || `Section ${sectionIndex + 1}`}
                    </span>
                  </button>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full capitalize">
                    {section.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Section Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Basic Section Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={section.slug}
                        onChange={(e) => updateSection(sectionIndex, { slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="section-slug"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(sectionIndex, { type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {sectionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={section.excerpt}
                      onChange={(e) => updateSection(sectionIndex, { excerpt: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Section excerpt"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg">
                      <ReactQuill
                        value={section.content}
                        onChange={(content) => updateSection(sectionIndex, { content })}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            ['link', 'image', 'video'],
                            ['clean']
                          ]
                        }}
                        placeholder="Section content..."
                        style={{ minHeight: '150px' }}
                      />
                    </div>
                  </div>

                  {/* Content Blocks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Content Blocks
                    </label>
                    <ContentBlockEditor
                      blocks={section.content_blocks || []}
                      onChange={(blocks) => updateSection(sectionIndex, { content_blocks: blocks })}
                      onMediaSelect={onMediaSelect}
                    />
                  </div>

                  {/* Post List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Post List ({section.post_list?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => addPostListItem(sectionIndex)}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Post</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(section.post_list || []).map((postItem, postIndex) => {
                        const isPostExpanded = expandedPostLists.has(postItem.id);
                        
                        return (
                          <div
                            key={postItem.id}
                            className="border border-purple-200 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                          >
                            {/* Post Item Header */}
                            <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700">
                              <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-purple-400 cursor-move" />
                                <button
                                  type="button"
                                  onClick={() => togglePostListExpanded(postItem.id)}
                                  className="flex items-center space-x-2"
                                >
                                  {isPostExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  )}
                                  <span className="font-medium text-purple-900 dark:text-purple-100">
                                    {postItem.title || `Post ${postIndex + 1}`}
                                  </span>
                                </button>
                                <span className="px-2 py-1 text-xs bg-purple-200 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-full capitalize">
                                  {postItem.type}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removePostListItem(sectionIndex, postIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Post Item Content */}
                            {isPostExpanded && (
                              <div className="p-6 space-y-6">
                                {/* Basic Post Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={postItem.title}
                                      onChange={(e) => updatePostListItem(sectionIndex, postIndex, { title: e.target.value })}
                                      className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-purple-900/50 text-gray-900 dark:text-white"
                                      placeholder="Post title"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                      Slug
                                    </label>
                                    <input
                                      type="text"
                                      value={postItem.slug}
                                      onChange={(e) => updatePostListItem(sectionIndex, postIndex, { slug: e.target.value })}
                                      className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-purple-900/50 text-gray-900 dark:text-white"
                                      placeholder="post-slug"
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                      Type
                                    </label>
                                    <select
                                      value={postItem.type}
                                      onChange={(e) => updatePostListItem(sectionIndex, postIndex, { type: e.target.value as any })}
                                      className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-purple-900/50 text-gray-900 dark:text-white"
                                    >
                                      {sectionTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                          {type.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Post Excerpt */}
                                <div>
                                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                    Excerpt
                                  </label>
                                  <textarea
                                    value={postItem.excerpt}
                                    onChange={(e) => updatePostListItem(sectionIndex, postIndex, { excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-purple-900/50 text-gray-900 dark:text-white"
                                    placeholder="Post excerpt"
                                  />
                                </div>

                                {/* Post Content */}
                                <div>
                                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                                    Content
                                  </label>
                                  <div className="bg-white dark:bg-purple-900/50 rounded-lg">
                                    <ReactQuill
                                      value={postItem.content}
                                      onChange={(content) => updatePostListItem(sectionIndex, postIndex, { content })}
                                      modules={{
                                        toolbar: [
                                          [{ 'header': [1, 2, 3, false] }],
                                          ['bold', 'italic', 'underline'],
                                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                          ['link', 'image'],
                                          ['clean']
                                        ]
                                      }}
                                      placeholder="Post content..."
                                      style={{ minHeight: '120px' }}
                                    />
                                  </div>
                                </div>

                                {/* Post Content Blocks */}
                                <div>
                                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-4">
                                    Content Blocks
                                  </label>
                                  <ContentBlockEditor
                                    blocks={postItem.content_blocks || []}
                                    onChange={(blocks) => updatePostListItem(sectionIndex, postIndex, { content_blocks: blocks })}
                                    onMediaSelect={onMediaSelect}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No sections yet. Add your first section above.</p>
        </div>
      )}
    </div>
  );
};

export default PostSectionEditor;
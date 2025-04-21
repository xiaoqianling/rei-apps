import React, { useState } from 'react';
import styles from './index.module.scss';
// import SlateEditorComponent from '@/path/to/your/SlateEditorComponent'; // 导入你已实现的 Slate 编辑器组件
import { CommunityTag } from '../types';
import { mockTags } from '../mockData';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<CommunityTag[]>([]);
  // const [editorState, setEditorState] = useState<any>(); // 管理 Slate 编辑器状态

  // --- Placeholder Tag Selection Logic ---
  // Replace with a proper TagInput component later
  const handleTagToggle = (tag: CommunityTag) => {
    setSelectedTags(prev =>
      prev.some(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handlePublish = () => {
    // TODO: Implement publish logic
    console.log('Publishing:', {
      title,
      tags: selectedTags,
      // content: editorState, // Get content from Slate state
    });
    alert('发布功能待实现！');
  };

  return (
    <div className={styles.createPostContainer}>
      <h1 className={styles.pageTitle}>创建新帖子</h1>

      <div className={styles.formGroup}>
        <label htmlFor="postTitle" className={styles.label}>帖子标题</label>
        <input
          type="text"
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入一个吸引人的标题..."
          className={styles.titleInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>选择标签（可选）</label>
        {/* --- Tag Input Placeholder --- */}
        <div className={styles.tagSelectionPlaceholder}>
          {Object.values(mockTags).map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag)}
              className={`${styles.tagOption} ${selectedTags.some(t => t.id === tag.id) ? styles.tagSelected : ''}`}
            >
              {tag.name}
            </button>
          ))}
        </div>
        {/* Replace above with a real <TagInput /> component */}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>帖子内容</label>
        <div className={styles.editorContainer}>
          {/* --- Slate Editor Placeholder --- */}
          {/* <SlateEditorComponent value={editorState} onChange={setEditorState} /> */}
          <div className={styles.slatePlaceholder}>此处集成 Slate 编辑器</div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handlePublish} className={styles.publishButton}>
          发布帖子
        </button>
        {/* Add Cancel/Save Draft buttons if needed */}
      </div>
    </div>
  );
};

export default CreatePostPage;

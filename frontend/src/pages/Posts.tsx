import { useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import usePosts from '../hooks/usePosts';
import { getUserId } from '../utils/auth';
import CreatePost from './CreatePost';
import PostDetail from '../components/posts/PostDetail';
import PostsHeader from '../components/posts/PostsHeader';
import EmptyState from '../components/posts/EmptyState';
import PostCard from '../components/posts/PostCard';

function Posts() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showReplyForm, setShowReplyForm] = useState<{[key: string]: boolean}>({});
  const currentUserId = getUserId();
  
  const {posts,loading,newReply,setNewReply,replyFileErrors,fetchPosts,createReply,handleFileChange,
    downloadFile,downloadPostFile
  } = usePosts();

  const handleBackFromCreate = () => {
    setShowCreatePost(false);
    fetchPosts();
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  const toggleReplyForm = (postId: string) => {
    setShowReplyForm(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCreateReply = async (postMessageId: string, file?: File | null) => {
    await createReply(postMessageId, file);
    setShowReplyForm(prev => ({ ...prev, [postMessageId]: false }));
    
    if (selectedPost && selectedPost.postMessageId === postMessageId) {
      
      const updatedPost = posts.find((p: any) => p.postMessageId === postMessageId);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  };

  if (loading) return (
    <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );

  if (showCreatePost) {
    return <CreatePost onBack={handleBackFromCreate} />;
  }

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={handleBackToList}
        showReplyForm={showReplyForm[selectedPost.postMessageId] || false}
        onToggleReplyForm={() => toggleReplyForm(selectedPost.postMessageId)}
        replyText={newReply[selectedPost.postMessageId] || ''}
        onReplyChange={(postId, text) => setNewReply(prev => ({ ...prev, [postId]: text }))}
        onFileChange={handleFileChange}
        onSubmitReply={handleCreateReply}
        onDownloadFile={downloadPostFile}
        onDownloadResponseFile={downloadFile}
        fileError={replyFileErrors[selectedPost.postMessageId]}
      />
    );
  }

  const filteredPosts = activeTab === 1 
    ? posts.filter((post: any) => post.userId === currentUserId)
    : posts;
    
  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <PostsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreatePost={() => setShowCreatePost(true)}
      />

      {filteredPosts.length === 0 ? (
        <EmptyState isMyPosts={activeTab === 1} />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          {filteredPosts.map((post: any) => (
            <PostCard
              key={post.postMessageId || post.id}
              post={post}
              onPostClick={handlePostClick}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Posts;
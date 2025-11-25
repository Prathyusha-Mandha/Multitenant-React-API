import { useState, useEffect } from 'react';
import { postService } from '../services';

export default function usePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState<{[key: string]: string}>({});
  const [replyFiles, setReplyFiles] = useState<{[key: string]: File | null}>({});
  const [replyFileErrors, setReplyFileErrors] = useState<{[key: string]: string}>({});

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostMessages();
    
      if (data && data.length > 0) {
        if (data[0].responseMessages) {
          console.log('Response messages:', data[0].responseMessages);
        }
      }
      setPosts(data || []);
      return data || [];
    } catch (error) {
      setPosts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (postMessageId: string, file?: File | null) => {
    try {
      const replyText = newReply[postMessageId];
      const attachedFile = file || replyFiles[postMessageId];
      if (!replyText && !attachedFile) return;
      
      const replyData: { replyText: string; file?: File } = { replyText: replyText || '' };
      if (attachedFile) {
        replyData.file = attachedFile;
      }
      
      await postService.createResponseMessage(postMessageId, replyData);
      setNewReply(prev => ({ ...prev, [postMessageId]: '' }));
      setReplyFiles(prev => ({ ...prev, [postMessageId]: null }));
      await fetchPosts(); 
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleFileChange = (postId: string, file: File | null) => {
    setReplyFiles(prev => ({ ...prev, [postId]: file }));
    if (file) {
      setReplyFileErrors(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const downloadFile = async (responseMessageId: string, fileName: string) => {
    try {
      const blob = await postService.downloadResponseFile(responseMessageId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file. Please try again.');
    }
  };

  const downloadPostFile = async (postMessageId: string, fileName: string) => {
    try {
      const blob = await postService.downloadPostFile(postMessageId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file. Please try again.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    newReply,
    setNewReply,
    replyFiles,
    replyFileErrors,
    fetchPosts,
    createReply,
    handleFileChange,
    downloadFile,
    downloadPostFile
  };
}
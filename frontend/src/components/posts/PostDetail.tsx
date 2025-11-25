import { Box, Typography, Button, TextField, Card, CardContent, IconButton } from '@mui/material';
import { ArrowBack, Reply, AttachFile, Download } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { postService } from '../../services';

interface PostDetailProps {
  post: any;
  onBack: () => void;
  showReplyForm: boolean;
  onToggleReplyForm: () => void;
  replyText: string;
  onReplyChange: (postId: string, text: string) => void;
  onFileChange: (postId: string, file: File | null) => void;
  onSubmitReply: (postId: string, file?: File | null) => void;
  onDownloadFile: (fileId: string, fileName: string) => void;
  onDownloadResponseFile: (fileId: string, fileName: string) => void;
  fileError?: string;
}

export default function PostDetail({ 
  post, 
  onBack, 
  showReplyForm, 
  onToggleReplyForm, 
  replyText, 
  onReplyChange, 
  onSubmitReply,
  onDownloadFile,
  onDownloadResponseFile
}: PostDetailProps) {
  const [responseMessages, setResponseMessages] = useState<any[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [replyFile, setReplyFile] = useState<File | null>(null);
  
  
  const fetchResponses = async () => {
    if (post?.postMessageId) {
      try {
        setLoadingResponses(true);
        const responses = await postService.getResponseMessages(post.postMessageId);
        
        setResponseMessages(responses || []);
      } catch (error) {
        setResponseMessages([]);
      } finally {
        setLoadingResponses(false);
      }
    }
  };
  
  useEffect(() => {
    fetchResponses();
  }, [post?.postMessageId]);
  
  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'transparent' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} sx={{ color: '#ffffff' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 600 }}>
          Post Details
        </Typography>
      </Box>

      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        mb: 3
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
            Post by {post.userName || 'Unknown User'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            {post.description || 'No content'}
          </Typography>
          {post.fileUrl && (
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => onDownloadFile(post.postMessageId, post.fileName || 'post-file.pdf')}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              Download {post.fileName || 'File'}
            </Button>
          )}
          <Typography variant="caption" sx={{ color: '#999' }}>
            Posted on {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
          </Typography>
        </CardContent>
      </Card>



      {/* Responses Section */}
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.95) 0%, rgba(230, 245, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        mb: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#1976d2' }}>
              Responses ({responseMessages.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Reply />}
              onClick={onToggleReplyForm}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              {showReplyForm ? 'Cancel' : 'Add Reply'}
            </Button>
          </Box>
          
          {showReplyForm && (
            <ReplyForm 
              postId={post.postMessageId}
              replyText={replyText}
              onReplyChange={onReplyChange}
              onSubmitReply={(postId, file) => {
                onSubmitReply(postId, file);
                setReplyFile(null);
                setTimeout(() => fetchResponses(), 1000); // Refresh responses after submission
              }}
              onFileChange={setReplyFile}
            />
          )}
          
          {loadingResponses ? (
            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 2 }}>
              Loading responses...
            </Typography>
          ) : responseMessages.length > 0 ? (
            responseMessages.map((response: any, index: number) => (
              <Box key={response.responseMessageId || index} sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.5)', 
                borderRadius: 2,
                borderLeft: '3px solid #1976d2',
                position: 'relative',
                pb: 4
              }}>
                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                  {response.userName || response.userFullName || response.user?.userName || 'Unknown User'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#000', mb: 1 }}>
                  {response.replyText || response.message || 'No response text'}
                </Typography>
                {(() => {
                  const hasFile = response.fileUrl || response.fileName || response.hasFile || response.fileUpload || response.file || response.attachmentUrl || response.attachment;
                  console.log('Response file check:', {
                    responseId: response.responseMessageId,
                    fileUrl: response.fileUrl,
                    fileName: response.fileName,
                    hasFile: response.hasFile,
                    fileUpload: response.fileUpload,
                    file: response.file,
                    attachmentUrl: response.attachmentUrl,
                    attachment: response.attachment,
                    hasFileResult: hasFile
                  });
                  return hasFile;
                })() && (
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => onDownloadResponseFile(response.responseMessageId, response.fileName || response.file || 'response-file.pdf')}
                    size="small"
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Download {response.fileName || 'File'}
                  </Button>
                )}
                <Typography variant="caption" sx={{ color: '#666', position: 'absolute', bottom: 8, right: 8 }}>
                  {(() => {
                    const dateValue = response.repliedAt;
                    if (dateValue) {
                      try {
                        const date = new Date(dateValue);
                        return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                      } catch (error) {
                        return 'Invalid date';
                      }
                    }
                    return 'No date available';
                  })()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', py: 2 }}>
              No responses yet. Be the first to reply!
            </Typography>
          )}
        </CardContent>
      </Card>


    </Box>
  );
}

interface ReplyFormProps {
  postId: string;
  replyText: string;
  onReplyChange: (postId: string, text: string) => void;
  onSubmitReply: (postId: string, file?: File | null) => void;
  onFileChange: (file: File | null) => void;
}

function ReplyForm({ postId, replyText, onReplyChange, onSubmitReply, onFileChange }: ReplyFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileError, setFileError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed');
      event.target.value = '';
      setSelectedFile(null);
      onFileChange(null);
    } else {
      setFileError('');
      setSelectedFile(file);
      onFileChange(file);
    }
  };

  const handleSubmit = async () => {
    // Pass the file directly to the submit function
    onSubmitReply(postId, selectedFile);
    setSelectedFile(null);
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write your reply..."
        value={replyText}
        onChange={(e) => onReplyChange(postId, e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<AttachFile />}
          size="small"
        >
          Attach PDF
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={handleFileChange}
          />
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ color: '#1976d2' }}>
            📎 {selectedFile.name}
          </Typography>
        )}
      </Box>
      {fileError && (
        <Typography variant="body2" sx={{ color: 'error.main', mb: 1 }}>
          {fileError}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!replyText.trim() && !selectedFile}
        size="small"
      >
        Submit Reply
      </Button>
    </Box>
  );
}
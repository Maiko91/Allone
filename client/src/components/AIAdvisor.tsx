import { useState } from 'react';
import { Box, Fab, Dialog, DialogTitle, DialogContent, TextField, IconButton, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAIAdvisor } from '../hooks/useAIAdvisor';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';

export function AIAdvisor() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, loading, error, askQuestion, clearMessages } = useAIAdvisor();
    const { t } = useTranslation();
    const { themeId } = useAppTheme();

    const isDark = themeId === 'dark' || themeId === 'glass';

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        await askQuestion(input);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Chat Bubble */}
            <Fab
                color="primary"
                aria-label="AI Product Advisor"
                onClick={() => setOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: isDark
                        ? 'linear-gradient(135deg, #00e5ff 0%, #ccff00 100%)'
                        : 'primary.main',
                    boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 30px rgba(0, 229, 255, 0.6)',
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                <SmartToyIcon />
            </Fab>

            {/* Chat Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '600px',
                        maxHeight: '80vh',
                        bgcolor: isDark ? 'rgba(10, 10, 10, 0.95)' : 'background.paper',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6">AI Product Advisor</Typography>
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={clearMessages} disabled={messages.length === 0}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
                    {/* Messages Area */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        {messages.length === 0 && (
                            <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
                                <SmartToyIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography variant="body2">
                                    {t('aiAdvisor.welcome', { defaultValue: 'Hi! Ask me anything about product recommendations' })}
                                </Typography>
                                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                    {t('aiAdvisor.example', { defaultValue: 'Example: "What phone under 500€ has the best camera?"' })}
                                </Typography>
                            </Box>
                        )}

                        {messages.map((message) => (
                            <Paper
                                key={message.id}
                                sx={{
                                    p: 2,
                                    maxWidth: '80%',
                                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    bgcolor: message.role === 'user'
                                        ? (isDark ? 'primary.dark' : 'primary.light')
                                        : (isDark ? 'rgba(255,255,255,0.05)' : 'grey.100'),
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="body2" component="div">
                                    {message.role === 'assistant' ? (
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    ) : (
                                        message.content
                                    )}
                                </Typography>
                            </Paper>
                        ))}

                        {loading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} />
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    {t('aiAdvisor.thinking', { defaultValue: 'Thinking...' })}
                                </Typography>
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" onClose={() => { }}>
                                {error}
                            </Alert>
                        )}
                    </Box>

                    {/* Input Area */}
                    <Box sx={{
                        p: 2,
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        gap: 1
                    }}>
                        <TextField
                            fullWidth
                            placeholder={t('aiAdvisor.placeholder', { defaultValue: 'Ask about products...' })}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            size="small"
                            multiline
                            maxRows={3}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            sx={{
                                bgcolor: isDark ? 'primary.dark' : 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: isDark ? 'primary.main' : 'primary.dark'
                                }
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

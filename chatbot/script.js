// API Configuration
const GEMINI_API_KEY = 'AIzaSyB53BxrxG2rpLSpqgCE_xZY_vaiil7m4hE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Rate limiting configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

// Local fallback responses
const FALLBACK_RESPONSES = {
    'hello': 'Hello! I am your CA assistant. How can I help you with financial matters today?',
    'hi': 'Hi there! I specialize in financial and accounting advice. What would you like to know?',
    'help': 'I can help you with various financial topics including:\n\n• Tax planning\n• Accounting principles\n• Financial reporting\n• Budgeting\n• Investment advice\n\nPlease ask me a specific question about any of these areas.',
    'default': 'I apologize, but I am currently experiencing technical difficulties. I can still help you with basic financial information. Please try asking about:\n\n• Tax deductions\n• Accounting standards\n• Financial planning\n• Investment strategies\n\nOr try rephrasing your question.'
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Add event listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

async function handleSendMessage() {
    const message = userInput.value.trim().toLowerCase();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    try {
        // Show loading indicator
        const loadingMessage = addMessage('Thinking...', 'bot');
        
        // Try to get response from Gemini with retry mechanism
        let response;
        try {
            response = await getBotResponseWithRetry(message);
        } catch (error) {
            // If API fails, use local fallback
            response = getLocalResponse(message);
        }
        
        // Remove loading message and add actual response
        loadingMessage.remove();
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Error:', error);
        addMessage('I apologize, but I encountered an error. Please try rephrasing your question or ask about a different financial topic.', 'bot');
    }
}

function getLocalResponse(message) {
    // Check for exact matches first
    if (FALLBACK_RESPONSES[message]) {
        return FALLBACK_RESPONSES[message];
    }
    
    // Check for partial matches
    for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
        if (message.includes(key)) {
            return response;
        }
    }
    
    // Return default response
    return FALLBACK_RESPONSES.default;
}

async function getBotResponseWithRetry(userMessage, retryCount = 0) {
    try {
        return await getBotResponse(userMessage);
    } catch (error) {
        if (error.message.includes('quota') && retryCount < MAX_RETRIES) {
            console.log(`Retrying after quota error (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return getBotResponseWithRetry(userMessage, retryCount + 1);
        }
        throw error;
    }
}

async function getBotResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a professional Chartered Accountant (CA) assistant. Your role is strictly limited to providing financial, accounting, and tax-related advice. If asked about any other topics, politely decline and explain that you can only assist with financial matters. For the following question, provide a concise financial answer or politely decline if it's not related to finance. Format your response with proper spacing between paragraphs and use bullet points (•) for lists. Use double line breaks between paragraphs. Keep your response brief and to the point. Here's the question: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 300,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        // More detailed validation of the response
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
            console.error('Invalid API Response:', data);
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function formatResponse(text) {
    if (!text) return '';
    
    // Split the text into paragraphs
    let paragraphs = text.split('\n\n');
    
    // Format each paragraph
    paragraphs = paragraphs.map(paragraph => {
        // If the paragraph starts with a number or bullet point, format it as a list
        if (/^\d+\.|\*|\-/.test(paragraph.trim())) {
            const lines = paragraph.split('\n');
            const formattedLines = lines.map(line => {
                // Replace bullet points with proper HTML
                line = line.replace(/^\s*[\*\-]\s*/, '• ');
                // Replace numbered lists
                line = line.replace(/^\s*\d+\.\s*/, (match) => match.trim() + ' ');
                return line;
            });
            return formattedLines.join('\n');
        }
        return paragraph;
    });

    // Join paragraphs with double line breaks
    return paragraphs.join('\n\n');
}

function addMessage(content, sender) {
    if (!content) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    // Format the content if it's a bot message
    if (sender === 'bot') {
        content = formatResponse(content);
    }
    
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
} 
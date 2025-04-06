// CA Chatbot Script integrated with Finsight
// API Configuration
const GEMINI_API_KEY = 'AIzaSyAfe1-cKA5s8-EZE37ceK_ZtBYIeccS-AQ';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Rate limiting configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

// Local fallback responses
const FALLBACK_RESPONSES = {
    'hello': 'Hello! I am your CA assistant. How can I help you with financial matters today?',
    'hi': 'Hi there! I specialize in financial and accounting advice. What would you like to know?',
    'help': 'I can help with these financial topics:\n\n• Tax planning\n• Accounting principles\n• Financial reporting\n• Budgeting\n• Investment advice',
    'default': 'I apologize, but I am experiencing connection issues. I can still help with basic topics:\n\n• Tax deductions\n• Accounting standards\n• Financial planning\n• Investment strategies',
    'network_error': 'Network connection issue detected. Please check your internet. I can still help with:\n\n• Tax basics\n• Accounting principles\n• Financial planning\n• Investment options',
    'tax': 'Common tax topics I can help with:\n\n• Income tax planning\n• Tax deductions\n• Corporate taxation\n• Tax compliance\n• GST/HST',
    'accounting': 'Accounting topics I can assist with:\n\n• Bookkeeping basics\n• Financial statements\n• Accounting standards\n• Cost accounting\n• Audit preparation',
    'investment': 'Investment topics I can advise on:\n\n• Portfolio diversification\n• Risk management\n• Retirement planning\n• Asset allocation\n• Tax-efficient investing'
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to check internet connectivity
async function checkInternetConnectivity() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://www.google.com', { 
            mode: 'no-cors',
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        return true;
    } catch (error) {
        console.error('Internet connectivity check failed:', error);
        return false;
    }
}

// Enhanced visual effects
function addChatbotEffects() {
    // Add glowing border effect to the chat container
    const chatContainer = document.querySelector('.chat-container');
    
    // Add glowing effect to the chat header
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.addEventListener('mouseover', function() {
        const h2 = this.querySelector('h2');
        if (h2) {
            h2.style.textShadow = '0 0 20px var(--primary-glow), 0 0 10px rgba(255, 255, 255, 0.4)';
        }
    });
    
    chatHeader.addEventListener('mouseout', function() {
        const h2 = this.querySelector('h2');
        if (h2) {
            h2.style.textShadow = '';
        }
    });
    
    // Add hover effect to messages
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.message-content')) {
            const content = e.target.closest('.message-content');
            content.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15), 0 0 15px var(--chat-glow)';
            content.style.transform = 'translateY(-2px)';
            
            // Add pulsing glow effect
            const messageBg = document.createElement('div');
            messageBg.className = 'message-glow-bg';
            messageBg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: inherit;
                pointer-events: none;
                background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0) 70%);
                filter: blur(8px);
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: -1;
            `;
            
            if (!content.querySelector('.message-glow-bg')) {
                content.style.position = 'relative';
                content.appendChild(messageBg);
                
                setTimeout(() => {
                    messageBg.style.opacity = '1';
                }, 10);
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.message-content')) {
            const content = e.target.closest('.message-content');
            content.style.boxShadow = '';
            content.style.transform = '';
            
            const glowBg = content.querySelector('.message-glow-bg');
            if (glowBg) {
                glowBg.style.opacity = '0';
                setTimeout(() => {
                    glowBg.remove();
                }, 300);
            }
        }
    });
    
    // Add animated background to the chatbot container
    const chatbotContainer = document.querySelector('.chatbot-container');
    if (chatbotContainer) {
        const glowingBackground = document.createElement('div');
        glowingBackground.className = 'chatbot-glow-bg';
        glowingBackground.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70%;
            height: 70%;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
            filter: blur(50px);
            opacity: 0.5;
            z-index: 0;
            animation: chatbotGlowPulse 8s infinite alternate;
        `;
        
        chatbotContainer.appendChild(glowingBackground);
        
        // Add keyframes animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes chatbotGlowPulse {
                0% {
                    opacity: 0.3;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                50% {
                    opacity: 0.5;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                100% {
                    opacity: 0.3;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add event listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    try {
        // Show loading indicator with enhanced animation
        const loadingMessage = addMessage('Thinking...', 'bot');
        loadingMessage.classList.add('thinking');
        
        // Add pulsing dots animation to loading message
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'thinking-dots';
        dotsContainer.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        loadingMessage.querySelector('.message-content').appendChild(dotsContainer);
        
        // Add CSS for thinking animation
        const thinkingStyle = document.createElement('style');
        thinkingStyle.textContent = `
            .thinking-dots span {
                display: inline-block;
                animation: dotPulse 1.4s infinite;
                animation-fill-mode: both;
                margin-left: 2px;
            }
            
            .thinking-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .thinking-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes dotPulse {
                0% { transform: translateY(0); opacity: 0.2; }
                20% { transform: translateY(-5px); opacity: 1; }
                40% { transform: translateY(0); opacity: 0.2; }
                100% { transform: translateY(0); opacity: 0.2; }
            }
        `;
        document.head.appendChild(thinkingStyle);
        
        // Check internet connectivity
        const isConnected = await checkInternetConnectivity();
        if (!isConnected) {
            console.error('No internet connection detected');
            loadingMessage.remove();
            addMessage(FALLBACK_RESPONSES.network_error, 'bot');
            return;
        }

        // Try to get response from Gemini with retry mechanism
        let response;
        try {
            response = await getBotResponseWithRetry(message);
        } catch (error) {
            console.error('API call failed:', error);
            // If API fails, use local fallback
            if (error.message.includes('Network error') || error.message.includes('CORS')) {
                response = FALLBACK_RESPONSES.network_error;
            } else {
                response = getLocalResponse(message.toLowerCase());
            }
        }
        
        // Remove loading message and add actual response
        loadingMessage.remove();
        addMessage(response, 'bot');
        
        // Scroll to the latest message with smooth animation
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
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
        // Handle CORS errors 
        if (error.message.includes('CORS') || error.name === 'TypeError') {
            console.error('CORS or network error detected:', error);
            throw new Error('Network error: Unable to connect to the AI service due to CORS or connectivity issues.');
        }
        
        // Handle quota limits with retry
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
        console.log("Attempting to connect to Gemini API...");
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a professional Chartered Accountant (CA) assistant. Your role is strictly limited to providing financial, accounting, and tax-related advice. If asked about any other topics, politely decline and explain that you can only assist with financial matters.

For the following question, provide a very brief and concise financial answer using these formatting guidelines:
1. Keep responses SHORT - no more than 3-5 bullet points total
2. Format points with simple bullet symbols (•) - never use HTML tags like <br> or <li>
3. Each bullet point should be 1-2 lines maximum
4. Use plain text only - no markdown, no HTML, no special formatting
5. Use simple language that's easy to understand
6. Only provide essential, factual financial information

Here's the question: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 300,
                    topP: 0.8,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            console.error('Error Status:', response.status, response.statusText);
            throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log("Received successful API response");
        
        // More detailed validation of the response
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
            console.error('Invalid API Response:', data);
            throw new Error('Invalid response format from API');
        }

        // Strip any HTML tags from the response
        let cleanResponse = data.candidates[0].content.parts[0].text;
        cleanResponse = cleanResponse.replace(/<[^>]*>/g, '');
        return cleanResponse;
    } catch (error) {
        console.error('API Error Details:', error);
        throw error;
    }
}

function formatResponse(text) {
    if (!text) return '';
    
    // Strip any HTML tags that might be in the response
    text = text.replace(/<[^>]*>/g, '');
    
    // Replace standard bullet markers with HTML bullet points
    text = text.replace(/^[•\*\-]\s+/gm, '• ');
    
    // Split the text into paragraphs
    let paragraphs = text.split('\n\n');
    
    // Format each paragraph
    paragraphs = paragraphs.map(paragraph => {
        // Check if paragraph contains bullet points
        if (paragraph.match(/^[•\*\-]\s+/m) || paragraph.match(/^\d+\.\s+/m)) {
            const lines = paragraph.split('\n');
            const formattedLines = lines.map(line => {
                // Replace bullet points with proper HTML bullet points
                line = line.replace(/^[•\*\-]\s+/, '• ');
                // Format numbered lists consistently
                line = line.replace(/^\d+\.\s+/, match => match);
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
        const formattedText = formatResponse(content);
        
        // Handle HTML content with bullet points
        if (formattedText.includes('•')) {
            // Create a wrapper for better styling
            const textContainer = document.createElement('div');
            textContainer.className = 'formatted-text';
            
            // Split by paragraphs to handle them separately
            const paragraphs = formattedText.split('\n\n');
            
            paragraphs.forEach(paragraph => {
                if (paragraph.includes('•')) {
                    // This is a list paragraph
                    const listPara = document.createElement('div');
                    listPara.className = 'list-paragraph';
                    
                    // Split the paragraph into lines
                    const lines = paragraph.split('\n');
                    
                    lines.forEach(line => {
                        const lineElem = document.createElement('div');
                        lineElem.className = 'list-item';
                        
                        if (line.startsWith('•')) {
                            // Create bullet point with proper styling
                            const bulletSpan = document.createElement('span');
                            bulletSpan.className = 'bullet-point';
                            bulletSpan.textContent = '•';
                            
                            const textSpan = document.createElement('span');
                            textSpan.className = 'bullet-text';
                            textSpan.textContent = line.substring(1).trim();
                            
                            lineElem.appendChild(bulletSpan);
                            lineElem.appendChild(textSpan);
                        } else if (/^\d+\./.test(line)) {
                            // Numbered list item
                            const match = line.match(/^(\d+\.\s*)(.*)/);
                            if (match) {
                                const numberSpan = document.createElement('span');
                                numberSpan.className = 'number-point';
                                numberSpan.textContent = match[1];
                                
                                const textSpan = document.createElement('span');
                                textSpan.className = 'number-text';
                                textSpan.textContent = match[2];
                                
                                lineElem.appendChild(numberSpan);
                                lineElem.appendChild(textSpan);
                            } else {
                                lineElem.textContent = line;
                            }
                        } else {
                            lineElem.textContent = line;
                        }
                        
                        listPara.appendChild(lineElem);
                    });
                    
                    textContainer.appendChild(listPara);
                } else {
                    // Regular paragraph
                    const para = document.createElement('p');
                    para.textContent = paragraph;
                    textContainer.appendChild(para);
                }
            });
            
            messageContent.appendChild(textContainer);
            
            // Add CSS for bullet points styling
            const bulletStyle = document.createElement('style');
            bulletStyle.textContent = `
                .formatted-text {
                    font-family: inherit;
                }
                .list-paragraph {
                    margin-bottom: 15px;
                }
                .list-item {
                    display: flex;
                    margin-bottom: 5px;
                    align-items: baseline;
                }
                .bullet-point, .number-point {
                    display: inline-block;
                    margin-right: 10px;
                    color: #2563eb;
                    font-weight: bold;
                }
                .bullet-text, .number-text {
                    flex: 1;
                }
                p {
                    margin-bottom: 15px;
                    margin-top: 0;
                }
            `;
            
            if (!document.head.querySelector('#bullet-style')) {
                bulletStyle.id = 'bullet-style';
                document.head.appendChild(bulletStyle);
            }
        } else {
            // Regular text without bullet points
            messageContent.textContent = formattedText;
        }
    } else {
        // User message
        messageContent.textContent = content;
    }
    
    if (!messageContent.hasChildNodes()) {
        // If no nodes were added, fall back to plain text
        messageContent.textContent = content;
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Add entry animation
    messageDiv.style.animationDuration = '0.5s';
    messageDiv.style.animationDelay = '0.1s';
    
    // After animation, add subtle glow to new message
    setTimeout(() => {
        messageContent.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(37, 99, 235, 0.2)';
        setTimeout(() => {
            messageContent.style.boxShadow = '';
            messageContent.style.transition = 'all 0.3s ease';
        }, 1000);
    }, 500);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Initialize the chatbot UI with enhanced effects
document.addEventListener('DOMContentLoaded', function() {
    addChatbotEffects();
    
    // Focus on input field
    if (userInput) {
        setTimeout(() => {
            userInput.focus();
        }, 500);
    }
    
    // Add floating particles in the background
    const chatContainer = document.querySelector('.chatbot-container');
    if (chatContainer) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 8 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 30 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(37, 99, 235, ${Math.random() * 0.2 + 0.1});
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                filter: blur(${size/2}px);
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: floatParticle ${duration}s infinite alternate ease-in-out;
                animation-delay: -${delay}s;
                pointer-events: none;
            `;
            
            chatContainer.appendChild(particle);
        }
        
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                }
                100% {
                    transform: translateY(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 50 + 20}px) 
                               translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 50 + 20}px);
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
}); 
# Finsight - Financial Management Platform

A comprehensive financial management platform that combines AI-powered analysis with human insights to transform financial decision-making.

## Project Overview

Finsight is a modern web-based financial management platform that integrates multiple tools to help users track expenses, monitor investments, and get financial advice. The platform features a clean, responsive UI with modern animations and interactive elements.

## Features

### Core Mini-Projects

1. **CA Chatbot**
   - AI-powered chatbot for financial advice and tax-related queries
   - Integration with Gemini API for intelligent responses
   - Error handling and fallback mechanisms
   - Real-time conversation interface

2. **Expense Tracker**
   - Intuitive expense tracking with categorization
   - Interactive charts for expense visualization (bar, pie charts)
   - Calendar view for daily expense tracking
   - Local storage for data persistence
   - Data refresh functionality

3. **Stock Market Tracker**
   - Real-time stock data using Finnhub API
   - Search functionality for stocks
   - Multiple API key rotation for handling rate limits
   - Throttling mechanism to prevent API overuse
   - Fallback to demo data when API limits are reached

### Platform Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **User Authentication**: Login/signup functionality with secure storage
- **Modern UI**: Interactive animations, card hover effects, glowing elements
- **Smooth Navigation**: Scroll effects and intuitive menu system

## Authentication System

### Mangools-Inspired Design

The platform features a modern authentication system with login and signup pages inspired by the Mangools design:

- **Login Page**: Clean, minimalist design with email/password fields
  - Social login options (Google, Facebook, Twitter)
  - "Remember me" functionality
  - Password recovery option
  - Form validation for improved UX

- **Signup Page**: Modern user registration flow
  - Email verification process
  - Password strength requirements
  - Terms of service and privacy policy consent
  - Social signup integration

- **User Authentication Flow**:
  - Secure token-based authentication
  - User session management
  - Persistent login with local storage
  - Profile customization options

- **Visual Design Elements**:
  - Consistent branding with the main platform
  - Subtle animations for form interactions
  - Error feedback for invalid inputs
  - Success confirmations for completed actions

- **Security Features**:
  - Client-side input validation
  - XSS protection measures
  - CSRF token implementation
  - Secure password handling

## Technical Implementations

### API Integrations

- **Gemini API**: For the CA Chatbot's AI capabilities
- **Finnhub API**: For real-time stock market data
- **Alpha Vantage API**: Previously used for stock data (replaced with Finnhub)

### Performance Enhancements

- **API Key Rotation**: System to rotate between multiple API keys to avoid rate limiting
- **Error Handling**: Comprehensive error handling across all components
- **Loading States**: Visual feedback during data loading
- **Throttling**: Preventing excessive API calls

### UI/UX Improvements

- **Interactive Elements**: Hover effects, glowing buttons, animations
- **Card Design**: Modern card-based interface for features and projects
- **Dynamic Content**: Content that reveals as users scroll
- **Mobile Responsiveness**: Custom layouts for different screen sizes

## Recent Updates

1. **Stock Market Tracker**:
   - Switched from Alpha Vantage to Finnhub API for higher limits
   - Implemented API key rotation system
   - Added better error handling and fallback to demo data

2. **Expense Tracker**:
   - Fixed bar chart visibility issues
   - Added direct refresh functionality
   - Improved chart rendering
   - Enhanced UI with better feedback

3. **Platform UI**:
   - Removed "Fintech Insights" project
   - Streamlined the hero section
   - Added "Get Started" button functionality
   - Enhanced mobile responsiveness

4. **Authentication System**:
   - Implemented Mangools-inspired login and signup pages
   - Added form validation and error handling
   - Implemented secure authentication flow
   - Created responsive design for all device sizes

## Technologies Used

- HTML5/CSS3 for structure and styling
- Vanilla JavaScript for functionality
- CSS animations and transitions for UI effects
- Local Storage API for data persistence
- External APIs for data (Finnhub, Gemini)
- Font Awesome for icons

## Usage

1. The platform offers three main tools accessible from the Projects section
2. Each tool operates independently but shares the common Finsight branding
3. Users can sign up/log in to save their preferences
4. The "Get Started" button on the homepage guides users to the available tools

## Installation

No installation required - this is a web-based platform.

## Credits

Developed as a full-stack demonstration project showcasing UI design, API integration, and modern web development techniques.

## Future Plans

- Add portfolio management capabilities
- Integrate more financial data sources
- Implement user data synchronization across devices
- Add more AI-powered insights across all tools

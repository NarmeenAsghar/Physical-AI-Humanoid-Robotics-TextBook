# Chatbot Integration Thoughts for Physical AI & Humanoid Robotics Textbook

## Objective
To integrate an interactive RAG (Retrieval Augmented Generation) chatbot into the Docusaurus textbook site, providing context-aware answers to user queries based on the textbook content.

## Current Status
- Chatbot UI backend is **NOT YET READY**. This document captures the UI integration strategy for future implementation.
- Homepage enhancement and multilingual (English/Urdu) setup of the Docusaurus site are complete.

## Chosen Chatbot UI Integration Approach
- **Embedded Chatbot on Each Page**: The chatbot UI will be integrated as a persistent widget or component that appears on *every page* of the Docusaurus site, providing continuous accessibility to users.
- **UI Framework**: OpenAI ChatKit SDK (`https://platform.openai.com/docs/guides/custom-chatkit`, `https://github.com/openai/chatkit-python/`). This SDK is chosen for its focus on custom chat UIs and seamless integration with OpenAI models.

## Technical Considerations for UI Integration

### 1. Docusaurus Integration Strategy
To achieve a site-wide embedded chatbot, the most likely approach will involve **Docusaurus Theme Swizzling**:
- **Identify Target Component**: The chatbot component will likely need to be injected into a high-level theme component, such as `Layout.js` or `Navbar.js`, to ensure its presence on all pages.
- **Swizzling Process**: Use `docusaurus swizzle @docusaurus/theme-classic [ComponentName]` to eject and customize the relevant theme component. This allows injecting custom React code (the ChatKit component) while retaining Docusaurus's theme structure.

### 2. Chatbot Component Development (`docs/src/components/ChatbotWidget.tsx`)
- A dedicated React component will encapsulate the ChatKit UI logic and rendering.
- This component will handle:
    - Initializing the ChatKit client.
    - Managing chat state (messages, user input, loading indicators).
    - Displaying chat history.
    - Sending user queries to the backend.
    - Rendering responses from the backend.
    - Basic UI elements (input field, send button, message display area).

### 3. Backend Communication
- The `ChatbotWidget.tsx` component will communicate with the RAG chatbot backend (e.g., FastAPI server) via its defined API endpoints.
- Communication will likely be over REST (HTTP POST requests for queries) or potentially WebSockets for real-time interaction, depending on the backend implementation.
- **Authentication/Authorization**: Future consideration for securing the chatbot API calls if user authentication is implemented.

### 4. UI/UX Considerations
- **Visibility**: Decide if the chatbot is always visible (e.g., small floating button) or initially hidden and activated by a toggle.
- **Responsiveness**: Ensure the chatbot UI is responsive and works well on various screen sizes (desktop, tablet, mobile).
- **Styling**: Integrate the chatbot's visual design with the existing Docusaurus theme using CSS modules or inline styles.

### 5. Internationalization (i18n)
- The chatbot UI itself will need to support the configured locales (English and Urdu). ChatKit's capabilities for i18n will need to be explored.
- Any hardcoded strings within the `ChatbotWidget.tsx` component will need to be translated using Docusaurus's i18n system.

## Future Implementation Steps (after book deployment)
1.  **Develop Chatbot Backend**: Implement the RAG chatbot backend (e.g., FastAPI with Neon Postgres and Qdrant) as per the project constitution.
2.  **Design Chatbot API**: Define clear API contracts for communication between the UI and backend.
3.  **Implement Chatbot UI (`ChatbotWidget.tsx`)**: Build the React component using the ChatKit SDK.
4.  **Integrate with Docusaurus Theme**: Use theme swizzling to embed the `ChatbotWidget.tsx` component site-wide.
5.  **Local Testing**: Thoroughly test the chatbot functionality, UI, and i18n locally.
6.  **Deployment**: Deploy the integrated chatbot as part of the Docusaurus site.
7.  **Create PHR**: Document the entire chatbot implementation process.

## References
- OpenAI ChatKit SDK:
    - Documentation: `https://platform.openai.com/docs/guides/custom-chatkit`
    - GitHub Repository: `https://github.com/openai/chatkit-python/`
- Docusaurus Theme Swizzling: `https://docusaurus.io/docs/advanced/swizzling`

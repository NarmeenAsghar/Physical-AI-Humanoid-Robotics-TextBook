"""
LLM service using Gemini 1.5 Flash via OpenAI SDK with custom base URL.
Generates chatbot responses with streaming support.
"""

from typing import AsyncGenerator, List, Dict
from openai import AsyncOpenAI

from ..config.settings import settings


class LLMService:
    """Handles LLM interactions with Gemini via OpenAI SDK."""

    def __init__(self):
        """Initialize Gemini client using OpenAI SDK with custom base URL."""
        # Create OpenAI client pointing to Gemini API
        self.client = AsyncOpenAI(
            api_key=settings.gemini_api_key, base_url=settings.gemini_base_url
        )

    def get_system_prompt(self, selected_text: str = None) -> str:
        """
        Generate system prompt for the chatbot.

        Args:
            selected_text: Optional text selected by user

        Returns:
            System prompt string
        """
        base_prompt = """You are an intelligent learning assistant for the "Physical AI & Humanoid Robotics" textbook.

Your role:
- Answer questions ONLY from the provided textbook content
- Provide accurate, clear explanations suitable for students
- Cite sources (Chapter, Lesson, Section) in your responses
- If a question is outside the textbook scope, politely indicate this and suggest relevant textbook topics
- Maintain a helpful, educational tone

Guidelines:
- Use the context provided from the textbook to answer questions
- Don't make up information not in the textbook
- For navigation queries ("Where can I learn about X?"), provide direct links to relevant lessons
- For study guidance ("What should I study next?"), recommend based on the curriculum structure
"""

        if selected_text:
            base_prompt += f'\n\nThe user has selected this text for context:\n"{selected_text}"\n\nReference this selection when relevant to their question.'

        return base_prompt

    async def generate_response(
        self,
        query: str,
        context: str,
        conversation_history: List[Dict] = None,
        selected_text: str = None,
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming response using Gemini.

        Args:
            query: User's question
            context: Retrieved context from RAG
            conversation_history: Previous messages
            selected_text: Optional selected text

        Yields:
            Response chunks as they're generated
        """
        # Build messages
        messages = [
            {"role": "system", "content": self.get_system_prompt(selected_text)}
        ]

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Last 5 messages

        # Add current query with context
        user_message = f"""Context from the textbook:
{context}

Student's question: {query}

Please answer the question using the provided context. Include source citations (Chapter X, Lesson Y, Section Z) in your response."""

        messages.append({"role": "user", "content": user_message})

        # Stream response from Gemini
        try:
            response = await self.client.chat.completions.create(
                model=settings.chat_model,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000,
            )

            async for chunk in response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            yield f"Error generating response: {str(e)}"

    async def generate_response_text(
        self,
        query: str,
        context: str,
        conversation_history: List[Dict] = None,
        selected_text: str = None,
    ) -> str:
        """
        Generate complete response as a single string (non-streaming).

        Args:
            query: User's question
            context: Retrieved context from RAG
            conversation_history: Previous messages
            selected_text: Optional selected text

        Returns:
            Complete response text
        """
        # Build messages
        messages = [
            {"role": "system", "content": self.get_system_prompt(selected_text)}
        ]

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Last 5 messages

        # Add current query with context
        user_message = f"""Context from the textbook:
{context}

Student's question: {query}

Please answer the question using the provided context. Include source citations (Chapter X, Lesson Y, Section Z) in your response."""

        messages.append({"role": "user", "content": user_message})

        # Get complete response
        try:
            response = await self.client.chat.completions.create(
                model=settings.chat_model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"Error generating response: {str(e)}"

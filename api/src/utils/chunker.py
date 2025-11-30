"""
Markdown content chunking utility.
Splits markdown files by ## headings for better embedding granularity.
"""

import re
from typing import List, Dict, Any
from pathlib import Path


class MarkdownChunker:
    """Chunks markdown content by section headings."""

    def __init__(self):
        # Pattern to match ## headings (but not # or ###)
        self.heading_pattern = re.compile(r"^## (.+)$", re.MULTILINE)

    def chunk_by_headings(
        self, content: str, metadata: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Split markdown content into chunks by ## headings.

        Args:
            content: Markdown file content
            metadata: Base metadata (chapter, lesson, url)

        Returns:
            List of chunks with content and metadata
        """
        chunks = []

        # Split by ## headings
        sections = self.heading_pattern.split(content)

        # First section is before any ## heading (intro/frontmatter)
        if sections and sections[0].strip():
            intro_content = self._clean_content(sections[0])
            if intro_content:
                chunks.append(
                    {"content": intro_content, "section": "Introduction", **metadata}
                )

        # Process remaining sections (heading + content pairs)
        for i in range(1, len(sections), 2):
            if i + 1 < len(sections):
                heading = sections[i].strip()
                section_content = self._clean_content(sections[i + 1])

                if section_content:
                    chunks.append(
                        {"content": section_content, "section": heading, **metadata}
                    )

        return chunks

    def _clean_content(self, content: str) -> str:
        """
        Clean markdown content by removing frontmatter and excess whitespace.

        Args:
            content: Raw content to clean

        Returns:
            Cleaned content string
        """
        # Remove YAML frontmatter (between --- markers)
        content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)

        # Remove multiple consecutive blank lines
        content = re.sub(r"\n{3,}", "\n\n", content)

        # Strip leading/trailing whitespace
        content = content.strip()

        return content

    def extract_metadata_from_path(
        self, filepath: Path, base_url: str = ""
    ) -> Dict[str, Any]:
        """
        Extract chapter, lesson, and URL from file path.

        Args:
            filepath: Path to markdown file
            base_url: Optional base URL prefix (default: "" for relative URLs)

        Returns:
            Metadata dict with chapter, lesson, url

        Example:
            docs/docs/chapter-01-foundations/lesson-01-intro.md
            -> {chapter: 1, lesson: 1, url: "/docs/chapter-01-foundations/lesson-01-intro"}
        """
        # Extract chapter number from directory name
        chapter_match = re.search(r"chapter-(\d+)", str(filepath))
        chapter = int(chapter_match.group(1)) if chapter_match else 0

        # Extract lesson number from filename
        lesson_match = re.search(r"lesson-(\d+)", filepath.name)
        lesson = int(lesson_match.group(1)) if lesson_match else 0

        # Generate URL path (remove .md and adjust path)
        url_path = str(filepath).replace("\\", "/")
        # Remove everything before /docs/
        if "/docs/docs/" in url_path:
            url_path = "/docs/" + url_path.split("/docs/docs/")[1]
        # Remove .md extension
        url_path = url_path.replace(".md", "")

        # Prepend base URL if provided
        if base_url:
            url_path = base_url.rstrip("/") + url_path

        return {"chapter": chapter, "lesson": lesson, "url": url_path}

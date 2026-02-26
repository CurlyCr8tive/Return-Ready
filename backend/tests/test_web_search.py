import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

def test_web_search():
    """
    Simple test to confirm Claude web search
    is working correctly.
    """

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        tools=[
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        messages=[
            {
                "role": "user",
                "content": (
                    "What is the single most important "
                    "AI news story from the past 7 days? "
                    "Give me the headline, a 2 sentence "
                    "summary, and the source."
                )
            }
        ]
    )

    # Extract text from all content blocks
    result = ""
    for block in response.content:
        if block.type == "text":
            result += block.text

    print("Web search result:")
    print(result)
    print(f"\nStop reason: {response.stop_reason}")
    print(f"Content blocks: {len(response.content)}")

if __name__ == "__main__":
    test_web_search()

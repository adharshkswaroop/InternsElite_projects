"""Minimal OpenAI-compatible JSON provider with explicit credentials."""

import json
from dataclasses import dataclass
from urllib.request import Request, urlopen


@dataclass(frozen=True, slots=True)
class OpenAICompatibleConfig:
    """Connection details supplied through runtime environment configuration."""

    base_url: str
    api_key: str
    model: str
    timeout_seconds: float = 30.0


class OpenAICompatibleProvider:
    """Call an OpenAI-compatible chat-completions API on explicit request."""

    def __init__(self, config: OpenAICompatibleConfig) -> None:
        if not config.api_key:
            raise ValueError("An LLM API key is required for remote insight generation")
        self.config = config

    def generate_json(self, prompt: str) -> str:
        """Request JSON output without logging credentials or prompt content."""
        payload = {
            "model": self.config.model,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
            "temperature": 0,
        }
        request = Request(
            f"{self.config.base_url.rstrip('/')}/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.config.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urlopen(request, timeout=self.config.timeout_seconds) as response:  # noqa: S310
            body = json.loads(response.read().decode("utf-8"))
        try:
            return str(body["choices"][0]["message"]["content"])
        except (KeyError, IndexError, TypeError) as error:
            raise ValueError(
                "LLM provider response did not contain assistant JSON content"
            ) from error

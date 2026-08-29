# Evidence-Grounded LLM Business Insights

## Purpose

The optional LLM layer turns supplied, aggregated evidence into an executive summary and evidence-cited actions. It does not calculate deterministic metrics, replace ML outputs, or access raw data on its own.

## Safety and traceability

- `InsightRequest` accepts structured evidence with unique IDs and sources.
- The prompt explicitly prohibits invention and requires citations.
- `BusinessInsight` is schema-validated before use.
- Output is rejected if it cites IDs absent from the request.
- API credentials are supplied only at runtime through environment variables; they are never logged.

## Provider configuration

`OpenAICompatibleProvider` supports a compatible chat-completions API with `LLM_BASE_URL`, `LLM_API_KEY`, and `LLM_MODEL`. It is not invoked by default and no remote provider was contacted in this milestone.

## Limitations

Citation validation confirms that cited IDs were provided, not that every wording choice is semantically entailed by the source. Production use should keep the evidence shown alongside generated text and add human review for consequential decisions.

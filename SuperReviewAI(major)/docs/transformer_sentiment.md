# Transformer Sentiment Inference

## Milestone 4 implementation

The project now provides a CPU-first adapter for Hugging Face text-classification models. The default configuration names `distilbert-base-uncased-finetuned-sst-2-english`, a compact DistilBERT model fine-tuned for English binary sentiment.

The adapter does not load weights during application import or test execution. Its default `local_files_only=True` prevents unintentional downloads. To intentionally permit a download, run:

`python scripts/run_transformer_inference.py "review text" --allow-download`

## Output

Each prediction contains the normalized sentiment label, returned model confidence, model identifier, and measured inference latency. Latency is per request for a single review or averaged per review for a batch. These fields are runtime measurements, not pre-populated benchmark values.

## Limitations

- No transformer weights were downloaded or run in this milestone.
- The default model is binary; `LABEL_0` and `LABEL_1` normalize to negative and positive respectively.
- Neutral sentiment requires a compatible three-class model configuration and real evaluation.
- Fine-tuning, hyperparameter selection, and transformer evaluation are still pending.

# Initial ML Pipeline

## Milestone 3 scope

This milestone implements an auditable preprocessing and baseline-training path. It does not contain a trained model artifact, executed metrics, a transformer model, aspect extraction, topic modeling, or embeddings.

## Representations

For every input review, `prepare_sentiment_frame` retains:

- `raw_text`: the original source text;
- `ml_cleaned_text`: Unicode-normalized text with HTML and URLs removed, whitespace normalized, and lowercased;
- `sentiment_label`: a transparent rating-derived target (`1–2` negative, `3` neutral, `4–5` positive).

Stopword and punctuation removal are intentionally avoided. Transformer inference will use raw text in a later milestone.

## Baseline

The initial baseline is TF-IDF (unigrams and bigrams) plus Logistic Regression. `scripts/train_baseline.py` uses a fixed random seed and a stratified held-out split, rejects insufficient class counts, and writes actually executed results to `artifacts/metrics/sentiment_metrics.json`.

Run it only after acquiring a permitted local CSV:

`python scripts/train_baseline.py path/to/reviews.csv`

The output directory is ignored by Git. No metrics exist in this repository yet.

## Planned comparisons

Random Forest, XGBoost, and transformer comparisons remain future work. They will be added only with reproducible configurations and actual evaluation evidence.

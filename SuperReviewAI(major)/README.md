# Customer Review Intelligence Platform

An incremental, production-oriented NLP project that turns customer reviews into auditable business intelligence. The current implementation is **Milestone 1**: repository foundations and a minimal FastAPI service. No dataset, model, metrics, dashboard values, screenshots, or deployment results have been produced yet.

## Problem Statement

Customer feedback is valuable but difficult to analyze at scale. This project will provide a reproducible workflow for ingesting reviews, validating data, analyzing sentiment and aspects, and exposing evidence-backed analytics.

## Current Features

- Versioned FastAPI application with `/health`, `/ready`, and `/api/v1/health`.
- Python packaging, pytest, and Ruff configuration.
- Docker configuration for the backend.
- Modular placeholders for the planned backend, ML, data, documentation, and deployment layers.
- Deterministic text preparation and a train-on-demand TF-IDF + Logistic Regression baseline.
- CPU-first, opt-in transformer sentiment inference with a DistilBERT default.
- Rule-based aspect extraction, NMF topic discovery, and FAISS semantic-search foundations.
- Evidence-grounded, provider-agnostic optional LLM insight generation.

# Super View AI Frontend

Super View AI is a customer review intelligence workspace for aspect-based sentiment analysis, topic discovery, semantic search, model evaluation, and ML operations monitoring.

## Features and Workflow

These images indicate the features and workflow pipeline of the project:

1. **Executive Dashboard:** Review customer sentiment, ratings, friction aspects, and extracted product concerns.
2. **Topic Discovery:** Explore BERTopic clusters and 2D UMAP embeddings to identify recurring review themes.
3. **Model Monitoring:** Compare registered models using accuracy, F1 scores, latency, and deployment status.
4. **Telemetry and Health:** Monitor service health, Prometheus metrics, inference performance, drift, and audit logs.
5. **Sentiment Analysis Breakdown:** Inspect aspect-level sentiment distribution, rating alignment, review trends, and high-signal customer feedback.

### Workflow Screens

<p align="center">
  <img src="./assets/Screenshot 2026-08-29 092040.png" alt="Executive dashboard" width="820" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-08-29 092250.png" alt="Topic discovery and BERTopic clusters" width="820" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-08-29 092401.png" alt="MLflow model registry and benchmark leaderboard" width="820" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-08-29 092426.png" alt="Admin telemetry and system health" width="820" />
</p>

<p align="center">
  <img src="./assets/Screenshot 2026-08-29 092638.png" alt="Sentiment analysis breakdown" width="820" />
</p>

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the [.env.local](.env.local)
3. Run the app:
   `npm run dev`


## Architecture

See [architecture documentation](docs/architecture.md). The diagram is a target architecture, not a deployed-infrastructure claim.

## Installation and local development

Create a virtual environment, install `.[dev]`, then run `uvicorn backend.app.main:app --reload`. Open `http://127.0.0.1:8000/docs` for generated OpenAPI documentation.

## Testing

Run `pytest` and `ruff check .`.

## Docker

Run `docker compose up --build backend`. Only the backend container is configured in Milestone 1. Database, frontend, MLflow, Airflow, monitoring, and AWS deployment are not yet implemented.

## Dataset, results, and deployment

No dataset has been selected or acquired. No metrics, screenshots, badges, or deployment claims are present. Dataset licensing and experimental results will be documented only after actual reproducible execution.

## Academic Integrity

This project will document third-party datasets, models, libraries, and APIs as they are adopted. Experimental results will be reported only after reproducible execution.

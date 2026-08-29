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

<img src="../assets/Screenshot 2026-08-29 092040.png" alt="Executive dashboard" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="../assets/Screenshot 2026-08-29 092250.png" alt="Topic discovery and BERTopic clusters" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="../assets/Screenshot 2026-08-29 092401.png" alt="MLflow model registry and benchmark leaderboard" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="../assets/Screenshot 2026-08-29 092426.png" alt="Admin telemetry and system health" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

<img src="../assets/Screenshot 2026-08-29 092638.png" alt="Sentiment analysis breakdown" width="820" style="display:block; margin:16px auto; max-width:100%; height:auto;" />

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

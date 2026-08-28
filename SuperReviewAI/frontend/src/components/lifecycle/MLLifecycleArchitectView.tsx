import React, { useState } from 'react';
import { 
  Compass, 
  Database, 
  Wrench, 
  BarChart3, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Cloud, 
  Activity, 
  ArrowRight, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Code2, 
  Lightbulb, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  AlertCircle, 
  ChevronRight,
  Workflow,
  Download,
  Flame
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NavView } from '../layout/Sidebar';

interface MLLifecycleArchitectViewProps {
  onNavigateToView?: (view: NavView) => void;
}

export const MLLifecycleArchitectView: React.FC<MLLifecycleArchitectViewProps> = ({
  onNavigateToView
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeStage, setActiveStage] = useState<number>(1);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Stage 1 Interactive State: Requirement Builder
  const [projectTitle, setProjectTitle] = useState('SUPER VIEW AI - Customer Review Intelligence & ABSA');
  const [businessGoal, setBusinessGoal] = useState('Reduce customer churn by 18% and automate root-cause triage across 120k+ e-commerce product reviews using fine-grained aspect sentiment and vector search.');
  const [targetLatency, setTargetLatency] = useState('P95 < 25ms per review');
  const [targetF1, setTargetF1] = useState('Macro F1 >= 0.90');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const toggleStageCompletion = (stageNum: number) => {
    if (completedStages.includes(stageNum)) {
      setCompletedStages(completedStages.filter(s => s !== stageNum));
    } else {
      setCompletedStages([...completedStages, stageNum].sort((a, b) => a - b));
    }
  };

  const runCodeSimulation = (stageNum: number, outputText: string) => {
    setIsExecuting(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionOutput(outputText);
    }, 850);
  };

  const stages = [
    {
      num: 1,
      title: "STAGE 1: REQUIREMENT GATHERING",
      shortName: "Requirements & KPIs",
      icon: Compass,
      tag: "Business Problem & Constraints",
      linkedView: 'overview' as NavView,
      summary: "Define the business problem, stakeholder requirements, success metrics (KPIs), and architectural constraints.",
      keyDeliverables: [
        "Business Objective: Automate extraction of component-level product friction.",
        "Primary KPI: >90% Macro F1 Score on 3-class sentiment, P95 Latency < 25ms.",
        "System Constraints: Must run on CPU/Edge container without GPU requirement.",
        "Stakeholders: Product Managers, Hardware Engineering, CX Operations."
      ],
      codeTemplate: `# Stage 1: Requirement Specification & Business KPI Tracker
from pydantic import BaseModel, Field
from typing import List

class MLProjectSpecification(BaseModel):
    project_name: str = "SUPER VIEW AI"
    business_goal: str = "Automate ABSA & Root Cause Triage across reviews"
    target_accuracy_f1: float = Field(ge=0.88, default=0.91)
    latency_sla_ms: int = Field(le=30, default=20)
    supported_aspects: List[str] = [
        "battery", "display", "camera", "customer_support", "delivery", "price"
    ]
    deployment_target: str = "AWS SageMaker / FastAPI Container"

spec = MLProjectSpecification()
print(f"ML Pipeline Specification Configured: {spec.project_name}")
print(f"Target Latency: {spec.latency_sla_ms}ms | F1 Target: {spec.target_accuracy_f1}")
`,
      simulationOutput: `[STAGE 1 VERIFICATION: PASSED]
>> Project: SUPER VIEW AI
>> Stakeholder Alignment: 100%
>> SLA Latency Threshold: 20ms
>> Success KPIs Configured: Macro F1 >= 0.91, Aspect Accuracy >= 92.5%`
    },
    {
      num: 2,
      title: "STAGE 2: DATA COLLECTION",
      shortName: "Data Ingestion & APIs",
      icon: Database,
      tag: "APIs, Scraping & Streaming",
      linkedView: 'explorer' as NavView,
      summary: "Ingest customer reviews from multi-channel sources (REST APIs, Shopify Webhooks, App Store scrapers, Kaggle/S3 buckets).",
      keyDeliverables: [
        "Multi-source schema connector for Amazon, BestBuy & App Store reviews.",
        "Rate-limiting and exponential backoff fetching strategies.",
        "Raw data landing in S3/MinIO bucket in Parquet/JSONL format.",
        "Data validation schemas with Pydantic / Great Expectations."
      ],
      codeTemplate: `# Stage 2: Robust Data Ingestion Pipeline (FastAPI / Requests / S3)
import asyncio
import httpx
import pandas as pd
from datetime import datetime

async def ingest_customer_reviews(product_ids: list[str]) -> pd.DataFrame:
    records = []
    async with httpx.AsyncClient(timeout=10.0) as client:
        for pid in product_ids:
            # Simulate enterprise API ingestion
            response = await client.get(f"https://api.superview.ai/v1/feed/{pid}")
            if response.status_code == 200:
                data = response.json()
                for item in data.get("reviews", []):
                    records.append({
                        "review_id": item["id"],
                        "product_name": item["product"],
                        "review_text": item["text"],
                        "rating": float(item["rating"]),
                        "timestamp": datetime.utcnow().isoformat()
                    })
    return pd.DataFrame(records)

# Ingested dataset summary
print("Ingestion engine initialized. Schema validation ready.")
`,
      simulationOutput: `[STAGE 2 INGESTION COMPLETE]
>> Ingested 12,492 review records from 5 marketplace endpoints.
>> Zero network dropped packets. All records validated against Pydantic schema.
>> Stored raw partitions to s3://superview-ai-datalake/raw/2026/08/`
    },
    {
      num: 3,
      title: "STAGE 3: DATA PREPARATION",
      shortName: "Data Cleaning & Prep",
      icon: Wrench,
      tag: "Preprocessing & Normalization",
      linkedView: 'explorer' as NavView,
      summary: "Clean and preprocess raw text data with Pandas/PySpark: deduplication, HTML stripping, emoji normalization, and outlier removal.",
      keyDeliverables: [
        "Deduplication using MinHash LSH and cosine text similarity.",
        "Unicode regex cleaning, contraction expansion, and lowercase normalization.",
        "Null value imputation and verified purchase filtering.",
        "Sentence boundary segmentation for Aspect Tagger."
      ],
      codeTemplate: `# Stage 3: High-Performance Data Cleaning Pipeline
import re
import html
import pandas as pd

def clean_review_text(raw_text: str) -> str:
    # 1. Unescape HTML entities
    text = html.unescape(raw_text)
    # 2. Strip URLs & tracking query parameters
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # 3. Normalize repeated whitespace & special punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    # 4. Filter bot spam or zero-length reviews
    if len(text) < 5:
        return ""
    return text

def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df["cleaned_text"] = df["review_text"].astype(str).apply(clean_review_text)
    df = df[df["cleaned_text"].str.len() > 0].copy()
    df.drop_duplicates(subset=["cleaned_text"], inplace=True)
    return df

print("Data Preparation pipeline compiled. Deduplication and Unicode cleaners active.")
`,
      simulationOutput: `[STAGE 3 CLEANING FINISHED]
>> Input rows: 12,492 | Cleaned & Deduplicated: 12,458 (34 duplicates removed)
>> Removed 142 HTML tags and normalized 318 emoji sentiment tokens.
>> Null text entries: 0 | Data quality score: 100%`
    },
    {
      num: 4,
      title: "STAGE 4: EXPLORATORY DATA ANALYSIS (EDA)",
      shortName: "Exploratory EDA",
      icon: BarChart3,
      tag: "Distributions & Correlations",
      linkedView: 'sentiment' as NavView,
      summary: "Analyze review length distributions, star rating correlations, bi-gram frequencies, and aspect mention distributions using Seaborn/Plotly.",
      keyDeliverables: [
        "Star-rating vs sentiment discrepancy analysis (1-star vs positive text).",
        "Token length histograms for transformer context-window optimization (max_seq_len=128).",
        "Aspect co-occurrence frequency matrices.",
        "Class balance evaluation: Positive (62%), Neutral (14%), Negative (24%)."
      ],
      codeTemplate: `# Stage 4: Statistical EDA & Discrepancy Analysis
import numpy as np
import pandas as pd

def run_eda_profiling(df: pd.DataFrame) -> dict:
    df["token_length"] = df["cleaned_text"].apply(lambda t: len(t.split()))
    p95_length = np.percentile(df["token_length"], 95)
    
    # Check for rating vs text dissonance
    # (e.g. 5-star rating with words like 'terrible', 'broken')
    negative_words = {"terrible", "broken", "worst", "overheating", "defective"}
    dissonance_cases = df[
        (df["rating"] >= 4.0) & 
        (df["cleaned_text"].apply(lambda x: any(w in x.lower() for w in negative_words)))
    ]
    
    return {
        "mean_tokens": float(df["token_length"].mean()),
        "p95_token_len": int(p95_length),
        "dissonance_rate": len(dissonance_cases) / len(df)
    }

print("EDA module initialized. Context length and polarity correlations mapped.")
`,
      simulationOutput: `[STAGE 4 EDA INSIGHTS]
>> Token Distribution: Mean = 34.2 tokens, P95 = 84 tokens (Ideal for DistilBERT 128 max_len).
>> Rating Skew: 71.4% 4-5 Stars, 18.2% 1-2 Stars, 10.4% 3 Stars.
>> Text-Rating Dissonance: 4.8% of reviews show high text friction despite high star ratings.`
    },
    {
      num: 5,
      title: "STAGE 5: FEATURE ENGINEERING",
      shortName: "Feature Engineering",
      icon: Cpu,
      tag: "BIO Aspect Tags & Embeddings",
      linkedView: 'absa' as NavView,
      summary: "Transform text into dense semantic embeddings (Sentence-Transformers all-MiniLM-L6-v2) and BIO entity sequence tokens for ABSA.",
      keyDeliverables: [
        "Tokenization & sub-word masking using Hugging Face AutoTokenizer.",
        "128-dimensional dense vector embeddings generation for FAISS indexing.",
        "BIO aspect tagging schema (B-BATTERY, I-BATTERY, B-CAMERA, O).",
        "VADER / RoBERTa polarity lexical polarity feature vectors."
      ],
      codeTemplate: `# Stage 5: Dense Feature Embeddings & BIO Aspect Encoding
import torch
from transformers import AutoTokenizer, AutoModel

class FeatureEngineeringPipeline:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()

    def generate_dense_embeddings(self, texts: list[str]) -> torch.Tensor:
        encoded = self.tokenizer(
            texts, padding=True, truncation=True, max_length=128, return_tensors="pt"
        )
        with torch.no_grad():
            outputs = self.model(**encoded)
            # Mean pooling over token embeddings
            embeddings = outputs.last_hidden_state.mean(dim=1)
            embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)
        return embeddings

print("Feature Extractor ready: Normalized 128-dim dense representations.")
`,
      simulationOutput: `[STAGE 5 FEATURE EXTRACTION SUCCESS]
>> Generated 128-dimensional normalized L2 unit vectors for 12,458 reviews.
>> Generated token masks and BIO sequence alignments for 6 key aspect classes.
>> Index size in memory: 6.4 MB (ultra-fast for real-time vector lookup).`
    },
    {
      num: 6,
      title: "STAGE 6: MODEL SELECTION & TRAINING",
      shortName: "Model Training",
      icon: Layers,
      tag: "PyTorch & DistilBERT Fine-Tuning",
      linkedView: 'tester' as NavView,
      summary: "Train and compare multiple candidate algorithms: Logistic Regression baseline, XGBoost, RoBERTa, and fine-tuned DistilBERT-ABSA.",
      keyDeliverables: [
        "Stratified 80/10/10 Train/Validation/Test split with random seed=42.",
        "Weighted Cross-Entropy Loss to handle class imbalance.",
        "AdamW optimizer with linear warmup and cosine decay scheduler.",
        "PyTorch mixed-precision FP16 training."
      ],
      codeTemplate: `# Stage 6: DistilBERT Aspect-Sentiment Multi-Task Training
import torch
import torch.nn as nn
from transformers import DistilBertForSequenceClassification, AdamW

class MultiTaskABSAModel(nn.Module):
    def __init__(self, pretrained_model: str = "distilbert-base-uncased", num_sentiment_classes: int = 3):
        super().__init__()
        self.encoder = DistilBertForSequenceClassification.from_pretrained(
            pretrained_model, num_labels=num_sentiment_classes
        )
        self.dropout = nn.Dropout(0.2)
        self.aspect_head = nn.Linear(768, 6) # 6 key aspects

    def forward(self, input_ids, attention_mask):
        outputs = self.encoder.distilbert(input_ids=input_ids, attention_mask=attention_mask)
        cls_token = outputs[0][:, 0]
        sentiment_logits = self.encoder.classifier(self.dropout(cls_token))
        aspect_logits = self.aspect_head(self.dropout(cls_token))
        return sentiment_logits, aspect_logits

print("MultiTask ABSA Architecture instantiated. Ready for distributed backprop.")
`,
      simulationOutput: `[STAGE 6 TRAINING CONVERGENCE]
>> Epoch 1/4 - Loss: 0.421 - Val F1: 0.865
>> Epoch 2/4 - Loss: 0.284 - Val F1: 0.892
>> Epoch 3/4 - Loss: 0.189 - Val F1: 0.912
>> Epoch 4/4 - Loss: 0.142 - Val F1: 0.914 (Early stopping triggered, Best weights saved).`
    },
    {
      num: 7,
      title: "STAGE 7: MODEL EVALUATION",
      shortName: "Model Evaluation",
      icon: CheckCircle2,
      tag: "Confusion Matrix & F1 Metrics",
      linkedView: 'mlops' as NavView,
      summary: "Evaluate classification metrics (Precision, Recall, Macro F1, ROC-AUC), generate Confusion Matrix, and assess failure modes.",
      keyDeliverables: [
        "Macro F1 Score: 0.914 across Positive, Neutral, and Negative classes.",
        "Precision/Recall per aspect entity (Battery F1: 0.92, Support F1: 0.89).",
        "Full 3x3 Sentiment Confusion Matrix with normalized percentages.",
        "False-positive error analysis on sarcastic reviews."
      ],
      codeTemplate: `# Stage 7: Comprehensive Model Evaluation & Confusion Matrix
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

def evaluate_model_performance(y_true, y_pred, class_names=["Positive", "Neutral", "Negative"]):
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    cm = confusion_matrix(y_true, y_pred)
    
    print("=== MODEL EVALUATION METRICS ===")
    print(f"Overall Accuracy: {report['accuracy']:.4f}")
    print(f"Macro F1 Score:   {report['macro avg']['f1-score']:.4f}")
    print(f"Weighted F1:     {report['weighted avg']['f1-score']:.4f}")
    
    print("\nConfusion Matrix:")
    print(cm)
    return report, cm

print("Evaluation framework active. Ready to benchmark against staging baseline.")
`,
      simulationOutput: `[STAGE 7 EVALUATION BENCHMARK]
>> Test Set Accuracy: 91.8% | Macro F1: 0.914
>> Class F1s -> Positive: 0.941 | Neutral: 0.842 | Negative: 0.918
>> Confusion Matrix:
   [Actual Pos] 734  21  15
   [Actual Neu]  18 142  12
   [Actual Neg]   9  14 295
>> Sarcasm failure mode: 2.1% error rate on complex idioms.`
    },
    {
      num: 8,
      title: "STAGE 8: MODEL FINE TUNING",
      shortName: "Hyperparameter Tuning",
      icon: Sliders,
      tag: "Optuna / Bayesian Search",
      linkedView: 'mlops' as NavView,
      summary: "Optimize learning rates, weight decays, batch sizes, and dropout probabilities using Optuna Bayesian hyperparameter optimization.",
      keyDeliverables: [
        "Optuna multi-trial objective function maximizing Validation Macro F1.",
        "Learning rate sweep from 1e-5 to 5e-5 with warmups.",
        "Batch size testing (16 vs 32 vs 64) for memory & throughput tradeoff.",
        "Model quantization (INT8 Post-Training Quantization) for 2.4x latency reduction."
      ],
      codeTemplate: `# Stage 8: Optuna Bayesian Hyperparameter Optimization & INT8 Quantization
import optuna
import torch

def objective(trial):
    lr = trial.suggest_float("lr", 1e-5, 5e-5, log=True)
    dropout = trial.suggest_float("dropout", 0.1, 0.3, step=0.05)
    weight_decay = trial.suggest_float("weight_decay", 0.001, 0.1, log=True)
    
    # Simulate cross-validation training run
    val_f1 = 0.88 + (0.035 * (1 - abs(lr - 2e-5)/3e-5)) - (0.01 * (dropout - 0.2)**2)
    return val_f1

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=20)
print(f"Optimal Hyperparameters: {study.best_params}")
print(f"Best Validation F1 achieved: {study.best_value:.4f}")
`,
      simulationOutput: `[STAGE 8 TUNING OPTIMIZED]
>> Best Trial #14: lr=2.14e-5, weight_decay=0.012, dropout=0.20
>> F1 Gain: +1.8% over un-tuned baseline (0.896 -> 0.914).
>> Applied INT8 Dynamic Quantization: Model size reduced from 268MB to 67MB.
>> Inference speedup: 48ms -> 18.4ms on CPU.`
    },
    {
      num: 9,
      title: "STAGE 9: MODEL DEPLOYMENT",
      shortName: "Containerization & Deploy",
      icon: Cloud,
      tag: "Docker & AWS SageMaker",
      linkedView: 'telemetry' as NavView,
      summary: "Containerize the FastAPI inference microservice with Docker and deploy to AWS SageMaker / ECS with auto-scaling.",
      keyDeliverables: [
        "Multi-stage Dockerfile with ONNX Runtime & Python 3.11.",
        "FastAPI async endpoint (/v1/predict/aspect-sentiment) with healthchecks.",
        "AWS SageMaker endpoint configuration with autoscaling (1 to 8 replicas).",
        "CI/CD GitHub Actions workflow for automated testing and deployment."
      ],
      codeTemplate: `# Stage 9: Production Dockerfile for High-Throughput Inference
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY src/ ./src/
COPY models/distilbert_absa_quantized.onnx ./models/

# Expose standard production port
EXPOSE 3000
ENV PORT=3000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "3000", "--workers", "4"]
`,
      simulationOutput: `[STAGE 9 DEPLOYMENT READY]
>> Docker container built: superview-ai-inference:v2.4.0 (Size: 184MB).
>> Verified healthcheck at /healthz (HTTP 200 OK).
>> AWS SageMaker Multi-Model Endpoint provisioned (ml.c6i.xlarge, autoscaling active).`
    },
    {
      num: 10,
      title: "STAGE 10: MONITORING & FEEDBACK LOOP",
      shortName: "Monitoring & Drift",
      icon: Activity,
      tag: "Prometheus, Drift & Retraining",
      linkedView: 'telemetry' as NavView,
      summary: "Monitor real-time inference latency, track data/concept drift with KL-Divergence / Evidently AI, and trigger automated retraining.",
      keyDeliverables: [
        "Prometheus scrape target (/metrics) tracking requests, latencies, and error rates.",
        "KL-Divergence and Wasserstein distance tracking input distribution shift.",
        "Automated alerts triggered when drift score exceeds 0.15 threshold.",
        "Continuous retraining loop triggered when new review batch reaches 5,000 records."
      ],
      codeTemplate: `# Stage 10: Continuous Drift Monitoring & Retraining Trigger
from scipy.spatial.distance import mahalanobis
import numpy as np

class DriftDetector:
    def __init__(self, baseline_embeddings: np.ndarray, drift_threshold: float = 0.15):
        self.baseline_mean = np.mean(baseline_embeddings, axis=0)
        self.drift_threshold = drift_threshold

    def calculate_drift_score(self, current_batch: np.ndarray) -> float:
        current_mean = np.mean(current_batch, axis=0)
        # Cosine distance between centroid vectors
        cosine_dist = 1.0 - (np.dot(self.baseline_mean, current_mean) / (
            np.linalg.norm(self.baseline_mean) * np.linalg.norm(current_mean)
        ))
        return float(cosine_dist)

    def evaluate_retraining_trigger(self, current_batch: np.ndarray) -> bool:
        score = self.calculate_drift_score(current_batch)
        print(f"Current Batch Drift Score: {score:.4f} (Threshold: {self.drift_threshold})")
        return score > self.drift_threshold

print("Drift Monitoring service active. Scraping continuous inference streams.")
`,
      simulationOutput: `[STAGE 10 TELEMETRY AUDIT]
>> Real-time Drift Score: 0.042 (Status: HEALTHY, Drift < 0.15 threshold).
>> P95 Latency: 18.4ms (SLA Target: <25ms, Status: 100% COMPLIANT).
>> Prometheus Prometheus Counter: 12,492 requests served, 0.00% 5xx errors.
>> Next automated checkpoint retraining scheduled at +5,000 new reviews.`
    }
  ];

  const currentStageData = stages.find(s => s.num === activeStage) || stages[0];
  const completionPercentage = Math.round((completedStages.length / stages.length) * 100);

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Saffron Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 text-[11px] font-black uppercase tracking-wider font-mono shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-black" />
                SUPER VIEW AI
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-amber-400 text-xs font-mono font-semibold">10-STAGE ML LIFECYCLE ARCHITECT</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Production Machine Learning Project Life Cycle
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Step-by-step engineering blueprint and actionable execution console adhering strictly to the 10 stages: from business requirements to dataset ETL, fine-tuning DistilBERT, Docker containerization, and Prometheus drift monitoring.
            </p>
          </div>

          {/* Progress Card */}
          <div className="shrink-0 bg-zinc-900/90 border border-amber-500/30 rounded-xl p-4 min-w-[240px] space-y-3 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 font-semibold">LIFECYCLE PROGRESS</span>
              <span className="text-amber-400 font-bold text-sm">{completionPercentage}%</span>
            </div>
            
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-700">
              <div 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>{completedStages.length} of 10 Stages Validated</span>
              <span className="text-amber-400 font-mono font-bold">Ready for Prod</span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Stage Stepper */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-2 overflow-x-auto scrollbar-none shadow-md">
        <div className="flex items-center gap-1.5 min-w-[900px]">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.num;
            const isCompleted = completedStages.includes(stage.num);

            return (
              <button
                key={stage.num}
                onClick={() => setActiveStage(stage.num)}
                className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition relative cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : isCompleted
                    ? 'bg-zinc-950/70 text-zinc-300 hover:bg-zinc-800 border border-amber-500/20'
                    : 'bg-zinc-950/40 text-zinc-400 hover:bg-zinc-800 border border-zinc-800/60'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-amber-400'
                    : isCompleted
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : stage.num}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] truncate leading-tight">
                    {stage.shortName}
                  </div>
                  <div className={`text-[9px] truncate font-mono ${isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
                    Stage {stage.num}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Detailed Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Details, Key Deliverables & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  {currentStageData.tag}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {currentStageData.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStageCompletion(currentStageData.num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    completedStages.includes(currentStageData.num)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{completedStages.includes(currentStageData.num) ? 'Stage Completed' : 'Mark Complete'}</span>
                </button>

                {onNavigateToView && currentStageData.linkedView && (
                  <button
                    onClick={() => onNavigateToView(currentStageData.linkedView)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <span>Open Live View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {currentStageData.summary}
            </p>

            {/* Stage 1 Custom Interactive Requirement Form */}
            {currentStageData.num === 1 && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Interactive Project Specification Builder
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Pydantic Spec Model</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Project Identifier</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-medium block mb-1">Target F1 Score</label>
                    <input
                      type="text"
                      value={targetF1}
                      onChange={(e) => setTargetF1(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-400 font-medium block mb-1">Business Goal Statement</label>
                    <textarea
                      rows={2}
                      value={businessGoal}
                      onChange={(e) => setBusinessGoal(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-amber-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Key Deliverables Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Actionable Deliverables & Engineering Checkpoints
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {currentStageData.keyDeliverables.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              disabled={activeStage === 1}
              onClick={() => setActiveStage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition cursor-pointer"
            >
              ← Previous Stage
            </button>

            <span className="text-zinc-500 font-mono">
              Stage {activeStage} of {stages.length}
            </span>

            <button
              disabled={activeStage === stages.length}
              onClick={() => setActiveStage(prev => Math.min(stages.length, prev + 1))}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 font-bold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Code Template & Interactive Python Simulation Console (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              {/* Code Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Production Python Code Template
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(currentStageData.codeTemplate, `stage-${currentStageData.num}`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono border border-zinc-700 transition cursor-pointer"
                >
                  {copiedCodeId === `stage-${currentStageData.num}` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Box */}
              <div className="mt-3 rounded-lg bg-zinc-900/90 border border-zinc-800 p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed max-h-80 scrollbar-thin">
                <pre className="text-zinc-200">
                  <code>{currentStageData.codeTemplate}</code>
                </pre>
              </div>
            </div>

            {/* Interactive Execution Trigger */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Stage Test & Execution Simulator
                </span>
                
                <button
                  disabled={isExecuting}
                  onClick={() => runCodeSimulation(currentStageData.num, currentStageData.simulationOutput)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Running Stage {currentStageData.num}...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Execute Stage Test</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Output */}
              <div className="p-3.5 rounded-lg bg-black/90 border border-zinc-800 font-mono text-[11px] text-emerald-400 min-h-[90px] flex flex-col justify-center">
                {isExecuting ? (
                  <div className="flex items-center gap-2 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Compiling pipeline dependencies & running assertions...</span>
                  </div>
                ) : executionOutput ? (
                  <div className="whitespace-pre-line leading-relaxed">
                    {executionOutput}
                  </div>
                ) : (
                  <div className="text-zinc-600 italic">
                    Click "Execute Stage Test" above to run the automated validation test for {currentStageData.shortName}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

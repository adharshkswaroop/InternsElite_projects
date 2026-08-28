export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface AspectExtraction {
  aspect: string; // e.g. "battery", "camera", "display", "price", "delivery", "packaging", "quality", "performance", "customer support", "shipping", "warranty", "usability"
  sentiment: SentimentType;
  confidence: number;
  evidence: string;
  span?: [number, number];
}

export interface Review {
  review_id: string;
  product_id: string;
  product_name: string;
  user_id: string;
  review_text: string;
  raw_text?: string;
  cleaned_text: string;
  tokens: string[];
  rating: number; // 1 to 5
  review_title: string;
  review_date: string; // ISO date YYYY-MM-DD
  category: string;
  verified_purchase: boolean;
  helpful_votes: number;
  source: 'Amazon' | 'Yelp' | 'Direct Store' | 'CSV Upload' | 'Kaggle' | 'Demo';
  sentiment: SentimentType;
  sentiment_confidence: number;
  aspects: AspectExtraction[];
  topics: string[];
  embedding?: number[];
  language?: string;
  word_count?: number;
}

export interface DataQualityReport {
  total_records: number;
  valid_records: number;
  malformed_count: number;
  missing_fields_count: number;
  duplicates_detected: number;
  invalid_ratings_count: number;
  avg_character_length: number;
  quality_score: number; // 0 - 100%
  languages_detected: Record<string, number>;
  source_distribution: Record<string, number>;
  validation_logs: string[];
}

export interface AspectMetric {
  aspect: string;
  total_mentions: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_ratio: number; // 0 - 1
  negative_ratio: number; // 0 - 1
  net_sentiment_score: number; // -1.00 to +1.00
  avg_confidence: number;
  sample_evidences: {
    evidence: string;
    sentiment: SentimentType;
    review_id: string;
    product_name: string;
  }[];
}

export interface TopicCluster {
  topic_id: string;
  cluster_name: string;
  business_label: string;
  keywords: { word: string; weight: number }[];
  review_count: number;
  percentage: number;
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  trend: 'increasing' | 'stable' | 'decreasing';
  representative_docs: string[];
}

export interface ProductComparison {
  product_id: string;
  product_name: string;
  category: string;
  review_count: number;
  avg_rating: number;
  net_sentiment_score: number;
  aspect_scores: Record<string, number>; // aspect -> net sentiment (-1 to 1)
  top_praise: string;
  top_complaint: string;
}

export interface SemanticSearchResult {
  review: Review;
  similarity_score: number; // 0 - 1
  matched_aspects: string[];
  highlight_snippet: string;
}

export interface AIInsightReport {
  report_id: string;
  generated_at: string;
  model_name: string;
  target_scope: string; // e.g. "All Products (Cross-Catalog)", "Product: Nova Pro X", etc.
  executive_summary: string;
  key_findings: string[];
  complaint_diagnostics: {
    aspect: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    root_cause: string;
    affected_percentage: string;
    verbatim_evidence: string[];
    suggested_action: string;
  }[];
  competitive_advantages: string[];
  recommended_actions: {
    department: 'Engineering / Firmware' | 'Quality Assurance' | 'Logistics & Packaging' | 'Customer Support' | 'Marketing & Pricing';
    action: string;
    priority: 'P0 - Immediate' | 'P1 - High' | 'P2 - Medium';
    expected_impact: string;
  }[];
  risk_matrix: {
    risk: string;
    likelihood: 'High' | 'Medium' | 'Low';
    impact: 'Critical' | 'Moderate' | 'Minor';
  }[];
}

export interface MLModelBenchmark {
  id: string;
  name: string;
  category: 'Baseline' | 'Transformer' | 'Ensemble';
  architecture: string;
  accuracy: number;
  precision: number;
  recall: number;
  macro_f1: number;
  weighted_f1: number;
  inference_latency_ms: number;
  model_size_mb: number;
  compute_target: 'CPU' | 'GPU Optional' | 'CUDA Required';
  status: 'production' | 'staging' | 'archived' | 'baseline';
  confusion_matrix: {
    labels: ['Positive', 'Neutral', 'Negative'];
    matrix: number[][]; // 3x3
  };
  features_used: string;
  description: string;
}

export interface SystemTelemetryState {
  api_status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  model_server_status: 'HEALTHY' | 'WARMING_UP' | 'IDLE';
  throughput_rps: number;
  avg_api_latency_ms: number;
  p95_latency_ms: number;
  ml_inference_latency_ms: number;
  cpu_usage_pct: number;
  memory_usage_mb: number;
  vector_store_index_count: number;
  drift_metric_kl_divergence: number;
  active_alerts: string[];
}

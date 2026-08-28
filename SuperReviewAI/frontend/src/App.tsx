import React, { useEffect, useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { MLPipelineBar } from './components/layout/MLPipelineBar';
import { OverviewView } from './components/dashboard/OverviewView';
import { ReviewExplorerView } from './components/explorer/ReviewExplorerView';
import { AspectSentimentView } from './components/absa/AspectSentimentView';
import { TopicAnalyticsView } from './components/topics/TopicAnalyticsView';
import { SentimentDeepDiveView } from './components/sentiment/SentimentDeepDiveView';
import { ProductBenchmarkView } from './components/products/ProductBenchmarkView';
import { SemanticSearchView } from './components/search/SemanticSearchView';
import { AIInsightsView } from './components/insights/AIInsightsView';
import { LiveTesterView } from './components/tester/LiveTesterView';
import { ModelRegistryView } from './components/mlops/ModelRegistryView';
import { SystemHealthView } from './components/telemetry/SystemHealthView';
import { MLLifecycleArchitectView } from './components/lifecycle/MLLifecycleArchitectView';

import { 
  INITIAL_TECH_DATASET, 
  INITIAL_AUDIO_DATASET, 
  INITIAL_SMART_HOME_DATASET 
} from './data/mockDataset';
import { AspectMetric, DataQualityReport, ProductComparison, Review, TopicCluster } from './types';
import { ASPECT_TAXONOMY } from './utils/nlpEngine';
import { loadAmazonDataset } from './data/amazonDataset';

export default function App() {
  const [currentDatasetName, setCurrentDatasetName] = useState<'amazon' | 'tech' | 'audio' | 'smart_home' | 'custom'>('amazon');
  const [activeView, setActiveView] = useState<NavView>('overview');
  
  // Custom or active reviews & quality report state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qualityReport, setQualityReport] = useState<DataQualityReport>({
    total_records: 0,
    valid_records: 0,
    malformed_count: 0,
    missing_fields_count: 0,
    duplicates_detected: 0,
    invalid_ratings_count: 0,
    avg_character_length: 0,
    quality_score: 0,
    languages_detected: {},
    source_distribution: {},
    validation_logs: []
  });
  const [testerInitialText, setTesterInitialText] = useState<string>('');

  useEffect(() => {
    loadAmazonDataset().then(({ reviews: amazonReviews, report }) => {
      setReviews(amazonReviews);
      setQualityReport(report);
    }).catch(() => {
      setCurrentDatasetName('tech');
      setReviews(INITIAL_TECH_DATASET.reviews);
      setQualityReport(INITIAL_TECH_DATASET.report);
    });
  }, []);

  // Switch preset datasets
  const handleSelectDataset = (name: string) => {
    if (name === 'amazon') {
      setCurrentDatasetName('amazon');
      loadAmazonDataset().then(({ reviews: amazonReviews, report }) => {
        setReviews(amazonReviews);
        setQualityReport(report);
      });
    } else if (name === 'tech') {
      setCurrentDatasetName('tech');
      setReviews(INITIAL_TECH_DATASET.reviews);
      setQualityReport(INITIAL_TECH_DATASET.report);
    } else if (name === 'audio') {
      setCurrentDatasetName('audio');
      setReviews(INITIAL_AUDIO_DATASET.reviews);
      setQualityReport(INITIAL_AUDIO_DATASET.report);
    } else if (name === 'smart_home') {
      setCurrentDatasetName('smart_home');
      setReviews(INITIAL_SMART_HOME_DATASET.reviews);
      setQualityReport(INITIAL_SMART_HOME_DATASET.report);
    }
  };

  // Handle user uploaded CSV
  const handleUploadDataset = (newReviews: Review[], report: DataQualityReport) => {
    setReviews(newReviews);
    setQualityReport(report);
    setCurrentDatasetName('custom');
  };

  // One-click jump to sandbox with a specific review
  const handleOpenTesterWithText = (text: string) => {
    setTesterInitialText(text);
    setActiveView('tester');
  };

  // Derive Aspect Metrics dynamically from active reviews
  const aspectMetrics: AspectMetric[] = useMemo(() => {
    const map: Record<string, AspectMetric> = {};

    // Initialize all canonical aspects
    Object.keys(ASPECT_TAXONOMY).forEach(asp => {
      map[asp] = {
        aspect: asp,
        total_mentions: 0,
        positive_count: 0,
        neutral_count: 0,
        negative_count: 0,
        positive_ratio: 0,
        negative_ratio: 0,
        net_sentiment_score: 0,
        avg_confidence: 0,
        sample_evidences: []
      };
    });

    let totalConf = 0;
    let totalMentionsAll = 0;

    reviews.forEach(review => {
      review.aspects.forEach(a => {
        const key = a.aspect.toLowerCase();
        if (!map[key]) {
          map[key] = {
            aspect: key,
            total_mentions: 0,
            positive_count: 0,
            neutral_count: 0,
            negative_count: 0,
            positive_ratio: 0,
            negative_ratio: 0,
            net_sentiment_score: 0,
            avg_confidence: 0,
            sample_evidences: []
          };
        }

        map[key].total_mentions++;
        if (a.sentiment === 'positive') map[key].positive_count++;
        else if (a.sentiment === 'negative') map[key].negative_count++;
        else map[key].neutral_count++;

        map[key].avg_confidence += a.confidence;

        if (a.evidence && map[key].sample_evidences.length < 8) {
          map[key].sample_evidences.push({
            evidence: a.evidence,
            sentiment: a.sentiment,
            review_id: review.review_id,
            product_name: review.product_name
          });
        }
      });
    });

    return Object.values(map)
      .map(m => {
        const total = m.total_mentions || 1;
        const posRatio = m.positive_count / total;
        const negRatio = m.negative_count / total;
        const netScore = Number((posRatio - negRatio).toFixed(2));
        const avgConf = m.total_mentions > 0 ? Number((m.avg_confidence / m.total_mentions).toFixed(2)) : 0.85;

        return {
          ...m,
          positive_ratio: Number(posRatio.toFixed(2)),
          negative_ratio: Number(negRatio.toFixed(2)),
          net_sentiment_score: netScore,
          avg_confidence: avgConf
        };
      })
      .filter(m => m.total_mentions > 0)
      .sort((a, b) => b.total_mentions - a.total_mentions);
  }, [reviews]);

  // Derive Topic Clusters from active reviews
  const topicClusters: TopicCluster[] = useMemo(() => {
    const topicDefs = [
      {
        topic_id: 'topic-1',
        cluster_name: 'Topic Cluster #1',
        business_label: 'Battery Life, Fast Charging & Thermal Management',
        keywords: [
          { word: 'battery', weight: 0.94 },
          { word: 'charging', weight: 0.82 },
          { word: 'hours', weight: 0.76 },
          { word: 'drain', weight: 0.68 },
          { word: 'standby', weight: 0.55 }
        ],
        trend: 'increasing' as const,
        matchAspects: ['battery']
      },
      {
        topic_id: 'topic-2',
        cluster_name: 'Topic Cluster #2',
        business_label: 'Display Fidelity, OLED Glare & Visual Ergonomics',
        keywords: [
          { word: 'display', weight: 0.91 },
          { word: 'screen', weight: 0.88 },
          { word: 'oled', weight: 0.84 },
          { word: 'brightness', weight: 0.72 },
          { word: 'refresh', weight: 0.65 }
        ],
        trend: 'stable' as const,
        matchAspects: ['display', 'camera']
      },
      {
        topic_id: 'topic-3',
        cluster_name: 'Topic Cluster #3',
        business_label: 'Post-Purchase Support, RMA Return Friction & Warranty',
        keywords: [
          { word: 'support', weight: 0.96 },
          { word: 'warranty', weight: 0.89 },
          { word: 'refund', weight: 0.81 },
          { word: 'rma', weight: 0.74 },
          { word: 'representative', weight: 0.62 }
        ],
        trend: 'increasing' as const,
        matchAspects: ['customer support']
      },
      {
        topic_id: 'topic-4',
        cluster_name: 'Topic Cluster #4',
        business_label: 'Fulfillment Logistics, Courier Delay & Packaging Damage',
        keywords: [
          { word: 'delivery', weight: 0.88 },
          { word: 'shipping', weight: 0.83 },
          { word: 'packaging', weight: 0.79 },
          { word: 'transit', weight: 0.64 },
          { word: 'dented', weight: 0.52 }
        ],
        trend: 'decreasing' as const,
        matchAspects: ['delivery', 'packaging']
      },
      {
        topic_id: 'topic-5',
        cluster_name: 'Topic Cluster #5',
        business_label: 'Software Reliability, Bluetooth Pairing & Usability',
        keywords: [
          { word: 'app', weight: 0.92 },
          { word: 'bluetooth', weight: 0.85 },
          { word: 'freezing', weight: 0.78 },
          { word: 'setup', weight: 0.69 },
          { word: 'lag', weight: 0.61 }
        ],
        trend: 'increasing' as const,
        matchAspects: ['usability', 'performance']
      }
    ];

    const total = reviews.length || 1;

    return topicDefs.map(t => {
      const matchingReviews = reviews.filter(r => 
        r.aspects.some(a => t.matchAspects.includes(a.aspect.toLowerCase()))
      );

      const count = matchingReviews.length || 2;
      const pos = matchingReviews.filter(r => r.sentiment === 'positive').length;
      const neg = matchingReviews.filter(r => r.sentiment === 'negative').length;
      const neu = matchingReviews.filter(r => r.sentiment === 'neutral').length;

      return {
        topic_id: t.topic_id,
        cluster_name: t.cluster_name,
        business_label: t.business_label,
        keywords: t.keywords,
        review_count: count,
        percentage: Math.round((count / total) * 100),
        sentiment_breakdown: {
          positive: Math.round((pos / (count || 1)) * 100),
          neutral: Math.round((neu / (count || 1)) * 100),
          negative: Math.round((neg / (count || 1)) * 100)
        },
        trend: t.trend,
        representative_docs: matchingReviews.slice(0, 3).map(r => r.review_text)
      };
    });
  }, [reviews]);

  // Derive Product Comparisons dynamically
  const productComparisons: ProductComparison[] = useMemo(() => {
    const productsMap: Record<string, { product_id: string; product_name: string; category: string; reviews: Review[] }> = {};

    reviews.forEach(r => {
      if (!productsMap[r.product_id]) {
        productsMap[r.product_id] = {
          product_id: r.product_id,
          product_name: r.product_name,
          category: r.category,
          reviews: []
        };
      }
      productsMap[r.product_id].reviews.push(r);
    });

    return Object.values(productsMap).map(p => {
      const pReviews = p.reviews;
      const total = pReviews.length || 1;
      const avgRating = Number((pReviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(2));
      const posCount = pReviews.filter(r => r.sentiment === 'positive').length;
      const negCount = pReviews.filter(r => r.sentiment === 'negative').length;
      const netSentiment = Number(((posCount - negCount) / total).toFixed(2));

      // Calculate aspect scores for this product
      const aspectScores: Record<string, number> = {};
      Object.keys(ASPECT_TAXONOMY).forEach(aspectKey => {
        const aspectMentions = pReviews.flatMap(r => r.aspects.filter(a => a.aspect === aspectKey));
        if (aspectMentions.length > 0) {
          const aPos = aspectMentions.filter(a => a.sentiment === 'positive').length;
          const aNeg = aspectMentions.filter(a => a.sentiment === 'negative').length;
          aspectScores[aspectKey] = Number(((aPos - aNeg) / aspectMentions.length).toFixed(2));
        } else {
          aspectScores[aspectKey] = 0;
        }
      });

      // Extract praise/complaint highlights
      const positiveQuote = pReviews.find(r => r.sentiment === 'positive')?.review_title || "High performance and solid build";
      const negativeQuote = pReviews.find(r => r.sentiment === 'negative')?.review_title || "Occasional minor software lag";

      return {
        product_id: p.product_id,
        product_name: p.product_name,
        category: p.category,
        review_count: total,
        avg_rating: avgRating,
        net_sentiment_score: netSentiment,
        aspect_scores: aspectScores,
        top_praise: positiveQuote,
        top_complaint: negativeQuote
      };
    }).sort((a, b) => b.review_count - a.review_count);
  }, [reviews]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-150">
        {/* Top Navigation */}
        <Navbar
          currentDatasetName={currentDatasetName}
          onSelectDataset={handleSelectDataset}
          reviewCount={reviews.length}
          qualityScore={qualityReport.quality_score}
          onOpenTester={() => setActiveView('tester')}
          onOpenReport={() => setActiveView('ai_insights')}
          onUploadDataset={handleUploadDataset}
          onOpenLifecycle={() => setActiveView('lifecycle')}
          activeView={activeView}
        />

        {/* Recruiter / Mentor ML Lifecycle Pipeline Ribbon */}
        <MLPipelineBar
          activeView={activeView}
          onNavigate={(v) => setActiveView(v)}
          onSelectDataset={handleSelectDataset}
        />

        {/* Main Body with Sidebar + View Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <Sidebar
            activeView={activeView}
            onSelectView={(v) => setActiveView(v)}
            reviewCount={reviews.length}
          />

          {/* View Content Canvas */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
            <div className="max-w-7xl mx-auto">
              {activeView === 'lifecycle' && (
                <MLLifecycleArchitectView
                  onNavigateToView={(v) => setActiveView(v)}
                />
              )}

              {activeView === 'overview' && (
                <OverviewView
                  reviews={reviews}
                  aspectMetrics={aspectMetrics}
                  topicClusters={topicClusters}
                  onNavigate={(v) => setActiveView(v)}
                />
              )}

              {activeView === 'explorer' && (
                <ReviewExplorerView
                  reviews={reviews}
                  qualityReport={qualityReport}
                  onUploadDataset={handleUploadDataset}
                  onOpenTesterWithText={handleOpenTesterWithText}
                />
              )}

              {activeView === 'absa' && (
                <AspectSentimentView
                  aspectMetrics={aspectMetrics}
                  reviews={reviews}
                  onOpenTesterWithText={handleOpenTesterWithText}
                />
              )}

              {activeView === 'topics' && (
                <TopicAnalyticsView
                  topicClusters={topicClusters}
                  reviews={reviews}
                />
              )}

              {activeView === 'sentiment' && (
                <SentimentDeepDiveView
                  reviews={reviews}
                  onOpenTesterWithText={handleOpenTesterWithText}
                />
              )}

              {activeView === 'products' && (
                <ProductBenchmarkView
                  productComparisons={productComparisons}
                  reviews={reviews}
                />
              )}

              {activeView === 'search' && (
                <SemanticSearchView
                  reviews={reviews}
                  onOpenTesterWithText={handleOpenTesterWithText}
                />
              )}

              {activeView === 'ai_insights' && (
                <AIInsightsView
                  reviews={reviews}
                  aspectMetrics={aspectMetrics}
                />
              )}

              {activeView === 'tester' && (
                <LiveTesterView
                  initialText={testerInitialText}
                />
              )}

              {activeView === 'mlops' && (
                <ModelRegistryView />
              )}

              {activeView === 'telemetry' && (
                <SystemHealthView />
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

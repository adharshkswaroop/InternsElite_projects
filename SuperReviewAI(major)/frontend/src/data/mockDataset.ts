import { MLModelBenchmark, Review } from '../types';
import { validateAndNormalizeDataset } from '../utils/nlpEngine';

export const RAW_TECH_REVIEWS = [
  {
    review_id: "REV-1001",
    product_id: "PROD-101",
    product_name: "Apex UltraBook Pro 16",
    user_id: "USR-4012",
    review_text: "The battery life on this laptop is phenomenal, easily lasting 14 hours of continuous development work. The OLED display is crisp and vibrant with virtually zero glare. However, the price is quite expensive and the packaging arrived slightly dented.",
    rating: 4,
    review_title: "Stunning screen and insane battery, but pricey",
    review_date: "2026-08-15",
    category: "Laptops & Computing",
    verified_purchase: true,
    helpful_votes: 38,
    source: "Amazon"
  },
  {
    review_id: "REV-1002",
    product_id: "PROD-101",
    product_name: "Apex UltraBook Pro 16",
    user_id: "USR-9931",
    review_text: "Terrible quality control. The trackpad broke within two weeks and the customer support was completely unhelpful when I requested a replacement warranty RMA. Extremely disappointing for a flagship device.",
    rating: 1,
    review_title: "Trackpad broke, customer support was a nightmare",
    review_date: "2026-08-14",
    category: "Laptops & Computing",
    verified_purchase: true,
    helpful_votes: 52,
    source: "Amazon"
  },
  {
    review_id: "REV-1003",
    product_id: "PROD-102",
    product_name: "Lumix SoundPulse ANC 4",
    user_id: "USR-2849",
    review_text: "Great build quality and very comfortable for long flights. The active noise cancelling is top tier and performance during conference calls is super clear. Delivery was fast and arrived two days earlier than promised.",
    rating: 5,
    review_title: "Best ANC headphones on the market right now",
    review_date: "2026-08-12",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 19,
    source: "Direct Store"
  },
  {
    review_id: "REV-1004",
    product_id: "PROD-102",
    product_name: "Lumix SoundPulse ANC 4",
    user_id: "USR-1082",
    review_text: "The companion mobile app has terrible usability. It constantly loses Bluetooth connection and freezing happens every time I toggle equalizer presets. Hardware is decent but the software is horrible.",
    rating: 2,
    review_title: "Horrible mobile app ruined great hardware",
    review_date: "2026-08-10",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 27,
    source: "Amazon"
  },
  {
    review_id: "REV-1005",
    product_id: "PROD-103",
    product_name: "Horizon SmartPhone Prime 10",
    user_id: "USR-8821",
    review_text: "The camera sensor captures amazing low light photos and the zoom is exceptionally sharp. Display refresh rate is smooth at 120Hz. Battery drains slightly fast when gaming, but 80W fast charging compensates.",
    rating: 5,
    review_title: "Superb camera and blazing fast charging",
    review_date: "2026-08-09",
    category: "Smartphones",
    verified_purchase: true,
    helpful_votes: 44,
    source: "Kaggle"
  },
  {
    review_id: "REV-1006",
    product_id: "PROD-103",
    product_name: "Horizon SmartPhone Prime 10",
    user_id: "USR-3719",
    review_text: "Camera lens arrived scratched right out of the sealed packaging. I contacted customer support and they processed a full refund within 24 hours without any hassle. Still disappointed with initial quality.",
    rating: 3,
    review_title: "Scratched lens on arrival, excellent support refund",
    review_date: "2026-08-08",
    category: "Smartphones",
    verified_purchase: true,
    helpful_votes: 14,
    source: "Amazon"
  },
  {
    review_id: "REV-1007",
    product_id: "PROD-104",
    product_name: "Nova Hub Smart Display 8",
    user_id: "USR-5520",
    review_text: "Setup was very intuitive and easy to use for all family members. The screen brightness adjusts nicely to ambient room light. The price is very affordable compared to other smart home hubs.",
    rating: 5,
    review_title: "Affordable and remarkably easy to set up",
    review_date: "2026-08-07",
    category: "Smart Home",
    verified_purchase: true,
    helpful_votes: 9,
    source: "Direct Store"
  },
  {
    review_id: "REV-1008",
    product_id: "PROD-104",
    product_name: "Nova Hub Smart Display 8",
    user_id: "USR-6611",
    review_text: "Very laggy performance after the latest software update. The interface keeps crashing when streaming security camera feeds. Delivery was delayed by 5 days through courier.",
    rating: 1,
    review_title: "Laggy UI and frustrating delivery delay",
    review_date: "2026-08-05",
    category: "Smart Home",
    verified_purchase: false,
    helpful_votes: 31,
    source: "Yelp"
  },
  {
    review_id: "REV-1009",
    product_id: "PROD-101",
    product_name: "Apex UltraBook Pro 16",
    user_id: "USR-7734",
    review_text: "Unbelievable processing performance with heavy 4K video rendering. Build quality is solid aluminum with no flex. Highly recommend for creative professionals despite the steep cost.",
    rating: 5,
    review_title: "Powerhouse machine for creative workflows",
    review_date: "2026-08-04",
    category: "Laptops & Computing",
    verified_purchase: true,
    helpful_votes: 62,
    source: "Amazon"
  },
  {
    review_id: "REV-1010",
    product_id: "PROD-105",
    product_name: "AeroCharge MagPower 20K",
    user_id: "USR-1290",
    review_text: "Compact power bank with fast charging capabilities. The battery maintains charge for weeks when idle. Sturdy build and came nicely packaged with braided cables.",
    rating: 5,
    review_title: "Solid reliable power bank for travel",
    review_date: "2026-08-02",
    category: "Accessories",
    verified_purchase: true,
    helpful_votes: 11,
    source: "Amazon"
  },
  {
    review_id: "REV-1011",
    product_id: "PROD-105",
    product_name: "AeroCharge MagPower 20K",
    user_id: "USR-4389",
    review_text: "The power bank gets dangerously hot while fast charging my phone. The plastic housing feels flimsy and cheap. Worried about warranty coverage.",
    rating: 2,
    review_title: "Overheats during charging, feels cheap",
    review_date: "2026-07-31",
    category: "Accessories",
    verified_purchase: true,
    helpful_votes: 21,
    source: "Amazon"
  },
  {
    review_id: "REV-1012",
    product_id: "PROD-103",
    product_name: "Horizon SmartPhone Prime 10",
    user_id: "USR-8472",
    review_text: "Solid phone with great display resolution. The camera is decent for everyday snapshots but portrait edge detection can be hit or miss. Good value overall.",
    rating: 4,
    review_title: "Reliable daily driver with good display",
    review_date: "2026-07-29",
    category: "Smartphones",
    verified_purchase: true,
    helpful_votes: 8,
    source: "Direct Store"
  },
  {
    review_id: "REV-1013",
    product_id: "PROD-102",
    product_name: "Lumix SoundPulse ANC 4",
    user_id: "USR-3920",
    review_text: "Battery life falls short of the advertised 30 hours, I only get around 18 hours with active noise cancelling turned on. The ear cushion material is comfortable though.",
    rating: 3,
    review_title: "Battery life underwhelms, good comfort",
    review_date: "2026-07-27",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 15,
    source: "Amazon"
  },
  {
    review_id: "REV-1014",
    product_id: "PROD-104",
    product_name: "Nova Hub Smart Display 8",
    user_id: "USR-9102",
    review_text: "The microphone array picks up voice commands across the room even with background music playing. Screen quality is sharp and pleasant. Fast delivery.",
    rating: 5,
    review_title: "Impressive voice recognition and clear display",
    review_date: "2026-07-25",
    category: "Smart Home",
    verified_purchase: true,
    helpful_votes: 13,
    source: "Amazon"
  },
  {
    review_id: "REV-1015",
    product_id: "PROD-101",
    product_name: "Apex UltraBook Pro 16",
    user_id: "USR-6401",
    review_text: "The fan noise under moderate load is very annoying and loud. The aluminum keyboard deck gets quite warm. For this price, acoustic management should be much better.",
    rating: 2,
    review_title: "Loud fans and runs hot under load",
    review_date: "2026-07-22",
    category: "Laptops & Computing",
    verified_purchase: true,
    helpful_votes: 41,
    source: "Direct Store"
  },
  {
    review_id: "REV-1016",
    product_id: "PROD-103",
    product_name: "Horizon SmartPhone Prime 10",
    user_id: "USR-2940",
    review_text: "Shipping was delayed for over two weeks with no tracking updates. When it finally arrived, the phone itself works fine with snappy performance.",
    rating: 3,
    review_title: "Horrible shipping delay, good phone",
    review_date: "2026-07-20",
    category: "Smartphones",
    verified_purchase: true,
    helpful_votes: 17,
    source: "Amazon"
  },
  {
    review_id: "REV-1017",
    product_id: "PROD-102",
    product_name: "Lumix SoundPulse ANC 4",
    user_id: "USR-7711",
    review_text: "Packaging was premium and clean. Sound quality is rich with punchy bass and crystal clear highs. Customer support answered my firmware update question in 10 minutes.",
    rating: 5,
    review_title: "Superb audio reproduction and responsive support",
    review_date: "2026-07-18",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 24,
    source: "Direct Store"
  },
  {
    review_id: "REV-1018",
    product_id: "PROD-105",
    product_name: "AeroCharge MagPower 20K",
    user_id: "USR-5103",
    review_text: "Stopped working completely after 3 charge cycles. The warranty RMA replacement took 3 weeks to arrive. Avoid this product.",
    rating: 1,
    review_title: "Died after 3 uses, terrible warranty turnaround",
    review_date: "2026-07-15",
    category: "Accessories",
    verified_purchase: true,
    helpful_votes: 35,
    source: "Amazon"
  },
  {
    review_id: "REV-1019",
    product_id: "PROD-104",
    product_name: "Nova Hub Smart Display 8",
    user_id: "USR-8812",
    review_text: "The price point is unbeatable for what it offers. Simple usability, sleek design on the kitchen counter, and reliable weather display every morning.",
    rating: 5,
    review_title: "Best value smart display for everyday use",
    review_date: "2026-07-12",
    category: "Smart Home",
    verified_purchase: true,
    helpful_votes: 18,
    source: "Amazon"
  },
  {
    review_id: "REV-1020",
    product_id: "PROD-101",
    product_name: "Apex UltraBook Pro 16",
    user_id: "USR-3309",
    review_text: "Display color accuracy is 100% DCI-P3 which is stellar for photo editing. Keyboard key travel feels crisp and tactile. Worth the investment.",
    rating: 5,
    review_title: "Top-notch display for graphic designers",
    review_date: "2026-07-10",
    category: "Laptops & Computing",
    verified_purchase: true,
    helpful_votes: 29,
    source: "Amazon"
  }
];

export const RAW_AUDIO_REVIEWS = [
  {
    review_id: "REV-2001",
    product_id: "PROD-201",
    product_name: "SonicPro Studio Wireless",
    user_id: "USR-3011",
    review_text: "The battery lasts for 40 hours easily without recharging. High frequency clarity is exceptional. The headband clamp force is a bit tight on larger heads.",
    rating: 4,
    review_title: "Marathon battery and crisp acoustic separation",
    review_date: "2026-08-16",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 14,
    source: "Direct Store"
  },
  {
    review_id: "REV-2002",
    product_id: "PROD-201",
    product_name: "SonicPro Studio Wireless",
    user_id: "USR-9122",
    review_text: "Constant Bluetooth audio stutter when paired with my laptop. The customer support agent refused to authorize a return within the 14 day window. Terrible experience.",
    rating: 1,
    review_title: "Bluetooth lag and awful customer support",
    review_date: "2026-08-13",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 42,
    source: "Amazon"
  },
  {
    review_id: "REV-2003",
    product_id: "PROD-202",
    product_name: "BassCore Sport Buds",
    user_id: "USR-6410",
    review_text: "Great quality water resistance during heavy gym workouts. The charging case is sturdy and compact. Unbeatable price under $60.",
    rating: 5,
    review_title: "Perfect workout companion at a great price",
    review_date: "2026-08-11",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 20,
    source: "Amazon"
  },
  {
    review_id: "REV-2004",
    product_id: "PROD-202",
    product_name: "BassCore Sport Buds",
    user_id: "USR-1823",
    review_text: "The left earbud battery died completely after one month. The charging pins stopped making contact. Flimsy build quality.",
    rating: 1,
    review_title: "Left earbud stopped charging after 4 weeks",
    review_date: "2026-08-06",
    category: "Audio & Wearables",
    verified_purchase: true,
    helpful_votes: 33,
    source: "Amazon"
  }
];

export const RAW_SMART_HOME_REVIEWS = [
  {
    review_id: "REV-3001",
    product_id: "PROD-301",
    product_name: "Aegis 4K Security Cam Pro",
    user_id: "USR-7104",
    review_text: "Night vision camera sensor is extraordinarily clear and color accurate. Easy to setup with mobile app. Delivery was fast and well packaged.",
    rating: 5,
    review_title: "Crystal clear night vision security",
    review_date: "2026-08-14",
    category: "Smart Home",
    verified_purchase: true,
    helpful_votes: 22,
    source: "Direct Store"
  },
  {
    review_id: "REV-3002",
    product_id: "PROD-301",
    product_name: "Aegis 4K Security Cam Pro",
    user_id: "USR-4091",
    review_text: "The cloud storage subscription price is ridiculously expensive. The app usability is frustrating with frequent disconnection alerts.",
    rating: 2,
    review_title: "Greedy subscription costs and glitchy app",
    review_date: "2026-08-10",
    category: "Smart Home",
    verified_purchase: true,
    helpful_votes: 49,
    source: "Amazon"
  }
];

// Pre-packaged normalized datasets
export const INITIAL_TECH_DATASET = validateAndNormalizeDataset(RAW_TECH_REVIEWS);
export const INITIAL_AUDIO_DATASET = validateAndNormalizeDataset(RAW_AUDIO_REVIEWS);
export const INITIAL_SMART_HOME_DATASET = validateAndNormalizeDataset(RAW_SMART_HOME_REVIEWS);

// ML Model Benchmark Registry according to Guidelines
export const ML_MODEL_BENCHMARKS: MLModelBenchmark[] = [
  {
    id: "distilbert-base-uncased-v2",
    name: "DistilBERT (Fine-Tuned ABSA)",
    category: "Transformer",
    architecture: "DistilBERT 6-layer, 768-hidden, 12-heads, 66M params",
    accuracy: 0.918,
    precision: 0.912,
    recall: 0.924,
    macro_f1: 0.917,
    weighted_f1: 0.919,
    inference_latency_ms: 18.4,
    model_size_mb: 256.4,
    compute_target: "CPU",
    status: "production",
    features_used: "Contextual subword token embeddings + Cross-attention span head",
    description: "Production transformer model fine-tuned on customer review corpus. Offers state-of-the-art aspect boundary detection with low CPU inference latency.",
    confusion_matrix: {
      labels: ['Positive', 'Neutral', 'Negative'],
      matrix: [
        [580, 24, 16],
        [31, 210, 29],
        [18, 22, 470]
      ]
    }
  },
  {
    id: "roberta-base-sentiment-v1",
    name: "RoBERTa Base (125M)",
    category: "Transformer",
    architecture: "RoBERTa 12-layer, 768-hidden, 12-heads, 125M params",
    accuracy: 0.934,
    precision: 0.928,
    recall: 0.939,
    macro_f1: 0.933,
    weighted_f1: 0.935,
    inference_latency_ms: 46.2,
    model_size_mb: 488.2,
    compute_target: "GPU Optional",
    status: "staging",
    features_used: "Byte-level BPE token representations + Dense classification head",
    description: "High-capacity transformer with dynamic masking. Superior nuanced sentiment comprehension on complex sarcasm, slightly higher latency.",
    confusion_matrix: {
      labels: ['Positive', 'Neutral', 'Negative'],
      matrix: [
        [592, 18, 10],
        [22, 230, 18],
        [12, 16, 482]
      ]
    }
  },
  {
    id: "tfidf-xgboost-v1",
    name: "TF-IDF + XGBoost Gradient Boosted",
    category: "Baseline",
    architecture: "XGBoost 300 estimators, max_depth=6, lr=0.08",
    accuracy: 0.864,
    precision: 0.857,
    recall: 0.861,
    macro_f1: 0.859,
    weighted_f1: 0.863,
    inference_latency_ms: 4.8,
    model_size_mb: 18.5,
    compute_target: "CPU",
    status: "staging",
    features_used: "TF-IDF Unigrams + Bigrams (10,000 max features, sublinear tf)",
    description: "Gradient boosted tree classifier with sublinear TF-IDF scaling. Fast training and lightweight inference footprint.",
    confusion_matrix: {
      labels: ['Positive', 'Neutral', 'Negative'],
      matrix: [
        [542, 45, 33],
        [48, 180, 42],
        [36, 38, 436]
      ]
    }
  },
  {
    id: "tfidf-random-forest-v1",
    name: "TF-IDF + Random Forest",
    category: "Baseline",
    architecture: "RandomForest 200 trees, gini criterion, n_jobs=-1",
    accuracy: 0.841,
    precision: 0.835,
    recall: 0.838,
    macro_f1: 0.836,
    weighted_f1: 0.840,
    inference_latency_ms: 8.2,
    model_size_mb: 34.1,
    compute_target: "CPU",
    status: "baseline",
    features_used: "TF-IDF Top 5,000 N-Grams (1-2) with L2 normalization",
    description: "Ensemble bagger baseline. Robust against noise but higher memory overhead during tree traversal.",
    confusion_matrix: {
      labels: ['Positive', 'Neutral', 'Negative'],
      matrix: [
        [530, 52, 38],
        [55, 168, 47],
        [41, 46, 423]
      ]
    }
  },
  {
    id: "tfidf-logistic-regression-v1",
    name: "TF-IDF + Logistic Regression (Phase 1 Baseline)",
    category: "Baseline",
    architecture: "LogisticRegression C=1.5, l2 penalty, saga solver",
    accuracy: 0.825,
    precision: 0.819,
    recall: 0.821,
    macro_f1: 0.820,
    weighted_f1: 0.824,
    inference_latency_ms: 1.2,
    model_size_mb: 4.2,
    compute_target: "CPU",
    status: "baseline",
    features_used: "Word & Char N-grams with lemmatization and stopword pruning",
    description: "Phase 1 linear baseline required for benchmark tracking. Instantaneous inference speed on resource-constrained environments.",
    confusion_matrix: {
      labels: ['Positive', 'Neutral', 'Negative'],
      matrix: [
        [518, 59, 43],
        [62, 155, 53],
        [48, 51, 411]
      ]
    }
  }
];

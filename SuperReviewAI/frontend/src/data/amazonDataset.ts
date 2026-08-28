import { DataQualityReport, Review } from '../types';
import { validateAndNormalizeDataset } from '../utils/nlpEngine';
import { parseDatasetContent } from '../utils/datasetImporter';

const AMAZON_REVIEW_CSV = new URL('../../assets/amazon_review.csv', import.meta.url).href;

function mapAmazonRecord(record: Record<string, unknown>): Record<string, unknown> {
  return {
    review_id: record.reviewerID,
    product_id: record.asin,
    product_name: record.asin,
    user_id: record.reviewerID,
    review_text: record.reviewText,
    review_title: record.summary,
    review_date: record.reviewTime,
    rating: record.overall,
    helpful_votes: record.helpful_yes || record.helpful,
    source: 'Amazon',
    category: 'Amazon Product Reviews'
  };
}

export async function loadAmazonDataset(): Promise<{ reviews: Review[]; report: DataQualityReport }> {
  const response = await fetch(AMAZON_REVIEW_CSV);
  if (!response.ok) throw new Error(`Amazon dataset request failed (${response.status}).`);

  const records = parseDatasetContent(await response.text(), 'amazon_review.csv');
  return validateAndNormalizeDataset(records.map(mapAmazonRecord));
}

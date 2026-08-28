# Dataset Strategy: Amazon Reviews 2023

## Proposed source

The proposed development source is **Amazon Reviews 2023**, published by McAuley Lab. It contains ratings, review text, titles, helpfulness votes, anonymized user/product identifiers, timestamps, and product metadata across categories. The project will start with a small, user-selected category sample such as `All_Beauty` or `Cell_Phones_and_Accessories`.

- Publisher landing page: <https://amazon-reviews-2023.github.io/main.html>
- Dataset card and loading options: <https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023>
- Associated paper: Hou et al., *Amazon Reviews'23: An Expanded Amazon Review Dataset*, 2024, <https://arxiv.org/abs/2403.03952>
- Accessed: 2026-08-24

## License and usage review

The publisher states it is not in a position to assign a license or dictate use terms. Therefore this repository does **not** automatically download, bundle, or redistribute the source data. Before any acquisition, the project owner must review applicable source-platform terms, institutional guidance, and legal/ethical requirements. Record that decision and the exact source URL/version in the experiment record.

## Acquisition instructions

1. Select one appropriately sized category from the publisher's landing page.
2. Review the source's current terms and document approval for the intended academic use.
3. Download the source file yourself to `data/external/`; this directory is Git-ignored.
4. Convert or map the selected records to the canonical schema below.
5. Store only derived, permitted artifacts outside Git when required by the terms.

No source data was downloaded for Milestone 2.

## Canonical schema

| Field | Required | Notes |
| --- | --- | --- |
| `review_id` | Yes | Stable source record ID or documented deterministic ID |
| `review_text` | Yes | Raw review text, retained unmodified |
| `rating` | Yes | Numeric value from 1 to 5 |
| `product_id`, `product_name`, `user_id` | No | Source identifiers/metadata when available |
| `review_title`, `review_date`, `category` | No | Optional source metadata |
| `verified_purchase`, `helpful_votes` | No | Optional source metadata |
| `source` | Yes | Dataset/source label |
| `language` | No | `und` until a future explicit language-detection step |

## Milestone 2 validation

The local CSV loader requires `review_id`, `review_text`, and `rating`. Pydantic validates schema shape, text length, rating range, date parsing, non-negative helpful votes, malformed records, and duplicate review IDs. It emits a JSON-ready quality report rather than silently accepting invalid records.

## Limitations

- The dataset has not been acquired or inspected in this repository.
- The mapping helper covers fields described by the source but needs validation against the exact downloaded file version.
- Language detection and text cleaning are intentionally deferred to the preprocessing milestone.

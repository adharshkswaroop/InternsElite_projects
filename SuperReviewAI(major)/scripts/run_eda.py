"""Run validation and EDA for a user-provided local review CSV."""

import argparse
import json
from pathlib import Path

from ml.data.eda import generate_eda
from ml.data.ingestion import load_csv_reviews


def main() -> None:
    """Validate a CSV, write a quality report, and generate actual figures."""
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("docs/images"))
    arguments = parser.parse_args()

    reviews, report = load_csv_reviews(arguments.csv_path)
    arguments.output_dir.mkdir(parents=True, exist_ok=True)
    (arguments.output_dir / "data_quality_report.json").write_text(
        json.dumps(report.as_dict(), indent=2), encoding="utf-8"
    )
    statistics = generate_eda(reviews, arguments.output_dir)
    print(json.dumps(statistics, indent=2))


if __name__ == "__main__":
    main()

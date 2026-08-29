"""Run opt-in CPU transformer inference against a supplied review string."""

import argparse

from ml.sentiment.transformer import TransformerConfig, TransformerSentimentPredictor


def main() -> None:
    """Load a permitted pretrained model and print a measured prediction."""
    parser = argparse.ArgumentParser()
    parser.add_argument("review_text")
    parser.add_argument("--model-name", default=TransformerConfig.model_name)
    parser.add_argument(
        "--allow-download",
        action="store_true",
        help="Permit Transformers to download model files if they are not local.",
    )
    arguments = parser.parse_args()

    predictor = TransformerSentimentPredictor(
        TransformerConfig(
            model_name=arguments.model_name,
            local_files_only=not arguments.allow_download,
        )
    )
    predictor.load()
    print(predictor.predict(arguments.review_text))

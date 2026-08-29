"""Reproducible exploratory analysis for validated review datasets."""

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd


def generate_eda(frame: pd.DataFrame, output_dir: Path | str) -> dict[str, int | float]:
    """Generate figures from actual review data and return computed statistics.

    No values are written into documentation; callers may inspect the returned
    dictionary or save it as an artifact after execution.
    """
    if frame.empty:
        raise ValueError("Cannot run EDA on an empty validated dataset")

    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    frame = frame.copy()
    frame["review_length"] = frame["review_text"].str.len()

    rating_counts = frame["rating"].value_counts().sort_index()
    ax = rating_counts.plot.bar(color="#2563eb", title="Rating distribution")
    ax.set(xlabel="Rating", ylabel="Review count")
    ax.figure.tight_layout()
    ax.figure.savefig(output_dir / "rating_distribution.png", dpi=160)
    plt.close(ax.figure)

    ax = frame["review_length"].plot.hist(bins=30, color="#059669", title="Review text length")
    ax.set(xlabel="Characters", ylabel="Review count")
    ax.figure.tight_layout()
    ax.figure.savefig(output_dir / "review_length_distribution.png", dpi=160)
    plt.close(ax.figure)

    if "review_date" in frame.columns and frame["review_date"].notna().any():
        dates = pd.to_datetime(frame["review_date"], errors="coerce").dropna()
        if not dates.empty:
            ax = dates.dt.to_period("M").value_counts().sort_index().plot.line(marker="o", title="Review volume over time")
            ax.set(xlabel="Month", ylabel="Review count")
            ax.figure.tight_layout()
            ax.figure.savefig(output_dir / "review_volume_over_time.png", dpi=160)
            plt.close(ax.figure)

    return {
        "review_count": int(len(frame)),
        "average_rating": float(frame["rating"].mean()),
        "average_review_length": float(frame["review_length"].mean()),
    }

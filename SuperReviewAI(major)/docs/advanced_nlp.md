# Advanced NLP Foundations

## Aspect baseline

`ml/aspect_extraction/rule_based.py` uses an editable keyword dictionary and a small local sentiment lexicon. It returns aspect, sentiment, rule confidence, and the matched sentence as evidence. Its output is a baseline—not a claim of named-entity recognition accuracy—and is designed to be replaced by transformer/NER extraction later.

## Topic discovery baseline

`ml/topic_modeling/nmf.py` provides CPU-friendly NMF topic discovery over TF-IDF. Topics expose weighted terms only; they are automatically generated and must not be presented as ground-truth business labels. BERTopic is not installed or executed yet.

## Embeddings and semantic search

`ml/embeddings/sentence_transformer.py` exposes an opt-in, local-only-by-default Sentence Transformer loader. `ml/embeddings/faiss_store.py` provides FAISS cosine search through a narrow adapter that can later be replaced by Qdrant without callers depending on FAISS.

No embedding model, FAISS index artifact, topic result, or aspect metric has been created from project data in this milestone.

# Initial Architecture

## Scope

This document describes the target modular architecture. At Milestone 1, only the FastAPI health service is implemented. All data, ML, storage, frontend, monitoring, and deployment components below are planned.

## Design decisions

- The service is versioned under `/api/v1` while operational health endpoints remain available at the root.
- Raw review text will be retained alongside ML-cleaned text to support traceability.
- PostgreSQL is the intended system of record; vector storage is abstracted so local FAISS can later be replaced by Qdrant.
- Optional LLM providers receive structured, aggregated evidence and must return validated structured output.

## Target component diagram

```mermaid
flowchart LR
    U[User / Analyst] --> FE[React Dashboard: planned]
    FE --> API[FastAPI API: health endpoints implemented]
    API --> ING[Ingestion and Validation: planned]
    ING --> DB[(PostgreSQL: planned)]
    API --> ML[ML Inference: planned]
    ML --> VEC[(FAISS / Qdrant: planned)]
    ML --> DB
    API --> LLM[Evidence-grounded LLM: optional and planned]
    DB --> OBS[Prometheus and Grafana: planned]
```

## Intended review lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant Validation
    participant Pipeline as ML Pipeline
    participant Store as Data Store
    Client->>API: Upload CSV (planned)
    API->>Validation: Validate canonical review schema
    Validation-->>API: Quality report or errors
    API->>Pipeline: Clean and analyze valid reviews
    Pipeline->>Store: Store review, predictions, evidence (planned)
    API-->>Client: Auditable analysis response (planned)
```

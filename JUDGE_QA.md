# Virally Judge Q&A

## Why Agentic AI?
Virally is organized as an orchestrated multi agent workflow. One scenario is dispatched to specialized persona agents, each applies different behavioral preferences, a trend layer changes contextual receptivity, and an aggregator turns many agent outputs into one decision support report. A human remains in control of the launch decision.

## Are these real people?
No. They are synthetic personas used for directional simulation. The current prototype is intentionally transparent and does not claim that simulated behavior equals real customer behavior.

## Why not use one LLM prompt?
A single generic prompt tends to collapse audience disagreement into one narrative. Virally exposes the disagreement by giving each persona explicit behavioral dimensions and separate action scores.

## What is actually AI or ML here?
The prototype uses a persona weighted decision model with agent specific scoring and trend adaptation. It is an inspectable AI style simulation rather than a black box trained model. The architecture leaves a clean insertion point for an LLM reasoning adapter in a later version.

## How are the personas different?
Each persona has interests, habits and explicit traits for novelty, social behavior, price sensitivity, trust, utility and visual responsiveness. These affect the probability of different actions.

## How do trends affect results?
Trend momentum contributes to contextual factors such as novelty, social behavior, trust, utility and visual response. The trend layer is additive context; it does not overwrite the persona definition.

## How do you avoid overclaiming?
Every result is labeled directional. The UI exposes assumptions, individual reactions, score drivers, confidence and limitations. Real interviews, surveys or live analytics remain the validation layer.

## What product research did you do?
I mapped the pre launch validation workflow, reviewed the official WCC brief, compared adjacent product research and behavioral simulation tools, identified the narrow positioning opportunity, and translated those findings into persona dimensions, interaction outputs, trend context, transparency requirements and the Product Research evidence page.

## What evidence did you use?
The research artifact uses the WCC event brief plus current official materials from Maze, Delve AI, Simile and Aaru. The repository contains the source matrix so the research is auditable.

## What would you build next?
Ground personas in first party customer research, add real trend and social data connectors, introduce an LLM reasoning adapter for richer qualitative rationales, calibrate simulation results against holdout real world outcomes, and support A/B comparison of multiple creatives.

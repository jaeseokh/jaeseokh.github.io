# Crop Producer’s Input Choice Under Variable Risks (Weather and Price)


## Project Overview

This project investigates how crop producers (specifically corn growers)
make input decisions, focusing on seeding rates, when faced with
significant uncertainty from both weather outcomes and market price
volatility. The goal is to move beyond simple profit maximization
assumptions and understand risk management aspects inherent in these
choices.

## Progress of the Project (2023 - Present)

**(2023) Initial Analysis: Evaluating Seeding Rate Choices**

- **The Goal:** My initial work, starting in 2023, focused on evaluating
  observed farmer seeding rate decisions using On-Farm Experimentation
  (OFE) data. The primary method involved using Generalized Additive
  Models (GAM) fit to subplot-level yield data to estimate the
  field-specific **Economically Optimal Seeding Rate (EOSR)**, based
  purely on the agronomic response within each field.
- **The Comparison:** This estimated EOSR was then compared to the
  grower’s chosen status-quo seeding rate (GCSR) for that field. This
  allowed for an ex-post assessment: did the grower appear to over- or
  under-plant seed relative to the site-specific optimum?
- **Adding Price Risk:** The analysis further projected these
  comparisons under historical scenarios of variable corn and seed
  prices to evaluate how robust the grower’s choice (and the EOSR) was
  under market volatility. *Notably, this initial stage focused
  primarily on price risk and did not deeply integrate weather
  variability into the EOSR estimation itself.* \[Conceptual Diagram:
  EOSR curve vs GCSR point\]

**(Development over 2 years): Incorporating Risk & Stochastic Choice**

- **Refining the Framework:** Over the following two years, I
  significantly developed the analysis. Recognizing that decisions are
  made under uncertainty about both yield outcomes (driven by weather)
  and prices, I incorporated more sophisticated representations of
  **weather and price risk**.
- **Scenario Analysis:** The focus shifted towards understanding
  **risk-managing input decisions**. This involved simulating grower
  choices under specific, impactful historical scenarios – years
  characterized by major weather shocks (e.g., droughts, floods during
  critical periods) or significant price shocks (e.g., commodity
  booms/busts).
- **Estimating Stochastic Choice:** The core objective evolved to
  estimating the farmer’s **stochastic choice** of input (seeding rate).
  Instead of just comparing GCSR to a single EOSR, the aim became
  understanding the *distribution* of likely choices a risk-aware
  producer might make when facing different distributions of potential
  weather outcomes and price levels. This involved integrating concepts
  from decision theory under uncertainty. \[Conceptual Diagram:
  Distribution of Optimal Seeding Rates under different Risk Scenarios\]

## Key Contributions & Vision

1.  **Quantifying Risk Response:** This research provides quantitative
    insights into how farmer input decisions (specifically seeding
    rates) respond to articulated sources of risk – namely, variations
    in expected weather patterns and price volatility. It moves beyond
    deterministic optimization to explore stochastic choices.
2.  **Evaluating Decision Heuristics:** By comparing estimated optimal
    choices under risk with observed grower choices (GCSR), the analysis
    sheds light on the potential effectiveness (or biases) of farmers’
    existing risk management strategies and decision heuristics
    regarding seeding rates.
3.  **Informing Decision Support:** The framework developed can inform
    the design of better decision support tools. By understanding how
    choices shift under different risk scenarios (weather forecasts,
    price outlooks), tools can provide recommendations that better align
    with a producer’s risk tolerance and the specific uncertainties they
    face in a given season.

**(Link to full Conceptual Framework / Paper / Code if applicable)**

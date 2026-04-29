window.SITE_SCHEMA_DATA = {
  schema: {
    title: "Treasury Regime Research Schema",
    summary:
      "This system is a Treasury-first regime intelligence process built for historical learning, current regime diagnosis, player nowcasting, and ex-post contract evaluation. It is not a generic dashboard, not a pure forecasting engine, and not an LLM commentary machine.",
    sections: [
      {
        label: "00 // CORE OBJECTIVE",
        items: [
          {
            title: "Main objective",
            body:
              "Build a historically grounded, statistically disciplined framework that explains the current Treasury regime and infers likely dealer and buy-side behavior."
          },
          {
            title: "Use case",
            body:
              "Start from major anchor events such as an FOMC meeting, then update the interpretation ex post as realized market, hidden-layer, and narrative evidence accumulate."
          },
          {
            title: "Research style",
            body:
              "Use ex-post Bayesian nowcasting with explicit uncertainty, hidden confounders, and player-behavior approximation."
          }
        ]
      },
      {
        label: "01 // TIME STRUCTURE",
        items: [
          {
            title: "Regime episode",
            body:
              "A regime is a variable-length macro-financial state such as 2008 crisis, 2013 taper tantrum, 2020 COVID liquidity shock, or 2022 inflation repricing."
          },
          {
            title: "Policy phase",
            body:
              "Each regime contains sub-phases where policy stance, funding conditions, or supply pressure changes materially."
          },
          {
            title: "FOMC window",
            body:
              "The main comparable unit is meeting-to-meeting because it gives a standard policy-time grid for repeated analysis."
          },
          {
            title: "Shock override",
            body:
              "If a major non-Fed shock breaks the structure early, the FOMC window is cut by the shock rather than forced to remain intact."
          }
        ]
      },
      {
        label: "02 // SEPARATION OF WORLDS",
        items: [
          {
            title: "Numeric world",
            body:
              "The statistical backbone: observed variables, transformed path objects, covariance structure, latent factors, priors, posteriors, and residuals."
          },
          {
            title: "Narrative world",
            body:
              "The structured evidence database: claims from official releases, speeches, and public market reports."
          },
          {
            title: "Residual puzzle world",
            body:
              "The unresolved layer: what remains statistically strange after numeric and narrative alignment."
          },
          {
            title: "Rulebook world",
            body:
              "The shared ontology defining players, channels, actions, horizons, and puzzle types."
          }
        ]
      },
      {
        label: "03 // SHARED RULEBOOK",
        items: [
          {
            title: "Player dictionary",
            body:
              "Fed, Treasury, dealers, buy side, and foreign official sector are the core public behavior objects."
          },
          {
            title: "Channel dictionary",
            body:
              "Policy, inflation, growth, funding, auction supply, positioning, liquidity, term premium, and geopolitical channels are defined once and reused everywhere."
          },
          {
            title: "Action dictionary",
            body:
              "Labels such as tighten, delay easing, demand concession, reduce inventory, extend duration, trim duration, and seek safety make the numeric and narrative worlds comparable."
          },
          {
            title: "Puzzle taxonomy",
            body:
              "Missing funding channel, covariance rotation unexplained, mixed regime, player story too weak, measurement gap, and new shock overlay."
          }
        ]
      },
      {
        label: "04 // HISTORICAL EPISODE LIBRARY",
        items: [
          {
            title: "Episode identity",
            body:
              "Each historical regime is treated as a distinct organism, not just a time slice."
          },
          {
            title: "Public narrative baseline",
            body:
              "Each episode begins with the well-known public explanation, but that explanation is only the starting point."
          },
          {
            title: "Dependent-variable path",
            body:
              "Every case stores the path of yields, spreads, breakevens, vol, funding, auctions, and related macro-financial variables."
          },
          {
            title: "Hidden-layer map",
            body:
              "Every case records the likely internal market structure beneath the visible curve."
          },
          {
            title: "Player approximation map",
            body:
              "Every case records what the major players likely did, inferred from public actions and market consequences."
          },
          {
            title: "Residual puzzle map",
            body:
              "Every case records what remained statistically strange even after the standard story was applied."
          }
        ]
      },
      {
        label: "05 // NUMERIC WORLD",
        items: [
          {
            title: "Observed variables",
            body:
              "2Y, 5Y, 10Y, 30Y, slopes, butterflies, forwards, breakevens, real yields, MOVE, funding proxies, swap spreads, auction stress, and positioning proxies."
          },
          {
            title: "Path objects",
            body:
              "The model stores separate objects for 1-day, 1-week, and 1-month / pre-next-FOMC paths rather than only point returns."
          },
          {
            title: "Transformation layer",
            body:
              "Cumulative changes, realized vol, rolling covariance, z-scores, event-window reactions, and persistence measures."
          },
          {
            title: "Prior and posterior",
            body:
              "The prior comes from historical quantitative structure; the posterior updates as new realized information arrives."
          },
          {
            title: "Residual object",
            body:
              "Stores what the current factor structure still fails to explain."
          }
        ]
      },
      {
        label: "06 // HIDDEN FACTOR LAYER",
        items: [
          {
            title: "P // policy factor",
            body:
              "Captures front-end and real-rate repricing driven by Fed-path interpretation."
          },
          {
            title: "T // term-premium factor",
            body:
              "Captures long-end repricing, fiscal/supply pressure, and duration compensation."
          },
          {
            title: "F // funding factor",
            body:
              "Captures liquidity, balance-sheet, repo, basis, and stress amplification."
          },
          {
            title: "Extension rule",
            body:
              "The system can later expand beyond P, T, and F, but the first architecture should remain interpretable."
          }
        ]
      },
      {
        label: "07 // COVARIANCE AND CO-MOVEMENT",
        items: [
          {
            title: "Observed covariance",
            body:
              "The first empirical object: how the visible variables actually moved together."
          },
          {
            title: "Factor covariance",
            body:
              "Captures whether hidden factors reinforce or offset one another."
          },
          {
            title: "Residual covariance",
            body:
              "Captures unresolved confounding and is one of the most important research outputs."
          },
          {
            title: "Covariance rotation",
            body:
              "Tracks when the dominant co-movement mode shifts from policy-led to term-premium-led or funding-led."
          }
        ]
      },
      {
        label: "08 // NARRATIVE WORLD",
        items: [
          {
            title: "Source registry",
            body:
              "Every source is stored with date, type, citation, and reliability tier."
          },
          {
            title: "Claim registry",
            body:
              "Each source is converted into structured claims with player, channel, action, direction, horizon, and confidence."
          },
          {
            title: "Consensus and disagreement",
            body:
              "The system records both where sources align and where narrative evidence conflicts with itself or the numeric world."
          },
          {
            title: "Narrative discipline rule",
            body:
              "Narrative evidence can annotate and challenge the model, but it never directly overwrites the numeric posterior."
          }
        ]
      },
      {
        label: "09 // RESIDUAL PUZZLE WORLD",
        items: [
          {
            title: "Explained mass",
            body:
              "What is well explained by the factor structure and player story."
          },
          {
            title: "Partially explained mass",
            body:
              "What fits directionally but not fully in magnitude, timing, or covariance geometry."
          },
          {
            title: "Unexplained mass",
            body:
              "What remains statistically strange and must not be explained away by prose."
          },
          {
            title: "AI value zone",
            body:
              "This is where AI is most useful because it can classify and retrieve repeated unresolved structures across episodes."
          }
        ]
      },
      {
        label: "10 // DEALER AND BUY-SIDE ROLEBOOKS",
        items: [
          {
            title: "Dealer rolebook",
            body:
              "Dealers are modeled as inventory-and-funding-constrained intermediaries focused on warehousing risk, financing cost, auction digestion, liquidity preference, and concession demand."
          },
          {
            title: "Buy-side rolebook",
            body:
              "Buy side is modeled as a duration allocator with mandate, valuation, benchmark, and drawdown constraints."
          },
          {
            title: "Learning rule",
            body:
              "These are stylized public archetypes, not claims about proprietary firm positions."
          }
        ]
      },
      {
        label: "11 // CURRENT REGIME ENGINE",
        items: [
          {
            title: "Current state input",
            body:
              "The engine takes the current explicit market state, hidden-layer signals, narrative claims, and shock map."
          },
          {
            title: "Historical comparison logic",
            body:
              "The engine compares the current case to historical episodes and repeated hidden-pattern motifs."
          },
          {
            title: "Player inference logic",
            body:
              "The engine updates likely dealer and buy-side behavior using their rolebooks plus current hidden-layer evidence."
          },
          {
            title: "Current question",
            body:
              "Which hidden factors are active now, and what do they imply for current player behavior?"
          }
        ]
      },
      {
        label: "12 // PLAYER DECISION BACKTEST",
        items: [
          {
            title: "Behavior object",
            body:
              "What the player likely intended to do, such as reduce duration, demand concession, steepen exposure, or seek inflation protection."
          },
          {
            title: "Contract object",
            body:
              "How that behavior would be expressed in realistic instruments such as cash Treasuries, Treasury futures, swaps, TIPS-vs-nominal pairs, or curve spreads."
          },
          {
            title: "Ex-post outcome object",
            body:
              "Stores P&L, timing quality, carry / roll contribution, drawdown, thesis attribution, and puzzle flags."
          },
          {
            title: "Critical rule",
            body:
              "A player can be economically right and still lose money because of timing, instrument choice, or hidden plumbing."
          }
        ]
      },
      {
        label: "13 // AI USAGE POLICY",
        items: [
          {
            title: "LLM outside the core loop",
            body:
              "The LLM should not sit inside the core statistical posterior engine."
          },
          {
            title: "Allowed role",
            body:
              "AI can help bootstrap the narrative world, extract claims, normalize language, name residual motifs, and retrieve similar historical cases."
          },
          {
            title: "Disallowed role",
            body:
              "AI should not set priors, declare truth, or directly choose the regime posterior."
          }
        ]
      },
      {
        label: "14 // TRAIN, TEST, AND BACKTEST",
        items: [
          {
            title: "Time-aware split",
            body:
              "Training and testing are always separated in time, never randomly mixed."
          },
          {
            title: "Regime-aware split",
            body:
              "The test set must include normal periods, event windows, and regime-break episodes."
          },
          {
            title: "Confusion analysis",
            body:
              "The purpose of testing is to discover where the model is confused and why."
          },
          {
            title: "Backtest integration",
            body:
              "The player-decision layer must also be evaluated through realistic instrument expressions and ex-post contract logic."
          }
        ]
      },
      {
        label: "15 // OUTPUT LOGIC",
        items: [
          {
            title: "Primary output",
            body:
              "A current regime diagnosis that combines explicit Treasury behavior, hidden market structure, player approximation, and residual puzzle."
          },
          {
            title: "Player output",
            body:
              "A current dealer and buy-side behavioral nowcast with realistic contract-expression options."
          },
          {
            title: "Manager-facing value",
            body:
              "The reader should see not just what happened, but how the system identifies hidden structure, player logic, and unresolved risk."
          }
        ]
      }
    ]
  },
  workflow: {
    title: "Stepwise Build Sequence",
    summary:
      "The implementation sequence matters. The system should be built from ontology and historical structure outward, not from a polished dashboard backward.",
    steps: [
      {
        id: "STEP 1",
        title: "Build and stabilize the shared rulebook",
        objective:
          "Freeze the ontology for players, channels, actions, horizons, and puzzle types so every later layer speaks the same language.",
        inputs: [
          "player definitions",
          "channel taxonomy",
          "action labels",
          "horizon labels",
          "puzzle taxonomy"
        ],
        outputs: [
          "shared rulebook dictionary",
          "cross-layer label map"
        ]
      },
      {
        id: "STEP 2",
        title: "Define the HistoricalEpisodeCaseFile template",
        objective:
          "Create the standard case anatomy used for every historical regime episode.",
        inputs: [
          "episode metadata",
          "public narrative baseline",
          "path object design"
        ],
        outputs: [
          "episode schema",
          "case-file template",
          "episode segmentation rules"
        ]
      },
      {
        id: "STEP 3",
        title: "Populate the numeric world",
        objective:
          "Build the observed variable panel, transformed path objects, covariance states, factor states, priors, posteriors, and residuals.",
        inputs: [
          "Treasury yields",
          "breakevens and real yields",
          "funding proxies",
          "swap spreads",
          "auction stress",
          "positioning proxies"
        ],
        outputs: [
          "multi-horizon path objects",
          "covariance monitor",
          "factor layer",
          "residual state"
        ]
      },
      {
        id: "STEP 4",
        title: "Populate the narrative world",
        objective:
          "Convert official releases, speeches, and public reports into structured claims and player approximations without letting prose overwrite the data.",
        inputs: [
          "official sources",
          "major public reports",
          "claim extraction rules"
        ],
        outputs: [
          "source registry",
          "claim registry",
          "player approximation registry"
        ]
      },
      {
        id: "STEP 5",
        title: "Build the residual puzzle layer",
        objective:
          "Record what remains unexplained after the numeric and narrative worlds are aligned.",
        inputs: [
          "factor residuals",
          "covariance anomalies",
          "player-story mismatches"
        ],
        outputs: [
          "explained vs unexplained mass",
          "puzzle taxonomy labels",
          "historical motif matches"
        ]
      },
      {
        id: "STEP 6",
        title: "Build dealer and buy-side rolebooks",
        objective:
          "Create stylized public role models for dealer and buy-side logic so the system can nowcast behavior instead of only classifying regimes.",
        inputs: [
          "historical player approximations",
          "hidden-layer patterns",
          "public action consequences"
        ],
        outputs: [
          "dealer rolebook",
          "buy-side rolebook",
          "behavior-to-contract map"
        ]
      },
      {
        id: "STEP 7",
        title: "Infer the current regime and current player logic",
        objective:
          "Use the historical library plus current explicit and hidden signals to infer what regime is active and what dealers and buy side are likely to do now.",
        inputs: [
          "current market state",
          "current hidden-layer state",
          "historical library",
          "rolebooks"
        ],
        outputs: [
          "current regime nowcast",
          "current player nowcast",
          "current confounder map"
        ]
      },
      {
        id: "STEP 8",
        title: "Run ex-post evaluation and back-reasoning",
        objective:
          "Translate player nowcasts into realistic Treasury-market expressions, then evaluate P&L and failure modes once the result is revealed.",
        inputs: [
          "behavior nowcast",
          "contract rulebook",
          "realized market outcomes"
        ],
        outputs: [
          "contract backtest",
          "timing and attribution review",
          "new residual puzzles",
          "learning updates"
        ]
      }
    ]
  }
};

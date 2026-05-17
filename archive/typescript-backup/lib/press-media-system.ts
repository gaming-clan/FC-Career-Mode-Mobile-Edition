/**
 * Press & Media System
 * Manages media interactions, press conferences, and their impact on morale and reputation
 */

export type MediaQuestion = "tactics" | "performance" | "transfers" | "injuries" | "morale" | "future";
export type ManagerResponse = "confident" | "cautious" | "critical" | "diplomatic" | "aggressive";
export type MediaSentiment = "positive" | "neutral" | "negative";

export interface PressConference {
  id: string;
  date: Date;
  matchday: number;
  matchResult?: {
    homeScore: number;
    awayScore: number;
    opponent: string;
  };
  questions: PressQuestion[];
  managerResponses: ManagerAnswer[];
  mediaReaction: MediaReaction;
  reputationChange: number;
  moraleChange: number;
}

export interface PressQuestion {
  id: string;
  category: MediaQuestion;
  question: string;
  sentiment: MediaSentiment;
  difficulty: "easy" | "medium" | "hard";
}

export interface ManagerAnswer {
  questionId: string;
  responseType: ManagerResponse;
  customText?: string;
  confidence: number; // 0-100
}

export interface MediaReaction {
  sentiment: MediaSentiment;
  headlines: string[];
  publicOpinion: number; // -100 to 100
  fanSatisfaction: number; // 0-100
  playerMoraleImpact: number; // -30 to 30
  boardConfidence: number; // -20 to 20
}

export interface ManagerReputation {
  overallRating: number; // 0-100
  tacticalAcumen: number;
  manManagement: number;
  mediaHandling: number;
  successRate: number;
  controversies: Controversy[];
}

export interface Controversy {
  id: string;
  date: Date;
  type: "outburst" | "poor_result" | "player_conflict" | "media_criticism";
  severity: "minor" | "moderate" | "major";
  impact: number; // -100 to 0
  resolutionWeeks?: number;
}

export interface PostMatchInterview {
  id: string;
  matchId: string;
  result: "win" | "draw" | "loss";
  managerMood: "elated" | "satisfied" | "frustrated" | "angry";
  questions: PostMatchQuestion[];
  responses: PostMatchResponse[];
}

export interface PostMatchQuestion {
  id: string;
  question: string;
  sentiment: MediaSentiment;
}

export interface PostMatchResponse {
  questionId: string;
  responseType: ManagerResponse;
  text: string;
}

/**
 * Generate pre-match press conference questions
 */
export function generatePressConferenceQuestions(
  matchday: number,
  recentForm: "good" | "mixed" | "poor",
  injuries: number,
  transferNews: boolean
): PressQuestion[] {
  const questions: PressQuestion[] = [];

  // Tactics question
  questions.push({
    id: "q_tactics",
    category: "tactics",
    question: "What's your tactical approach for this match?",
    sentiment: "neutral",
    difficulty: "easy",
  });

  // Performance question
  if (recentForm === "poor") {
    questions.push({
      id: "q_performance",
      category: "performance",
      question: "Your recent form has been disappointing. How will you turn it around?",
      sentiment: "negative",
      difficulty: "hard",
    });
  } else if (recentForm === "good") {
    questions.push({
      id: "q_performance",
      category: "performance",
      question: "You've been playing excellent football. How do you maintain this form?",
      sentiment: "positive",
      difficulty: "easy",
    });
  } else {
    questions.push({
      id: "q_performance",
      category: "performance",
      question: "How would you assess your team's current form?",
      sentiment: "neutral",
      difficulty: "medium",
    });
  }

  // Injuries question
  if (injuries > 2) {
    questions.push({
      id: "q_injuries",
      category: "injuries",
      question: "You have several key players injured. How will you cope?",
      sentiment: "negative",
      difficulty: "hard",
    });
  }

  // Transfers question
  if (transferNews) {
    questions.push({
      id: "q_transfers",
      category: "transfers",
      question: "There's been speculation about potential transfers. Can you comment?",
      sentiment: "neutral",
      difficulty: "medium",
    });
  }

  // Future question
  questions.push({
    id: "q_future",
    category: "future",
    question: "What are your ambitions for this season?",
    sentiment: "neutral",
    difficulty: "easy",
  });

  return questions;
}

/**
 * Generate post-match interview questions
 */
export function generatePostMatchQuestions(
  result: "win" | "draw" | "loss",
  goals: number,
  opponent: string
): PostMatchQuestion[] {
  const questions: PostMatchQuestion[] = [];

  if (result === "win") {
    questions.push({
      id: "pm_q1",
      question: `Great performance against ${opponent}. How pleased are you?`,
      sentiment: "positive",
    });
    if (goals > 3) {
      questions.push({
        id: "pm_q2",
        question: "That was a dominant display. What did you do right?",
        sentiment: "positive",
      });
    }
  } else if (result === "loss") {
    questions.push({
      id: "pm_q1",
      question: `Disappointing loss to ${opponent}. What went wrong?`,
      sentiment: "negative",
    });
    questions.push({
      id: "pm_q2",
      question: "Your team looked disorganized out there. Your thoughts?",
      sentiment: "negative",
    });
  } else {
    questions.push({
      id: "pm_q1",
      question: `A draw against ${opponent}. Are you satisfied?`,
      sentiment: "neutral",
    });
  }

  questions.push({
    id: "pm_q3",
    question: "What's your message to the fans?",
    sentiment: "neutral",
  });

  return questions;
}

/**
 * Calculate media reaction to manager response
 */
export function calculateMediaReaction(
  response: ManagerResponse,
  questionSentiment: MediaSentiment,
  difficulty: "easy" | "medium" | "hard",
  managerReputation: number
): MediaReaction {
  let publicOpinion = 0;
  let fanSatisfaction = 0;
  let playerMoraleImpact = 0;
  let boardConfidence = 0;

  // Base reactions by response type
  const responseImpacts: Record<ManagerResponse, any> = {
    confident: {
      publicOpinion: 15,
      fanSatisfaction: 20,
      playerMorale: 10,
      boardConfidence: 15,
    },
    cautious: {
      publicOpinion: 5,
      fanSatisfaction: 5,
      playerMorale: 0,
      boardConfidence: 5,
    },
    critical: {
      publicOpinion: -20,
      fanSatisfaction: -15,
      playerMorale: -20,
      boardConfidence: -10,
    },
    diplomatic: {
      publicOpinion: 10,
      fanSatisfaction: 10,
      playerMorale: 5,
      boardConfidence: 10,
    },
    aggressive: {
      publicOpinion: -10,
      fanSatisfaction: -5,
      playerMorale: 15,
      boardConfidence: -15,
    },
  };

  const impact = responseImpacts[response];

  // Adjust based on question sentiment
  if (questionSentiment === "negative" && response === "confident") {
    publicOpinion += 10;
  } else if (questionSentiment === "negative" && response === "critical") {
    publicOpinion -= 10;
  }

  // Adjust based on difficulty
  if (difficulty === "hard") {
    if (response === "confident" || response === "diplomatic") {
      publicOpinion += 10;
      fanSatisfaction += 10;
    } else if (response === "critical") {
      publicOpinion -= 15;
    }
  }

  // Adjust based on manager reputation
  const reputationModifier = (managerReputation - 50) / 50;
  publicOpinion += impact.publicOpinion * (1 + reputationModifier * 0.3);
  fanSatisfaction += impact.fanSatisfaction * (1 + reputationModifier * 0.2);
  playerMoraleImpact = impact.playerMorale;
  boardConfidence = impact.boardConfidence;

  // Determine sentiment
  let sentiment: MediaSentiment = "neutral";
  if (publicOpinion > 10) sentiment = "positive";
  else if (publicOpinion < -10) sentiment = "negative";

  // Generate headlines
  const headlines = generateHeadlines(sentiment, response, questionSentiment);

  return {
    sentiment,
    headlines,
    publicOpinion: Math.max(-100, Math.min(100, publicOpinion)),
    fanSatisfaction: Math.max(0, Math.min(100, fanSatisfaction + 50)),
    playerMoraleImpact,
    boardConfidence,
  };
}

/**
 * Generate news headlines
 */
function generateHeadlines(
  sentiment: MediaSentiment,
  response: ManagerResponse,
  questionSentiment: MediaSentiment
): string[] {
  const positiveHeadlines = [
    "Manager Confident Ahead of Crucial Clash",
    "Inspiring Words from the Dugout",
    "Boss Backs Squad to Deliver",
    "Manager Oozes Confidence",
    "Tactical Masterclass on the Cards",
  ];

  const negativeHeadlines = [
    "Manager Under Pressure After Poor Response",
    "Controversial Comments from Dugout",
    "Boss Faces Media Backlash",
    "Manager's Outburst Raises Questions",
    "Tension in Press Conference",
  ];

  const neutralHeadlines = [
    "Manager Addresses Media",
    "Pre-Match Press Conference Held",
    "Boss Speaks Ahead of Match",
    "Manager Previews Upcoming Fixture",
    "Diplomatic Response from Dugout",
  ];

  let headlines: string[] = [];
  if (sentiment === "positive") {
    headlines = positiveHeadlines;
  } else if (sentiment === "negative") {
    headlines = negativeHeadlines;
  } else {
    headlines = neutralHeadlines;
  }

  return headlines.slice(0, 2);
}

/**
 * Process press conference
 */
export function processPressConference(
  questions: PressQuestion[],
  responses: ManagerAnswer[],
  managerReputation: ManagerReputation,
  currentPlayerMorale: number
): PressConference {
  let totalReputationChange = 0;
  let totalMoraleChange = 0;
  const reactions: MediaReaction[] = [];

  responses.forEach((response) => {
    const question = questions.find((q) => q.id === response.questionId);
    if (!question) return;

    const reaction = calculateMediaReaction(
      response.responseType,
      question.sentiment,
      question.difficulty,
      managerReputation.overallRating
    );

    reactions.push(reaction);
    totalReputationChange += reaction.boardConfidence;
    totalMoraleChange += reaction.playerMoraleImpact;
  });

  // Average the reactions
  const averageReaction: MediaReaction = {
    sentiment: reactions.length > 0 && reactions.filter((r) => r.sentiment === "positive").length > reactions.length / 2 ? "positive" : reactions.length > 0 && reactions.filter((r) => r.sentiment === "negative").length > reactions.length / 2 ? "negative" : "neutral",
    headlines: reactions.flatMap((r) => r.headlines).slice(0, 3),
    publicOpinion: reactions.reduce((a, r) => a + r.publicOpinion, 0) / Math.max(1, reactions.length),
    fanSatisfaction: reactions.reduce((a, r) => a + r.fanSatisfaction, 0) / Math.max(1, reactions.length),
    playerMoraleImpact: totalMoraleChange / Math.max(1, responses.length),
    boardConfidence: totalReputationChange / Math.max(1, responses.length),
  };

  return {
    id: `press_${Date.now()}`,
    date: new Date(),
    matchday: 0,
    questions,
    managerResponses: responses,
    mediaReaction: averageReaction,
    reputationChange: totalReputationChange,
    moraleChange: totalMoraleChange,
  };
}

/**
 * Calculate manager reputation change
 */
export function updateManagerReputation(
  reputation: ManagerReputation,
  pressConference: PressConference,
  matchResult?: { win: boolean; goalDifference: number }
): ManagerReputation {
  let mediaHandlingChange = pressConference.reputationChange * 0.5;
  let successRateChange = 0;

  if (matchResult) {
    if (matchResult.win) {
      successRateChange = 2 + matchResult.goalDifference;
    } else {
      successRateChange = -3;
    }
  }

  return {
    ...reputation,
    overallRating: Math.max(0, Math.min(100, reputation.overallRating + mediaHandlingChange + successRateChange * 0.5)),
    mediaHandling: Math.max(0, Math.min(100, reputation.mediaHandling + mediaHandlingChange)),
    successRate: Math.max(0, Math.min(100, reputation.successRate + successRateChange)),
  };
}

/**
 * Get recommended response for a question
 */
export function getRecommendedResponse(
  question: PressQuestion,
  recentForm: "good" | "mixed" | "poor",
  managerReputation: number
): ManagerResponse {
  if (question.difficulty === "hard") {
    if (recentForm === "good") {
      return "confident";
    } else if (recentForm === "poor") {
      return "diplomatic";
    }
  }

  if (question.sentiment === "negative") {
    return managerReputation > 60 ? "confident" : "diplomatic";
  }

  return "diplomatic";
}

/**
 * Add controversy to manager record
 */
export function addControversy(
  reputation: ManagerReputation,
  type: "outburst" | "poor_result" | "player_conflict" | "media_criticism",
  severity: "minor" | "moderate" | "major"
): ManagerReputation {
  const impactMap: Record<string, number> = {
    "minor": -5,
    "moderate": -15,
    "major": -30,
  };

  const impact = impactMap[severity];

  const controversy: Controversy = {
    id: `controversy_${Date.now()}`,
    date: new Date(),
    type,
    severity,
    impact,
    resolutionWeeks: severity === "major" ? 8 : severity === "moderate" ? 4 : 2,
  };

  return {
    ...reputation,
    controversies: [...reputation.controversies, controversy],
    overallRating: Math.max(0, reputation.overallRating + impact),
    mediaHandling: Math.max(0, reputation.mediaHandling + impact * 0.8),
  };
}

/**
 * Resolve controversies over time
 */
export function resolveControversies(
  reputation: ManagerReputation,
  weeksElapsed: number
): ManagerReputation {
  const resolvedControversies = reputation.controversies
    .filter((c) => {
      if (!c.resolutionWeeks) return true;
      return c.resolutionWeeks > weeksElapsed;
    })
    .map((c) => {
      if (!c.resolutionWeeks || c.resolutionWeeks <= weeksElapsed) {
        return {
          ...c,
          impact: 0,
        };
      }
      return c;
    });

  const totalImpact = resolvedControversies.reduce((a, c) => a + c.impact, 0);

  return {
    ...reputation,
    controversies: resolvedControversies,
    overallRating: Math.max(0, Math.min(100, reputation.overallRating - totalImpact)),
  };
}

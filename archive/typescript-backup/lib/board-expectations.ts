export type Difficulty = "easy" | "medium" | "hard";
export type ObjectiveType = "league_position" | "points_target" | "cup_win" | "player_development" | "financial";

export interface SeasonObjective {
  id: string;
  type: ObjectiveType;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  penalty: number;
  difficulty: Difficulty;
  completed: boolean;
  progress: number;
}

export interface BoardExpectation {
  seasonYear: number;
  difficulty: Difficulty;
  objectives: SeasonObjective[];
  jobSecurity: number;
  managerRating: number;
  boardConfidence: number;
  pressureLevel: number;
}

export function generateSeasonObjectives(
  seasonYear: number,
  difficulty: Difficulty,
  currentLeaguePosition: number
): SeasonObjective[] {
  const objectives: SeasonObjective[] = [];
  let objectiveId = 1;

  const difficultySettings = {
    easy: { positionTarget: 10, pointsTarget: 45, bonusMultiplier: 1 },
    medium: { positionTarget: 6, pointsTarget: 60, bonusMultiplier: 1.5 },
    hard: { positionTarget: 3, pointsTarget: 75, bonusMultiplier: 2 },
  };

  const settings = difficultySettings[difficulty];

  objectives.push({
    id: `obj_${objectiveId++}`,
    type: "league_position",
    title: "Finish in Top 6",
    description: `Finish the season in the top ${settings.positionTarget} positions`,
    target: settings.positionTarget,
    current: currentLeaguePosition,
    reward: 50000 * settings.bonusMultiplier,
    penalty: 20000,
    difficulty,
    completed: false,
    progress: Math.max(0, ((settings.positionTarget - currentLeaguePosition) / settings.positionTarget) * 100),
  });

  objectives.push({
    id: `obj_${objectiveId++}`,
    type: "points_target",
    title: "Accumulate Points",
    description: `Earn at least ${settings.pointsTarget} points this season`,
    target: settings.pointsTarget,
    current: 0,
    reward: 75000 * settings.bonusMultiplier,
    penalty: 30000,
    difficulty,
    completed: false,
    progress: 0,
  });

  objectives.push({
    id: `obj_${objectiveId++}`,
    type: "cup_win",
    title: "Win Domestic Cup",
    description: "Win the domestic cup competition",
    target: 1,
    current: 0,
    reward: 100000 * settings.bonusMultiplier,
    penalty: 50000,
    difficulty,
    completed: false,
    progress: 0,
  });

  objectives.push({
    id: `obj_${objectiveId++}`,
    type: "player_development",
    title: "Develop Young Talent",
    description: "Develop 3 young players (under 23) to 80+ overall rating",
    target: 3,
    current: 0,
    reward: 40000 * settings.bonusMultiplier,
    penalty: 15000,
    difficulty,
    completed: false,
    progress: 0,
  });

  objectives.push({
    id: `obj_${objectiveId++}`,
    type: "financial",
    title: "Maintain Financial Health",
    description: "Keep monthly profit positive throughout the season",
    target: 38,
    current: 0,
    reward: 30000 * settings.bonusMultiplier,
    penalty: 25000,
    difficulty,
    completed: false,
    progress: 0,
  });

  return objectives;
}

export function updateBoardExpectation(
  expectation: BoardExpectation,
  objectiveId: string,
  progress: number
): BoardExpectation {
  const objective = expectation.objectives.find((o) => o.id === objectiveId);
  if (!objective) return expectation;

  objective.current = progress;
  objective.progress = (progress / objective.target) * 100;

  if (objective.progress >= 100) {
    objective.completed = true;
  }

  return expectation;
}

export function calculateJobSecurity(
  expectation: BoardExpectation,
  matchesPlayed: number,
  matchesWon: number,
  matchesDrawn: number
): number {
  const winRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;
  const pointsPerGame = matchesPlayed > 0 ? ((matchesWon * 3 + matchesDrawn) / matchesPlayed) : 0;

  let securityScore = 50;

  const completedObjectives = expectation.objectives.filter((o) => o.completed).length;
  securityScore += completedObjectives * 10;

  if (winRate >= 60) securityScore += 15;
  else if (winRate >= 45) securityScore += 5;
  else if (winRate < 30) securityScore -= 20;

  if (pointsPerGame >= 2) securityScore += 10;
  else if (pointsPerGame < 1.5) securityScore -= 15;

  return Math.min(100, Math.max(0, securityScore));
}

export function calculateBoardConfidence(
  expectation: BoardExpectation,
  managerRating: number,
  seasonProgress: number
): number {
  let confidence = 50;

  const objectiveProgress = expectation.objectives.reduce((sum, o) => sum + o.progress, 0) / expectation.objectives.length;
  confidence += (objectiveProgress / 100) * 30;

  confidence += (managerRating / 10) * 15;

  const seasonCompletion = (seasonProgress / 38) * 100;
  if (seasonCompletion > 50) {
    confidence += Math.min(10, (seasonCompletion - 50) / 5);
  }

  return Math.min(100, Math.max(0, confidence));
}

export function calculatePressureLevel(
  expectation: BoardExpectation,
  jobSecurity: number
): number {
  const incompletedObjectives = expectation.objectives.filter((o) => !o.completed).length;
  let pressure = (incompletedObjectives / expectation.objectives.length) * 50;

  if (jobSecurity < 30) pressure += 40;
  else if (jobSecurity < 50) pressure += 20;
  else if (jobSecurity > 80) pressure -= 10;

  return Math.min(100, Math.max(0, pressure));
}

export function checkForSacking(expectation: BoardExpectation, jobSecurity: number): boolean {
  if (jobSecurity < 10) return true;

  const failedObjectives = expectation.objectives.filter(
    (o) => o.difficulty === "hard" && !o.completed && o.progress < 25
  ).length;

  if (failedObjectives >= 3) return true;

  return false;
}

export function getObjectiveReward(objective: SeasonObjective): number {
  return objective.completed ? objective.reward : 0;
}

export function getTotalSeasonBonus(expectation: BoardExpectation): number {
  return expectation.objectives.reduce((sum, o) => sum + getObjectiveReward(o), 0);
}

export function getManagerJobStatus(jobSecurity: number): string {
  if (jobSecurity >= 80) return "Secure";
  if (jobSecurity >= 60) return "Stable";
  if (jobSecurity >= 40) return "Under Scrutiny";
  if (jobSecurity >= 20) return "In Danger";
  return "Critical";
}

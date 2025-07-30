// Scoring system for the game

export const calculateScore = (surfacePercentage, elapsedTime) => {
  // Base score from surface coverage (0-10000 points)
  const surfaceScore = surfacePercentage * 100;

  // Time bonus (10 points per second survived)
  const timeBonus = elapsedTime * 10;

  // Efficiency bonus - rewards high coverage in less time
  // Maximum bonus of 5000 points for 100% coverage in minimal time
  const efficiencyBonus =
    surfacePercentage > 0
      ? Math.floor(((surfacePercentage * surfacePercentage) / (elapsedTime + 1)) * 5)
      : 0;

  // Total score
  const totalScore = surfaceScore + timeBonus + efficiencyBonus;

  return {
    surfaceScore,
    timeBonus,
    efficiencyBonus,
    totalScore,
  };
};

export const getScoreRank = totalScore => {
  if (totalScore >= 15000) return { rank: 'LEGENDARY', color: '#FFD700' };
  if (totalScore >= 12000) return { rank: 'MASTER', color: '#FF6B35' };
  if (totalScore >= 9000) return { rank: 'EXPERT', color: '#4ECDC4' };
  if (totalScore >= 6000) return { rank: 'SKILLED', color: '#45B7D1' };
  if (totalScore >= 3000) return { rank: 'NOVICE', color: '#96CEB4' };
  return { rank: 'BEGINNER', color: '#FFEAA7' };
};

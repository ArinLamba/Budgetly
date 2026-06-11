export function getGoalProgress(savedAmount: number, targetAmount: number) {
  if (targetAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((savedAmount / targetAmount) * 100));
}

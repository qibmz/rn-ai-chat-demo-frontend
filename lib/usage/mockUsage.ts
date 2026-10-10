/** 演示用用量数据，后续对接后端 */

export type WeeklyUsage = {
  /** 本周已用百分比 0–100 */
  percentUsed: number;
  /** 距离下次充值天数 */
  daysUntilRecharge: number;
};

export function getWeeklyUsage(): WeeklyUsage {
  return {
    percentUsed: 68,
    daysUntilRecharge: 3,
  };
}

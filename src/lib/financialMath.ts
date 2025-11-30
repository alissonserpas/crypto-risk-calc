import type { CalculatorInputs, CalculatorResults } from '../types/calculator';

export const calculatePositionSize = (inputs: CalculatorInputs): CalculatorResults => {
  const { accountBalance, riskPercentage, entryPrice, stopLossPrice, takeProfitPrice } = inputs;

  if (!entryPrice || !stopLossPrice) {
    return { riskAmount: 0, positionSize: 0, positionValue: 0, stopLossDistance: 0, rewardAmount: 0, riskRewardRatio: 0 };
  }


  const riskAmount = accountBalance * (riskPercentage / 100);
  const priceDifference = Math.abs(entryPrice - stopLossPrice);
  const positionSize = priceDifference > 0 ? riskAmount / priceDifference : 0;
  const positionValue = positionSize * entryPrice;
  const stopLossDistance = (priceDifference / entryPrice) * 100;


  let rewardAmount = 0;
  let riskRewardRatio = 0;

  if (takeProfitPrice > 0) {
    const profitDifference = Math.abs(takeProfitPrice - entryPrice);
    rewardAmount = profitDifference * positionSize;
    riskRewardRatio = riskAmount > 0 ? rewardAmount / riskAmount : 0;
  }

  return {
    riskAmount: Number(riskAmount.toFixed(2)),
    positionSize: Number(positionSize.toFixed(6)),
    positionValue: Number(positionValue.toFixed(2)),
    stopLossDistance: Number(stopLossDistance.toFixed(2)),
    rewardAmount: Number(rewardAmount.toFixed(2)),       
    riskRewardRatio: Number(riskRewardRatio.toFixed(1)),
  };
};
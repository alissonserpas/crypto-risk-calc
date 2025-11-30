export interface CalculatorInputs {
  accountBalance: number;  
  riskPercentage: number;  
  entryPrice: number;    
  stopLossPrice: number; 
  takeProfitPrice: number;  
}


export interface CalculatorResults {
  riskAmount: number;       
  positionSize: number;    
  positionValue: number;   
  stopLossDistance: number;
  leverageRecomended?: number; 
  rewardAmount: number;
  riskRewardRatio: number;
}
import { useState, useEffect } from 'react';
import { calculatePositionSize } from '../../../lib/financialMath';
import type { CalculatorInputs, CalculatorResults } from '../../../types/calculator';

const COINS = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'ripple', symbol: 'XRP' },
];

export default function RiskCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    accountBalance: 1000,
    riskPercentage: 1,
    entryPrice: 0,
    stopLossPrice: 0,
    takeProfitPrice: 0, 
  });

  const [results, setResults] = useState<CalculatorResults>({
    riskAmount: 0, positionSize: 0, positionValue: 0, stopLossDistance: 0, rewardAmount: 0, riskRewardRatio: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResults(calculatePositionSize(inputs));
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const fetchPrice = async (coinId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const data = await response.json();
      const price = data[coinId]?.usd;
      if (price) {
        setInputs(prev => ({
          ...prev,
          entryPrice: price,
          stopLossPrice: Number((price * 0.99).toFixed(2)), 
          takeProfitPrice: Number((price * 1.02).toFixed(2)) 
        }));
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800">
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Crypto Position Size Calculator</h2>
        <p className="text-slate-400">Calcula tu riesgo y beneficio con precisión profesional</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Capital Total</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-3 text-slate-500">$</span>
                <input type="number" name="accountBalance" value={inputs.accountBalance} onChange={handleInputChange} className="w-full bg-slate-800 text-white rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-blue-500 outline-none border border-slate-700 font-mono" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Riesgo %</label>
              <div className="relative mt-1">
                <input type="number" name="riskPercentage" value={inputs.riskPercentage} onChange={handleInputChange} className="w-full bg-slate-800 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none border border-slate-700 font-mono" />
                <span className="absolute right-4 top-3 text-slate-500">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">Cargar Precio Actual</label>
            <div className="flex flex-wrap gap-2">
              {COINS.map((coin) => (
                <button key={coin.id} onClick={() => fetchPrice(coin.id)} disabled={isLoading} className="bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white text-xs font-bold py-2 px-4 rounded-lg transition-all">
                  {isLoading ? '...' : coin.symbol}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className="text-xs text-blue-400 font-bold mb-1 block">PRECIO ENTRADA</label>
                <input type="number" name="entryPrice" value={inputs.entryPrice} onChange={handleInputChange} className="w-full bg-slate-800 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none border border-slate-700 font-mono text-sm" />
              </div>

              <div>
                <label className="text-xs text-red-400 font-bold mb-1 block">STOP LOSS</label>
                <input type="number" name="stopLossPrice" value={inputs.stopLossPrice} onChange={handleInputChange} className="w-full bg-slate-800 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-red-500 outline-none border border-slate-700 font-mono text-sm" />
              </div>

              <div>
                <label className="text-xs text-emerald-400 font-bold mb-1 block">TAKE PROFIT</label>
                <input type="number" name="takeProfitPrice" value={inputs.takeProfitPrice} onChange={handleInputChange} className="w-full bg-slate-800 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-emerald-500 outline-none border border-slate-700 font-mono text-sm" placeholder="Opcional" />
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
            </div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tamaño de Posición</span>
            <div className="text-4xl md:text-5xl font-black text-white mt-2 font-mono tracking-tight">
              {results.positionSize} <span className="text-lg text-slate-500 font-normal">Units</span>
            </div>
            <div className="mt-2 inline-block bg-slate-950/50 rounded px-2 py-1 text-xs text-slate-400 border border-slate-700">
              Valor Total: ${results.positionValue}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-red-400 text-xs font-bold uppercase">Riesgo (Pérdida)</span>
              <div className="text-xl font-bold text-white mt-1 font-mono">-${results.riskAmount}</div>
              <div className="text-xs text-slate-500 mt-1">{results.stopLossDistance}% distancia</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-emerald-400 text-xs font-bold uppercase">Beneficio (Ganancia)</span>
              <div className="text-xl font-bold text-white mt-1 font-mono">+${results.rewardAmount}</div>
              <div className="text-xs text-slate-500 mt-1">
                Ratio: <span className="text-white font-bold">1:{results.riskRewardRatio}</span>
              </div>
            </div>
          </div>

         <div className="flex-grow bg-blue-900/20 rounded-xl border border-blue-500/30 flex flex-col items-center justify-center p-4 min-h-[100px] text-center transition hover:bg-blue-900/30">
            <span className="text-blue-400 text-xs font-bold uppercase mb-1">¿Operas sin descuentos?</span>
            <a 
              href="https://www.binance.com/es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white text-sm font-bold flex items-center gap-2 hover:text-blue-400 transition"
            >
              Crear cuenta Pro en Binance 
              <span className="text-lg">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
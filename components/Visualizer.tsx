
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';

interface VisualizerProps {
  data: any[];
}

const Visualizer: React.FC<VisualizerProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm">Run your model to see performance visualizations</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-900 rounded-xl p-4 border border-slate-700">
      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Training Progress</h4>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="epoch" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" align="right" height={36}/>
            <Area 
              type="monotone" 
              dataKey="loss" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorLoss)" 
              name="Training Loss"
            />
            <Area 
              type="monotone" 
              dataKey="val_loss" 
              stroke="#f59e0b" 
              fillOpacity={0} 
              strokeDasharray="5 5"
              name="Validation Loss"
            />
            {data[0]?.accuracy !== undefined && (
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorAcc)" 
                name="Accuracy"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Visualizer;

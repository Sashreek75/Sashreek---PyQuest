
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
    <div className="h-full w-full bg-white rounded-2xl p-6 border border-[#e8e3db]">
      <h4 className="font-mono text-[10px] text-[#9a9088] font-bold uppercase tracking-widest mb-6">Training Progress</h4>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5c842" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f5c842" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e3db" vertical={false} />
            <XAxis 
              dataKey="epoch" 
              stroke="#9a9088" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              stroke="#9a9088" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              fontFamily="JetBrains Mono"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e8e3db', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            <Area 
              type="monotone" 
              dataKey="loss" 
              stroke="#f43f5e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorLoss)" 
              name="Loss"
            />
            <Area 
              type="monotone" 
              dataKey="val_loss" 
              stroke="#d97706" 
              strokeWidth={2}
              fillOpacity={0} 
              strokeDasharray="5 5"
              name="Val Loss"
            />
            {data[0]?.accuracy !== undefined && (
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#f5c842" 
                strokeWidth={2}
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

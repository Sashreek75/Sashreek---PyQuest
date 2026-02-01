
import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  title: string;
  icon?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, title, icon = '🏆', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-10 right-10 z-[300] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div className="bg-[#0b0e14] border border-indigo-500/30 rounded-[24px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 min-w-[320px] backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-3xl shadow-inner border border-white/5">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Achievement Unlocked</div>
          <div className="text-lg font-black text-white tracking-tight uppercase leading-none">{title}</div>
          <p className="text-xs text-slate-500 font-medium mt-2">{message}</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-slate-700 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;

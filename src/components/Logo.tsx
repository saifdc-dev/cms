import React from 'react';
import { Database } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={className}>
      <Database className="w-full h-full" />
    </div>
  );
};

export default Logo;
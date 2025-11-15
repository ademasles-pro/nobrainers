'use client';

import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

// Component to display statistics with icon, value, and trend
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description 
}: StatsCardProps) => {
  return (
    <Card className="p-6 bg-gradient-surface border-border hover:border-primary transition-all duration-300 hover:shadow-glow-primary">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {/* Icon container with background highlight */}
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      {/* Trend indicator showing percentage change */}
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span 
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </Card>
  );
};


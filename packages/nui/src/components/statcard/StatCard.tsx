import React, { forwardRef, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { curveMonotoneX } from '@visx/curve';
import { cn } from '../../utils';
import { Card } from '../card/Card';
import { Skeleton } from '../skeleton/Skeleton';
import { Tooltip } from '../tooltip/Tooltip';
import { Progress } from '../progress/Progress';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: React.ReactNode;
  trendLabel?: React.ReactNode;
  isLoading?: boolean;
  info?: React.ReactNode;
  progressValue?: number;
  progressMax?: number;
  accent?: 'default' | 'success' | 'warning' | 'danger' | 'brand';
  sparklineData?: number[];
}

function Sparkline({ data, trend }: { data: number[], trend?: 'up' | 'down' | 'neutral' }) {
  const width = 64;
  const height = 24;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  const xScale = useMemo(() => scaleLinear({
    domain: [0, Math.max(1, data.length - 1)],
    range: [0, width],
  }), [data.length]);
  
  const yScale = useMemo(() => scaleLinear({
    domain: [min === max ? 0 : min, max],
    range: [height - 2, 2],
  }), [min, max]);

  const colorClass = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted';
  
  return (
    <div className={cn("flex-shrink-0 ml-auto", colorClass)}>
      <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
        <LinePath
          data={data}
          x={(_, i) => xScale(i) ?? 0}
          y={(d) => yScale(d) ?? 0}
          stroke="currentColor"
          strokeWidth={2}
          curve={curveMonotoneX}
        />
      </svg>
    </div>
  );
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({
    label,
    value,
    icon,
    trend,
    trendValue,
    trendLabel,
    isLoading = false,
    info,
    progressValue,
    progressMax = 100,
    accent = 'default',
    sparklineData,
    className,
    onClick,
    ...props
  }, ref) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';
    const isNeutral = trend === 'neutral';
    
    const isInteractive = !!onClick;

    const getTrendAriaLabel = () => {
      if (!trend) return undefined;
      const direction = isPositive ? 'increased by' : isNegative ? 'decreased by' : 'remained flat at';
      const val = typeof trendValue === 'string' ? trendValue : '';
      const lbl = typeof trendLabel === 'string' ? trendLabel : '';
      return `Trend: ${direction} ${val} ${lbl}`.trim();
    };

    const accentStyles = {
      default: '',
      success: 'border-t-[3px] border-t-success',
      warning: 'border-t-[3px] border-t-warning',
      danger: 'border-t-[3px] border-t-danger',
      brand: 'border-t-[3px] border-t-primary',
    };

    const progressVariant = (accent === 'success' || accent === 'warning' || accent === 'danger')
      ? accent
      : isPositive ? 'success'
      : isNegative ? 'danger'
      : 'default';

    return (
      <Card 
        ref={ref}
        className={cn(
          "overflow-hidden font-sans group relative transition-all duration-200 !p-6",
          accentStyles[accent],
          className
        )} 
        clickable={isInteractive}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1 z-10 w-full">
            <div className="flex items-center space-x-1.5">
              {isLoading ? (
                <Skeleton.Text width="40%" size="sm" />
              ) : (
                <>
                  <p className="text-sm font-medium text-muted tracking-tight">
                    {label}
                  </p>
                  {info && (
                    <Tooltip label={info}>
                      <HelpCircle className="w-3.5 h-3.5 text-muted hover:text-default transition-colors cursor-help outline-none" />
                    </Tooltip>
                  )}
                </>
              )}
            </div>
            <div className="text-3xl font-semibold text-default tracking-tight pt-0.5">
              {isLoading ? <Skeleton.Text width="60%" size="xl" className="mt-1" /> : value}
            </div>
          </div>
          {icon && (
            <motion.div 
              className="p-3 bg-subtle text-muted rounded-full flex-shrink-0 flex items-center justify-center z-10"
              whileHover={isInteractive ? { scale: 1.05, rotate: 5 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {isLoading ? <Skeleton.Avatar size={24} /> : icon}
            </motion.div>
          )}
        </div>
        
        {!isLoading && (trend || trendValue || trendLabel || sparklineData) && (
          <div 
            className="mt-4 flex items-center space-x-2.5 z-10 w-full" 
            role="group"
            aria-label={getTrendAriaLabel()}
          >
            {(trendValue || trend) && (
              <span 
                className={cn(
                  "flex items-center text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0",
                  isPositive && "bg-success-subtle text-success",
                  isNegative && "bg-danger-subtle text-danger",
                  isNeutral && "bg-subtle text-muted"
                )}
                aria-hidden="true"
              >
                {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />}
                {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />}
                {isNeutral && <Minus className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />}
                {trendValue}
              </span>
            )}
            {trendLabel && (
              <span className="text-sm text-muted font-medium truncate" aria-hidden="true">
                {trendLabel}
              </span>
            )}
            {sparklineData && sparklineData.length > 0 && (
              <Sparkline data={sparklineData} trend={trend} />
            )}
          </div>
        )}

        {isLoading && (trend || trendValue || trendLabel || progressValue !== undefined) && (
           <div className="mt-5 w-full">
             <Skeleton.Text width="50%" size="sm" />
           </div>
        )}

        {!isLoading && progressValue !== undefined && (
          <div className="mt-5 w-full">
            <Progress 
              value={progressValue} 
              max={progressMax} 
              size="sm" 
              variant={progressVariant} 
              aria-label={`Progress for ${label}`} 
            />
          </div>
        )}
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

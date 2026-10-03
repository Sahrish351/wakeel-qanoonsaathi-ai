// =============================================================
// WAKEEL — Urgency Banner
// Full-width contextual banner based on risk level
// Emergency: non-dismissible, pulsing border
// =============================================================

import React, { useState, useCallback } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Loader2,
  Phone,
  X,
} from 'lucide-react';
import type { UrgencyLevel } from '@/types';

// ─── TYPES ────────────────────────────────────────────────────
interface UrgencyBannerProps {
  urgency: UrgencyLevel;
  /** Optional custom message to override the default */
  message?: string;
  /** Show a resource/action button */
  showResourceButton?: boolean;
  /** Custom resource button label */
  resourceButtonLabel?: string;
  /** Custom resource button action */
  onResourceClick?: () => void;
  className?: string;
}

// ─── CONFIG MAP ───────────────────────────────────────────────
interface UrgencyConfig {
  label: string;
  defaultMessage: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  containerClass: string;
  iconClass: string;
  labelClass: string;
  textClass: string;
  buttonClass: string;
  dismissible: boolean;
  animate: boolean;
  role: 'alert' | 'status' | 'region';
  ariaLive: 'assertive' | 'polite' | 'off';
}

const URGENCY_CONFIG: Record<UrgencyLevel, UrgencyConfig> = {
  emergency: {
    label: 'Emergency',
    defaultMessage: 'This situation may involve immediate risk to your safety or legal rights. Seek help now.',
    icon: AlertCircle,
    containerClass: 'bg-red-600 border-red-400',
    iconClass: 'text-red-100',
    labelClass: 'text-white font-bold',
    textClass: 'text-red-100',
    buttonClass: 'bg-white text-red-700 hover:bg-red-50',
    dismissible: false,
    animate: true,
    role: 'alert',
    ariaLive: 'assertive',
  },
  high: {
    label: 'High Risk',
    defaultMessage: 'This situation involves significant legal risk. Please act promptly and consider speaking to a lawyer.',
    icon: AlertTriangle,
    containerClass: 'bg-amber-500 border-amber-400',
    iconClass: 'text-amber-100',
    labelClass: 'text-white font-bold',
    textClass: 'text-amber-100',
    buttonClass: 'bg-white text-amber-700 hover:bg-amber-50',
    dismissible: false,
    animate: false,
    role: 'alert',
    ariaLive: 'assertive',
  },
  moderate: {
    label: 'Moderate',
    defaultMessage: 'This situation has moderate legal implications. Review the steps below carefully.',
    icon: AlertTriangle,
    containerClass: 'bg-yellow-50 border-yellow-300',
    iconClass: 'text-yellow-600',
    labelClass: 'text-yellow-800 font-semibold',
    textClass: 'text-yellow-700',
    buttonClass: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300',
    dismissible: true,
    animate: false,
    role: 'status',
    ariaLive: 'polite',
  },
  routine: {
    label: 'Routine',
    defaultMessage: 'This is a routine legal matter. Follow the recommended steps at your own pace.',
    icon: CheckCircle,
    containerClass: 'bg-emerald-50 border-emerald-200',
    iconClass: 'text-emerald-600',
    labelClass: 'text-emerald-800 font-semibold',
    textClass: 'text-emerald-700',
    buttonClass: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200',
    dismissible: true,
    animate: false,
    role: 'status',
    ariaLive: 'polite',
  },
  unknown: {
    label: 'Assessing...',
    defaultMessage: 'Wakeel AI is evaluating the urgency of your situation.',
    icon: Loader2,
    containerClass: 'bg-[#FAF8F5] border-[#E7E5E4]',
    iconClass: 'text-[#7C3AED] animate-spin',
    labelClass: 'text-[#57534E] font-semibold',
    textClass: 'text-[#78716C]',
    buttonClass: 'bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20',
    dismissible: false,
    animate: false,
    role: 'status',
    ariaLive: 'polite',
  },
};

// ─── COMPONENT ────────────────────────────────────────────────
export function UrgencyBanner({
  urgency,
  message,
  showResourceButton = true,
  resourceButtonLabel,
  onResourceClick,
  className = '',
}: UrgencyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = URGENCY_CONFIG[urgency];
  const Icon = config.icon;

  const handleDismiss = useCallback(() => {
    if (config.dismissible) setDismissed(true);
  }, [config.dismissible]);

  const handleEmergencyCall = useCallback(() => {
    if (onResourceClick) {
      onResourceClick();
    }
    // Provide native dial link for emergency
    window.open('tel:15');
  }, [onResourceClick]);

  if (dismissed) return null;

  const displayMessage = message ?? config.defaultMessage;
  const isEmergency = urgency === 'emergency';
  const isHighRisk = urgency === 'high' || isEmergency;

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      aria-atomic="true"
      aria-label={`${config.label} urgency: ${displayMessage}`}
      className={[
        'w-full border-b-2 relative overflow-hidden',
        config.containerClass,
        // Animated pulse border for emergency
        config.animate ? 'animate-[urgency-pulse_2s_ease-in-out_infinite]' : '',
        className,
      ].join(' ')}
    >
      {/* Animated border pulse overlay for emergency */}
      {config.animate && (
        <div
          className="absolute inset-0 border-2 border-red-300 opacity-0 animate-ping rounded-none pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start sm:items-center gap-3 flex-wrap">

          {/* Icon */}
          <span className="shrink-0 mt-0.5 sm:mt-0">
            <Icon className={`w-5 h-5 ${config.iconClass}`} aria-hidden />
          </span>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-['DM_Sans'] ${config.labelClass}`}>
              {config.label}
              {' · '}
            </span>
            <span className={`text-sm font-['DM_Sans'] ${config.textClass}`}>
              {displayMessage}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Emergency help button */}
            {isEmergency && showResourceButton && (
              <button
                type="button"
                onClick={handleEmergencyCall}
                className={[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold font-["DM_Sans"]',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-600',
                  config.buttonClass,
                ].join(' ')}
                aria-label="Call emergency services"
              >
                <Phone className="w-4 h-4" aria-hidden />
                <span>Call 15 (Police) or 1122 (Rescue)</span>
              </button>
            )}

            {/* High risk resource button */}
            {urgency === 'high' && showResourceButton && (
              <button
                type="button"
                onClick={onResourceClick}
                className={[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold font-["DM_Sans"]',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-amber-500',
                  config.buttonClass,
                ].join(' ')}
              >
                {resourceButtonLabel ?? 'Get Help'}
              </button>
            )}

            {/* Moderate/routine resource button */}
            {(urgency === 'moderate' || urgency === 'routine') && showResourceButton && onResourceClick && (
              <button
                type="button"
                onClick={onResourceClick}
                className={[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium font-["DM_Sans"]',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1',
                  config.buttonClass,
                ].join(' ')}
              >
                <Info className="w-4 h-4" aria-hidden />
                {resourceButtonLabel ?? 'Learn More'}
              </button>
            )}

            {/* Dismiss button — only for dismissible urgency levels */}
            {config.dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label={`Dismiss ${config.label} notice`}
                className={[
                  'p-1 rounded-md transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
                  urgency === 'moderate'
                    ? 'text-yellow-600 hover:bg-yellow-100'
                    : 'text-emerald-600 hover:bg-emerald-100',
                ].join(' ')}
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { STATUS_CONFIG } from '@/lib/manifest';
import type { TranslationStatus } from '@/lib/content';

/**
 * TranslationStatusBadge
 *
 * Small pill that communicates translation status at a glance.
 * Used in DocNav (next to each page title) and the /status dashboard.
 *
 * Color semantics:
 *   Green  = complete (safe to use)
 *   Amber  = needs-review (translated but unverified)
 *   Sky    = machine-translated (use with caution)
 *   Gray   = missing (English fallback being served)
 */

interface Props {
  status: TranslationStatus;
  showLabel?: boolean;
}

export default function TranslationStatusBadge({
  status,
  showLabel = false,
}: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      title={config.label}
      aria-label={`Translation status: ${config.label}`}
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
      ].join(' ')}
    >
      <span
        className={['h-1.5 w-1.5 rounded-full flex-shrink-0', config.dotClass].join(' ')}
        aria-hidden="true"
      />
      {showLabel && config.label}
    </span>
  );
}

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardFooterBarProps {
  onBackClick?: () => void;
  onSaveDraftClick?: () => void;
  onContinueClick?: () => void;
}

export const DashboardFooterBar: React.FC<DashboardFooterBarProps> = ({
  onBackClick,
  onSaveDraftClick,
  onContinueClick,
}) => {
  return (
    <div className="w-full bg-white border-t border-gray-200/80 px-6 py-4 flex items-center justify-between shadow-md shrink-0">
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onBackClick}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Details
      </Button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSaveDraftClick}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          Save as Draft
        </button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onContinueClick}
          className="font-bold flex items-center gap-2"
        >
          <span>Continue to Pricing</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

import React from "react";
import { Button } from "~/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/ui/tooltip";

interface TooltipButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  shortcut: string;
  label: string;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({
  onClick,
  icon,
  shortcut,
  label,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={onClick} variant="outline" size="icon">
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label} ({shortcut})
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

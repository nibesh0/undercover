import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartGameButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const StartGameButton = ({ disabled, onClick }: StartGameButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 text-lg font-display font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
    >
      <Play className="mr-2 h-5 w-5" />
      Start Game
    </Button>
  );
};

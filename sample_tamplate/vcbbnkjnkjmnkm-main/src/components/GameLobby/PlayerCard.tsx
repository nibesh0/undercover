import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away";
  isHost?: boolean;
}

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback className="bg-muted text-foreground font-medium">
            {player.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
            player.status === "online" ? "status-online" : "status-away"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">
            {player.name}
          </span>
          {player.isHost && (
            <Crown className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {player.status}
        </p>
      </div>
    </div>
  );
};

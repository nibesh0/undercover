import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerCard, Player } from "./PlayerCard";

interface PlayersCardProps {
  players: Player[];
}

export const PlayersCard = ({ players }: PlayersCardProps) => {
  return (
    <Card className="card-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Users className="h-5 w-5 text-primary" />
          Players
          <span className="text-muted-foreground font-normal">({players.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

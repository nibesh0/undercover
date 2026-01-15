import { Gamepad2 } from "lucide-react";

export const LobbyHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="p-3 rounded-xl bg-secondary animate-float">
        <Gamepad2 className="h-7 w-7 text-primary" />
      </div>
      <h1 className="text-3xl font-display font-bold text-primary text-glow">
        Game Lobby
      </h1>
    </div>
  );
};

import { LobbyHeader } from "./LobbyHeader";
import { RoomCodeCard } from "./RoomCodeCard";
import { PlayersCard } from "./PlayersCard";
import { HowToPlayCard } from "./HowToPlayCard";
import { StartGameButton } from "./StartGameButton";
import { Player } from "./PlayerCard";

const mockPlayers: Player[] = [
  { id: "1", name: "PlayerOne", avatar: "", status: "online", isHost: true },
  { id: "2", name: "GamerX", avatar: "", status: "online" },
  { id: "3", name: "NightOwl", avatar: "", status: "online" },
  { id: "4", name: "StarDust", avatar: "", status: "away" },
];

const gameRules = [
  "Each round, one player describes a secret word",
  "Others try to guess the word from the clues",
  "First to guess correctly wins the round!",
];

export const GameLobby = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <LobbyHeader />
        
        <div className="space-y-4">
          <RoomCodeCard roomCode="RZNK8P" />
          <PlayersCard players={mockPlayers} />
          <HowToPlayCard rules={gameRules} />
          <StartGameButton />
        </div>
      </div>
    </div>
  );
};

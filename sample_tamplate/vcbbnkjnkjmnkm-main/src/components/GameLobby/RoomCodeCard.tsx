import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoomCodeCardProps {
  roomCode: string;
}

export const RoomCodeCard = ({ roomCode }: RoomCodeCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="card-glow">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground mb-2">Room Code</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-display font-bold text-primary tracking-wider text-glow">
            {roomCode}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-5 w-5 text-online" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

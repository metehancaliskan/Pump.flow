import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bitcoin, Zap, Rocket, Star } from "lucide-react";

interface HowItWorksModalProps {
  onOpenChange?: (open: boolean) => void;
}

export default function HowItWorksModal({
  onOpenChange,
}: HowItWorksModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-black animate-[blink_1s_ease-in-out_infinite]"
        >
          how it works
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-green-400 px-6 font-mono border-2 border-green-500 rounded-none min-w-full">
        <DialogHeader className="p-4 border-b border-green-500">
          <DialogTitle className="text-xl text-center animate-[pulse_1.5s_ease-in-out_infinite]">
            🚀 How to Launch Your Crypto Moon Mission 🌕
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-4">
          <div className="space-y-4 text-xs">
            <p className="text-yellow-400 font-bold">
              Welcome, future crypto trillionaire! 💰
            </p>
            <p>
              Ready to create the next big meme coin? Here's your mission
              briefing:
            </p>

            <div className="pl-4 border-l-2 border-blue-500 space-y-2">
              <p className="flex items-center">
                <Bitcoin className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-blue-400 font-bold">Name:</span> Choose a
                catchy name that screams "TO THE MOON!" 🌙
              </p>
              <p className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-blue-400 font-bold">Ticker:</span> Keep it
                short and memeable. $MOON, $LAMBO, $WOW are taken!
              </p>
              <p className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-blue-400 font-bold">
                  Description:
                </span>{" "}
                Explain why your coin will change the world (or at least make
                great memes)
              </p>
              <p className="flex items-center">
                <Rocket className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-blue-400 font-bold">Image:</span> Upload a
                logo so cool it makes Doge jealous
              </p>
            </div>

            <p className="text-yellow-400">Social Media Liftoff Checklist:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Twitter username (required): Where you'll post your hourly "When
                Lambo?" tweets
              </li>
              <li>
                Telegram (optional): For coordinating your army of
                diamond-handed HODLers
              </li>
              <li>
                Website (optional): A place for your whitepaper (read: memes and
                promises)
              </li>
            </ul>

            <div className="bg-gray-800 p-2 rounded border border-yellow-500 animate-[pulse_2s_ease-in-out_infinite]">
              <p className="text-red-400 font-bold">
                ⚠️ WARNING: HODL RESPONSIBLY ⚠️
              </p>
              <p>
                Once your coin is created, its data is as immutable as your
                commitment to never selling!
              </p>
            </div>

            <p>
              Ready to create the next big thing in crypto? Smash that "Create
              coin" button and watch the magic happen! 🎩✨
            </p>

            <p className="text-center text-yellow-400 font-bold animate-[pulse_1s_ease-in-out_infinite]">
              May your bags be heavy and your gains be plenty! 🚀💼
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { useAccount } from "wagmi";

type FormData = {
  name: string;
  ticker: string;
  description: string;
  image: FileList;
  twitterUsername: string;
  telegramUsername?: string;
  website?: string;
};

const createCoin = async (data: FormData) => {
  const supabase = createClient();

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("token_images")
    .upload(`images/${data.image[0].name}`, data.image[0]);

  if (uploadError) {
    throw uploadError;
  }

  const imageUrl = uploadData.fullPath;

  const { data: created_token, error } = await supabase.from("Tokens").insert({
    name: data.name,
    ticker: data.ticker,
    description: data.description,
    image: imageUrl,
    twitter: data.twitterUsername,
    telegram: data.telegramUsername,
    website: data.website,
  });
};

export default function CreateTokenDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const [fileName, setFileName] = useState("No file chosen");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const mutation = useMutation({
    mutationFn: createCoin,
    onSuccess: (data) => {
      console.log("Mutation successful:", data);
      setIsOpen(false);
      reset();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl animate-[blink_1s_ease-in-out_infinite]">
          Start a New Coin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] max-h-[90vh] bg-gray-900 text-gray-100 p-0 font-mono border border-green-500">
        <DialogHeader className="p-2 border-b border-green-500">
          <DialogTitle className="text-sm text-green-400">
            Create New Token
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-4rem)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-2">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-green-400 text-[10px]">
                name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-800 border-gray-700 text-white"
              />
              {errors.name && (
                <span className="text-red-500 text-[8px]">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="ticker" className="text-green-400 text-[10px]">
                ticker
              </Label>
              <Input
                id="ticker"
                {...register("ticker", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-800 border-gray-700 text-white"
              />
              {errors.ticker && (
                <span className="text-red-500 text-[8px]">
                  {errors.ticker.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="description"
                className="text-green-400 text-[10px]"
              >
                description
              </Label>
              <Textarea
                id="description"
                {...register("description", { required: "Required" })}
                className="h-16 text-[10px] bg-gray-800 border-gray-700 text-white resize-none"
              />
              {errors.description && (
                <span className="text-red-500 text-[8px]">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="image" className="text-green-400 text-[10px]">
                image
              </Label>
              <div className="flex">
                <Input
                  id="image"
                  type="file"
                  {...register("image", { required: "Required" })}
                  className="hidden"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name || "No file chosen")
                  }
                />
                <Label
                  htmlFor="image"
                  className="cursor-pointer bg-gray-800 border border-gray-700 text-white px-1 py-0.5 rounded-l-sm text-[8px]"
                >
                  Choose
                </Label>
                <span className="bg-gray-800 border border-gray-700 border-l-0 text-gray-500 px-1 py-0.5 rounded-r-sm flex-grow text-[8px] truncate">
                  {fileName}
                </span>
              </div>
              {errors.image && (
                <span className="text-red-500 text-[8px]">
                  {errors.image.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="twitterUsername"
                className="text-green-400 text-[10px]"
              >
                twitter username<span className="text-red-500">*</span>
              </Label>
              <Input
                id="twitterUsername"
                {...register("twitterUsername", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-800 border-gray-700 text-white"
              />
              {errors.twitterUsername && (
                <span className="text-red-500 text-[8px]">
                  {errors.twitterUsername.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="telegramUsername"
                className="text-green-400 text-[10px]"
              >
                telegram (optional)
              </Label>
              <Input
                id="telegramUsername"
                {...register("telegramUsername")}
                className="h-5 text-[10px] bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="website" className="text-green-400 text-[10px]">
                website (optional)
              </Label>
              <Input
                id="website"
                {...register("website")}
                className="h-5 text-[10px] bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <p className="text-[8px] text-gray-500">
              Tip: coin data cannot be changed after creation
            </p>

            <Button
              type="submit"
              className="w-full h-6 bg-green-600 hover:bg-green-700 text-white text-[10px]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create coin"}
            </Button>
          </form>
        </ScrollArea>
        <p className="text-[8px] text-center text-gray-500 p-2 border-t border-green-500">
          When your coin completes its bonding curve you receive 0.5 SOL
        </p>
      </DialogContent>
    </Dialog>
  );
}

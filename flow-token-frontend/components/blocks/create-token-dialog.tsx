"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { createClient } from "@/utils/supabase/client";
import { useAccount, useWriteContract } from "wagmi";
import { contract_abi } from "@/abi/TokenFactoryAbi";
import { flowTestnet } from "viem/chains";
import { useModal } from "connectkit";
import { v4 as uuidv4 } from "uuid";
import { parseEther } from "viem";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type FormData = {
  name: string;
  ticker: string;
  description: string;
  image: FileList;
  twitterUsername: string;
  telegramUsername?: string;
  website?: string;
};

export default function CreateTokenDialog() {
  const {
    writeContractAsync,
    data: hash,
    variables,
    status,
    isPending,
  } = useWriteContract();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { setOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const [fileName, setFileName] = useState("No file chosen");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const createCoin = async (data: FormData) => {
    const supabase = createClient();

    if (!selectedFile) {
      throw new Error("No file selected");
    }

    const fileExtension = fileName.split(".").pop();
    const fileNameWithExtension = `${uuidv4()}.${fileExtension}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("token_images")
      .upload(`images/${fileNameWithExtension}`, selectedFile);
    if (uploadError) {
      throw uploadError;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;

    writeContractAsync({
      abi: contract_abi,
      address: process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS! as `0x${string}`,
      chain: flowTestnet,
      value: parseEther("0.001"),
      functionName: "createMemeToken",
      args: [data.name, data.ticker, imageUrl, data.description],
    });

    const { data: created_token, error } = await supabase
      .from("Tokens")
      .insert({
        name: data.name,
        ticker: data.ticker,
        description: data.description,
        image: imageUrl,
        twitter: data.twitterUsername,
        telegram: data.telegramUsername,
        created_by: address?.toLowerCase(),
        website: data.website,
      });

    if (error) {
      console.error("Database insertion error:", error);
    }

    return created_token;
  };

  useEffect(() => {
    if (
      variables?.functionName == "createMemeToken" &&
      hash &&
      status == "success"
    ) {
      alert("Token created successfully");
      setIsOpen(false);
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [hash, variables, status, reset]);

  const mutation = useMutation({
    mutationFn: createCoin,
    onSuccess: (data) => {
      console.log("Mutation successful:", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFileName("No file chosen");
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-green-500">
        <CardHeader>
          <CardTitle className="text-sm text-gray-700 dark:text-green-400">
            Create New Token
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-2">
            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              {errors.name && (
                <span className="text-red-500 text-[8px]">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="ticker"
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                ticker
              </Label>
              <Input
                id="ticker"
                {...register("ticker", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
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
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                description
              </Label>
              <Textarea
                id="description"
                {...register("description", { required: "Required" })}
                className="h-16 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
              />
              {errors.description && (
                <span className="text-red-500 text-[8px]">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="image"
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                image
              </Label>
              <div className="flex flex-col items-center">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Required",
                    onChange: handleFileChange,
                  })}
                  className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                {previewUrl && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                )}
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
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                twitter username<span className="text-red-500">*</span>
              </Label>
              <Input
                id="twitterUsername"
                {...register("twitterUsername", { required: "Required" })}
                className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
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
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                telegram (optional)
              </Label>
              <Input
                id="telegramUsername"
                {...register("telegramUsername")}
                className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="website"
                className="text-gray-600 dark:text-green-400 text-[10px]"
              >
                website (optional)
              </Label>
              <Input
                id="website"
                {...register("website")}
                className="h-5 text-[10px] bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <p className="text-[8px] text-gray-500 dark:text-gray-400">
              Tip: coin data cannot be changed after creation
            </p>

            <Button
              type="submit"
              className="w-full h-6 bg-green-600 hover:bg-green-700 text-white text-[10px]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Token"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

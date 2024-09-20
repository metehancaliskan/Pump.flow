'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { useAccount } from 'wagmi'

type FormData = {
    name: string
    ticker: string
    description: string
    image: FileList
    twitterUsername: string
    telegramUsername?: string
    website?: string
}

const createCoin = async (data: FormData) => {
    const supabase = createClient();

    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('token_images')
        .upload(`images/${data.image[0].name}`, data.image[0]);

    if (uploadError) {
        throw uploadError;
    }

    const imageUrl = uploadData.fullPath;

    const { data: created_token, error } = await supabase
        .from('Tokens')
        .insert({
            name: data.name,
            ticker: data.ticker,
            description: data.description,
            image: imageUrl,
            twitter: data.twitterUsername,
            telegram: data.telegramUsername,
            website: data.website,
        })
}

export default function Component() {
    const { address, isConnected, isDisconnected } = useAccount();
    const [fileName, setFileName] = useState('No file chosen')
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const mutation = useMutation({
        mutationFn: createCoin,
        onSuccess: (data) => {
            console.log('Mutation successful:', data)
            // Handle success (e.g., show a success message, redirect, etc.)
        },
        onError: (error) => {
            console.error('Mutation error:', error)
            // Handle error (e.g., show an error message)
        }
    })


    const onSubmit = (data: FormData) => {
        mutation.mutate(data)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-6 flex flex-col items-center">
            <div className="w-full max-w-md space-y-6">
                <div className="text-sm">
                    <a href="#" className="text-blue-400 hover:underline">[go back]</a>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-blue-400">name</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="ticker" className="text-blue-400">ticker</Label>
                        <Input
                            id="ticker"
                            {...register("ticker", { required: "Ticker is required" })}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.ticker && <span className="text-red-500 text-sm">{errors.ticker.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-blue-400">description</Label>
                        <Textarea
                            id="description"
                            {...register("description", { required: "Description is required" })}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="image" className="text-blue-400">image</Label>
                        <div className="flex">
                            <Input
                                id="image"
                                type="file"
                                {...register("image", { required: "Image is required" })}
                                className="hidden"
                                onChange={(e) => setFileName(e.target.files?.[0]?.name || 'No file chosen')}
                            />
                            <Label htmlFor="image" className="cursor-pointer bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-l-md">Choose File</Label>
                            <span className="bg-gray-800 border border-gray-700 border-l-0 text-gray-500 px-4 py-2 rounded-r-md flex-grow">{fileName}</span>
                        </div>
                        {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="twitterUsername" className="text-blue-400">twitter username<span className="text-red-500">*</span></Label>
                        <Input
                            id="twitterUsername"
                            {...register("twitterUsername", { required: "Twitter username is required" })}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.twitterUsername && <span className="text-red-500 text-sm">{errors.twitterUsername.message}</span>}
                    </div>

                    <div>
                        <Label htmlFor="telegramUsername" className="text-blue-400">telegram username</Label>
                        <Input
                            id="telegramUsername"
                            {...register("telegramUsername")}
                            placeholder="(optional)"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <div>
                        <Label htmlFor="website" className="text-blue-400">website</Label>
                        <Input
                            id="website"
                            {...register("website")}
                            placeholder="(optional)"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <p className="text-sm text-gray-500">Tip: coin data cannot be changed after creation</p>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating...' : 'Create coin'}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    When your coin completes its bonding curve you receive 0.5 SOL
                </p>
            </div>
        </div>
    )
}
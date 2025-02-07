"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

type FormData = {
    email: string
    requestType: string
    summary: string
    description: string
}

export default function SupportRequestPage() {
    // const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        // control,
    } = useForm<FormData>()

    const onSubmit = (data: FormData) => {
        // Here you would typically send the form data to your backend
        console.log(data)
        // For now, we'll just log the data and show an alert
        alert("Form submitted successfully!")
        // Optionally, redirect to a thank you page
        // router.push('/thank-you')
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Support Request Form</CardTitle>
                    <CardDescription>Please fill out the form below to submit your request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requestType">Type of Request</Label>
                            <Select {...register("requestType", { required: "Request type is required" })}>
                                <SelectTrigger id="requestType">
                                    <SelectValue placeholder="Select request type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bug">Bug</SelectItem>
                                    <SelectItem value="requirement">Requirement</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.requestType && <p className="text-red-500 text-sm">{errors.requestType.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Input
                                id="summary"
                                placeholder="Brief summary of your request"
                                {...register("summary", { required: "Summary is required" })}
                            />
                            {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Detailed description of your request"
                                {...register("description", { required: "Description is required" })}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Submit Request
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


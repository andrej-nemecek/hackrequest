"use client"

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ticketSchema, TicketFormData } from "@/lib/schemas";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SupportRequestPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")


    const { projectId } = useParams();




    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            projectId: String(projectId) ?? '', // Use projectId from useParams or an empty string if not available
        },
    });





    const onSubmit: SubmitHandler<TicketFormData> = async (data) => {
        setIsSubmitting(true)
        setSubmitStatus("idle")

        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json();
            setSubmitStatus("success")
        } catch (error) {
            setSubmitStatus("error")
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false)
        }
    }


    return (



        < div className="container mx-auto p-4" >
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
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: "Request type is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger id="requestType">
                                            <SelectValue placeholder="Select request type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bug">Bug</SelectItem>
                                            <SelectItem value="feature">Requirement</SelectItem>
                                            <SelectItem value="consultation">Consultation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
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
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </Button>

                    </form>
                </CardContent>
                <CardFooter>
                    {submitStatus === "success" && (
                        <Alert className="w-full">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                                Your ticket was successfully submitted. Please check your email to confirm the request.
                            </AlertDescription>
                        </Alert>
                    )}
                    {submitStatus === "error" && (
                        <Alert variant="destructive" className="w-full">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>There was a problem submitting your request. Please try again later.</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div >
    )
}


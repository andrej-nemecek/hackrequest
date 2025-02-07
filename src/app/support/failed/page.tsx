import { XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerificationFailedPage() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Verification Failed
          </CardTitle>
          <CardDescription className="text-center">
            We couldn&apos;t verify your support request. This could be due to
            an expired or invalid verification link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            If you believe this is an error, please try submitting your request
            again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

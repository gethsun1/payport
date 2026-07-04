import { AlertCircle, Loader2, PackageOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({ label = "Loading PayPort data" }: { label?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </CardContent>
    </Card>
  );
}

export function ErrorState({ title = "Something needs attention", message }: { title?: string; message: string }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex gap-3 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-destructive" />
        <div>
          <h2 className="text-sm font-semibold text-red-950">{title}</h2>
          <p className="mt-1 text-sm text-red-800">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-5">
        <PackageOpen className="mt-0.5 h-5 w-5 flex-none text-muted-foreground" />
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

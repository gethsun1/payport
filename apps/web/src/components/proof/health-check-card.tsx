import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthCheckCard({
  title,
  ok,
  latencyMs,
  detail
}: {
  title: string;
  ok: boolean;
  latencyMs?: number;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {ok ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <XCircle className="h-4 w-4 text-destructive" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
        {latencyMs !== undefined ? <p className="mt-2 text-xs text-muted-foreground">{latencyMs}ms</p> : null}
      </CardContent>
    </Card>
  );
}

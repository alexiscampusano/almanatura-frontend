import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProjectImpactEntry,
  useProjectImpactEntries,
} from "@/hooks/use-project-impact";

function toLocalDatetimeInput(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function formatRecordedAt(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  projectId: number;
};

export function ProjectImpactSection({ projectId }: Props) {
  const { data: entries, isLoading } = useProjectImpactEntries(projectId);
  const createMutation = useCreateProjectImpactEntry(projectId);

  const [metricLabel, setMetricLabel] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedAt, setRecordedAt] = useState(() =>
    toLocalDatetimeInput(new Date().toISOString()),
  );

  function resetForm() {
    setMetricLabel("");
    setNumericValue("");
    setNotes("");
    setRecordedAt(toLocalDatetimeInput(new Date().toISOString()));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const recordedIso = recordedAt
      ? new Date(recordedAt).toISOString()
      : new Date().toISOString();
    const trimmedNotes = notes.trim();
    const numTrim = numericValue.trim();
    createMutation.mutate(
      {
        recordedAt: recordedIso,
        metricLabel: metricLabel.trim(),
        ...(numTrim !== "" && !Number.isNaN(Number(numTrim))
          ? { numericValue: Number(numTrim) }
          : {}),
        ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      },
      {
        onSuccess: () => resetForm(),
      },
    );
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div>
        <h3 className="text-[var(--text-size-sm)] font-semibold">
          Indicadores de impacto
        </h3>
        <p className="mt-1 text-[var(--text-size-xs)] text-muted-foreground">
          Registros de seguimiento asociados a este proyecto (aparecen en
          reportes).
        </p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
        </div>
      )}

      {!isLoading && entries && entries.length === 0 && (
        <p className="text-[var(--text-size-sm)] text-muted-foreground">
          Aún no hay indicadores registrados.
        </p>
      )}

      {!isLoading && entries && entries.length > 0 && (
        <ul className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2 text-[var(--text-size-sm)]">
          {entries.map((row) => (
            <li
              key={row.id}
              className="border-b border-border/50 pb-2 last:border-0 last:pb-0"
            >
              <div className="font-medium">{row.metricLabel}</div>
              <div className="text-[var(--text-size-xs)] text-muted-foreground">
                {formatRecordedAt(row.recordedAt)}
                {row.numericValue != null && (
                  <span className="ml-2">· Valor: {row.numericValue}</span>
                )}
              </div>
              {row.notes && (
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {row.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`impact-recorded-${projectId}`}>Fecha registro</Label>
          <Input
            id={`impact-recorded-${projectId}`}
            type="datetime-local"
            required
            value={recordedAt}
            onChange={(e) => setRecordedAt(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`impact-metric-${projectId}`}>Indicador *</Label>
          <Input
            id={`impact-metric-${projectId}`}
            required
            maxLength={255}
            placeholder="Ej. Hogares alcanzados"
            value={metricLabel}
            onChange={(e) => setMetricLabel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`impact-number-${projectId}`}>Valor numérico</Label>
          <Input
            id={`impact-number-${projectId}`}
            type="number"
            step="any"
            placeholder="Opcional"
            value={numericValue}
            onChange={(e) => setNumericValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`impact-notes-${projectId}`}>Notas</Label>
          <Textarea
            id={`impact-notes-${projectId}`}
            rows={2}
            maxLength={10_000}
            placeholder="Detalle o contexto (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Guardando..." : "Añadir indicador"}
        </Button>
      </form>
    </div>
  );
}

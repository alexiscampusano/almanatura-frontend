import { useState } from "react";
import { ClockCounterClockwise, ArrowDown } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useApplicationHistory } from "@/hooks/use-admin-applications";
import { APPLICATION_STATUS_LABELS } from "@/lib/application-status";
import { formatDateLong } from "@/lib/datetime";
import type { ApplicationStatus } from "@/types/application";

function statusBadgeVariant(
  status: ApplicationStatus | null,
): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline";
  if (status === "REJECTED") return "destructive";
  if (status === "APPROVED" || status === "REGISTERED_AS_ACTOR")
    return "default";
  if (status === "SUBMITTED" || status === "UNDER_REVIEW") return "secondary";
  return "outline";
}

export function ApplicationHistoryDialog({
  applicationId,
  applicantName,
}: {
  applicationId: number;
  applicantName: string;
}) {
  const [open, setOpen] = useState(false);
  const {
    data: history,
    isLoading,
    isError,
  } = useApplicationHistory(applicationId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Ver historial"
          >
            <ClockCounterClockwise size={18} weight="bold" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Historial de la solicitud</DialogTitle>
          <p className="text-sm text-muted-foreground">{applicantName}</p>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex py-8 justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive py-4 text-center">
              Ocurrió un error al cargar el historial.
            </p>
          )}

          {history && history.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No hay registros de historial.
            </p>
          )}

          {history && history.length > 0 && (
            <div className="relative border-l-2 border-muted pl-6 ml-3 space-y-6">
              {history.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {log.oldStatus ? (
                        <>
                          <Badge
                            variant={statusBadgeVariant(log.oldStatus)}
                            className="text-[0.65rem] px-1.5 py-0"
                          >
                            {APPLICATION_STATUS_LABELS[log.oldStatus]}
                          </Badge>
                          <ArrowDown
                            size={14}
                            className="text-muted-foreground"
                          />
                        </>
                      ) : null}
                      <Badge variant={statusBadgeVariant(log.newStatus)}>
                        {APPLICATION_STATUS_LABELS[log.newStatus]}
                      </Badge>
                    </div>

                    <div className="text-sm mt-0.5">
                      <span className="font-semibold text-foreground/80">
                        Por:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {log.changedBy === "system"
                          ? "Sistema (Postulación inicial)"
                          : log.changedBy}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDateLong(log.changedAt)}
                    </div>

                    {log.notes && (
                      <div className="mt-2 text-xs italic text-muted-foreground bg-muted/40 border-l-2 border-primary/40 pl-3 py-2 rounded-r-md">
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActors } from "@/hooks/use-actors";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-rose-600",
    "bg-amber-600",
    "bg-emerald-600",
    "bg-sky-600",
    "bg-violet-600",
    "bg-fuchsia-600",
    "bg-teal-600",
    "bg-orange-600",
  ];
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function AdminActorsPage() {
  const { data: actors, isLoading, isError } = useActors();
  const [search, setSearch] = useState("");

  const filtered = actors?.filter((actor) =>
    actor.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Actores</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-4xl">
        <h2 className="text-2xl font-semibold">Actores</h2>
        <p className="mt-4 text-sm text-destructive">
          No se pudo cargar el directorio de actores. Inténtalo nuevamente.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <h2 className="text-2xl font-semibold">Actores</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Directorio de actores vinculados a los proyectos.
      </p>

      <div className="mt-4">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered?.length ?? 0} actores encontrados
      </p>

      {filtered && filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((actor) => (
            <Card key={actor.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(actor.fullName)}`}
                  >
                    {getInitials(actor.fullName)}
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="truncate">{actor.fullName}</CardTitle>
                    <CardContent className="p-0 text-xs text-muted-foreground">
                      {actor.region}
                    </CardContent>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          No se encontraron actores.
        </p>
      )}
    </section>
  );
}

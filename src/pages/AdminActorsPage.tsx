import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AdminPage,
  adminListRegionClassName,
} from "@/components/admin/admin-page";
import { MobileFilterSheet } from "@/components/admin/mobile-filter-sheet";
import { useActors } from "@/hooks/use-actors";
import { getAvatarColor, getInitials } from "@/lib/avatar";
import { ALL_PILLARS, PILLAR_LABELS } from "@/lib/project";
import type { ProjectPillar } from "@/types/project";

export default function AdminActorsPage() {
  const [search, setSearch] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<
    ProjectPillar | undefined
  >(undefined);

  const {
    data: actors,
    isLoading,
    isError,
  } = useActors(selectedPillar ? { pillar: selectedPillar } : undefined);

  const filtered = actors?.filter((actor) =>
    actor.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPillar !== undefined) count++;
    if (search.trim() !== "") count++;
    return count;
  }, [selectedPillar, search]);

  const filterContent = (
    <>
      <div className="space-y-2">
        <Label htmlFor="actor-search">Buscar por nombre</Label>
        <Input
          id="actor-search"
          placeholder="Nombre del actor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Categoría</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedPillar === undefined ? "default" : "outline"}
            className="w-full"
            onClick={() => setSelectedPillar(undefined)}
          >
            Todos
          </Button>
          {ALL_PILLARS.map((pillar) => (
            <Button
              key={pillar}
              variant={selectedPillar === pillar ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedPillar(pillar)}
            >
              {PILLAR_LABELS[pillar]}
            </Button>
          ))}
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Actores</h2>
        <div
          className={`${adminListRegionClassName} mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`}
        >
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
      </AdminPage>
    );
  }

  if (isError) {
    return (
      <AdminPage>
        <h2 className="text-2xl font-semibold">Actores</h2>
        <p className="mt-4 text-sm text-destructive">
          No se pudo cargar el directorio de actores. Inténtalo nuevamente.
        </p>
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <h2 className="text-2xl font-semibold">Actores</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Directorio de actores vinculados a los proyectos.
      </p>

      {/* Desktop filters */}
      <div className="mt-4 hidden gap-4 md:flex md:items-end md:flex-wrap">
        <div className="w-full max-w-md space-y-2">
          <Label htmlFor="actor-search-desktop">Buscar por nombre</Label>
          <Input
            id="actor-search-desktop"
            placeholder="Nombre del actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPillar === undefined ? "default" : "outline"}
            className="shrink-0 px-5"
            onClick={() => setSelectedPillar(undefined)}
          >
            Todos
          </Button>
          {ALL_PILLARS.map((pillar) => (
            <Button
              key={pillar}
              variant={selectedPillar === pillar ? "default" : "outline"}
              className="shrink-0 px-5"
              onClick={() => setSelectedPillar(pillar)}
            >
              {PILLAR_LABELS[pillar]}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet activeFilterCount={activeFilterCount}>
        {filterContent}
      </MobileFilterSheet>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered?.length ?? 0} actores encontrados
      </p>

      <div className={adminListRegionClassName}>
        {filtered && filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((actor) => (
              <Link
                key={actor.id}
                to={`/admin/actors/${actor.id}`}
                className="block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Card className="h-full p-4">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-[var(--size-avatar)] w-[var(--size-avatar)] shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(actor.fullName)}`}
                      >
                        {getInitials(actor.fullName)}
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="truncate">
                          {actor.fullName}
                        </CardTitle>
                        <CardContent className="p-0 text-xs text-muted-foreground">
                          {actor.region}
                        </CardContent>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No se encontraron actores.
          </p>
        )}
      </div>
    </AdminPage>
  );
}

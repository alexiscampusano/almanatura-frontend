export function PublicHomePage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        Agenda cultural
      </p>
      <h1 className="text-balance text-3xl font-semibold">
        Actividades para fortalecer la vida rural.
      </h1>
      <p className="text-pretty text-base text-muted-foreground">
        Esta vista publica consumira los eventos activos desde
        <span className="font-medium"> /api/v1/events</span> en las siguientes
        tareas.
      </p>
    </section>
  );
}

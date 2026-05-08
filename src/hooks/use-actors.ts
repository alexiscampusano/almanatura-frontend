import { useQuery } from "@tanstack/react-query";

import { getActors } from "@/services/actors.service";

export function useActors() {
  return useQuery({
    queryKey: ["actors"],
    queryFn: getActors,
  });
}

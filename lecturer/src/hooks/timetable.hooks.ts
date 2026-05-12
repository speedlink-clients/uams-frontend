import { useQuery } from "@tanstack/react-query";
import { TimetableService } from "@services/timetable.service";
import type { TimetableEntry } from "@type/timetable.type";

 export const TimetableHook = {
  useTimetable: (filters?: { session?: string; semester?: string }, enabled = false) => {
    return useQuery<TimetableEntry[]>({
      queryKey: ["timetables", filters],
      queryFn: () => TimetableService.getTimetable(filters),
      enabled: enabled && !!filters?.session && !!filters?.semester,
    });
  },
};
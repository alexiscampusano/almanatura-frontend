import type {
  ApplicationSubmittedResponse,
  SubmitApplicationPayload,
} from "@/types/application";

import { apiClient } from "./api.client";

export async function submitApplication(
  data: SubmitApplicationPayload,
): Promise<ApplicationSubmittedResponse> {
  const response = await apiClient.post<ApplicationSubmittedResponse>(
    "/applications",
    data,
  );
  return response.data;
}

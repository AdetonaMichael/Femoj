import useSWR from "swr";
import phoneNumberService, {
  AvailableNumbersParams,
  SearchPhoneNumbersParams,
  ApiResponse,
  PhoneNumber,
} from "@/lib/phoneNumberService";

/**
 * Hook to fetch available phone numbers
 */
export function useAvailableNumbers(params: AvailableNumbersParams) {
  const { data, error, isLoading, mutate } = useSWR(
    params ? ["available-numbers", params] : null,
    async () => {
      console.log("[useAvailableNumbers] Fetching with params:", params);
      try {
        const response = await phoneNumberService.getAvailableNumbers(params);
        console.log("[useAvailableNumbers] Got response:", response);
        return response;
      } catch (err) {
        console.error("[useAvailableNumbers] Fetch failed:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  if (error) console.error("[useAvailableNumbers] Error:", error);

  return {
    numbers: data?.data || [],
    isLoading,
    error: error?.message,
    mutate,
    pagination: data?.pagination,
  };
}

/**
 * Hook to search phone numbers
 */
export function useSearchPhoneNumbers(params: SearchPhoneNumbersParams | null) {
  const { data, error, isLoading, mutate } = useSWR(
    params ? ["search-phone-numbers", params] : null,
    async () => {
      if (!params) return null;
      const response = await phoneNumberService.searchPhoneNumbers(params);
      return response;
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    results: data?.results || [],
    isLoading,
    error: error?.message,
    mutate,
    pagination: data?.pagination,
  };
}

/**
 * Hook to fetch user's phone numbers
 */
export function useMyPhoneNumbers(status?: "active" | "pending" | "deleted") {
  const { data, error, isLoading, mutate } = useSWR(
    ["my-phone-numbers", status],
    async () => {
      const response = await phoneNumberService.getMyPhoneNumbers({ status });
      return response;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    phoneNumbers: data?.phone_numbers || [],
    isLoading,
    error: error?.message,
    mutate,
    pagination: data?.pagination,
  };
}

/**
 * Hook to fetch supported countries
 */
export function useSupportedCountries(limit?: number, offset?: number) {
  const { data, error, isLoading } = useSWR(
    ["supported-countries", limit, offset],
    async () => {
      console.log("[useSupportedCountries] Starting fetch...", { limit, offset });
      try {
        const response = await phoneNumberService.getSupportedCountries(limit, offset);
        console.log("[useSupportedCountries] Got response:", response);
        return response;
      } catch (err) {
        console.error("[useSupportedCountries] Fetch failed:", err);
        throw err;
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  console.log("[useSupportedCountries] State:", { isLoading, error, hasData: !!data });

  // New format returns array directly, not object
  const countriesArray = Array.isArray(data?.data?.data) ? data.data.data : [];

  return {
    countries: countriesArray,
    pagination: data?.data?.pagination,
    isLoading,
    error: error?.message,
  };
}

/**
 * Hook to fetch phone number types
 */
export function usePhoneNumberTypes() {
  const { data, error, isLoading } = useSWR(
    "phone-number-types",
    async () => {
      const response = await phoneNumberService.getPhoneNumberTypes();
      return response;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  return {
    types: data?.data || {},
    isLoading,
    error: error?.message,
  };
}

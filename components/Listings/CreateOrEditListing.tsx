import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useMutateData } from "@/hooks/useMutateData";
import { useListings } from "@/context/ListingsProvider";
import { useEditListing } from "@/context/EditListingProvider";
import { useDraggableMarker } from "@/context/DraggableMarkerProvider";
import { listingFormSchema } from "@/lib/validations";
import Form from "@/components/Listings/Form";

export default function CreateOrEditListing() {
  const { meadowId, setDashboardFor } = useListings();

  const { position, setPosition, setIcon, setHasClickedMap } =
    useDraggableMarker();

  const { currentListing, setCurrentListing } = useEditListing();

  const queryClient = useQueryClient();

  const isCreateMode = !currentListing;

  const {
    mutate: mutateListing,
    isPending: isLoading,
    isSuccess,
  } = useMutateData({
    requestConfig: {
      url: isCreateMode
        ? `/api/${meadowId}/listings`
        : `/api/listings/${currentListing.id}`,
      method: isCreateMode ? "POST" : "PATCH",
    },
    queryKey: [`meadow-${meadowId}`],
    queryClient: queryClient,
    dataTransformer: (values: z.infer<typeof listingFormSchema>) => ({
      listing: {
        ...values,
        ...position,
      },
    }),
  });

  useEffect(() => {
    if (isSuccess) {
      setDashboardFor(isCreateMode ? "view" : "manage");
      setPosition(null);
      setHasClickedMap(false);
      setIcon("📍");
      if (!isCreateMode) {
        setCurrentListing(null);
      }
    }
  }, [
    isSuccess,
    setDashboardFor,
    setPosition,
    setIcon,
    setHasClickedMap,
    setCurrentListing,
    isCreateMode,
  ]);

  return (
    <div className="mb-2">
      {!position ? (
        <div className="font-medium text-red-600">
          Click the map at the location where the food is.
        </div>
      ) : (
        <div className="font-medium text-green-500">
          <div>You can drag the marker to change location.</div>
        </div>
      )}
      <Form
        schema={listingFormSchema}
        defaultValues={{
          location: isCreateMode ? "" : currentListing.location,
          caption: isCreateMode ? "" : currentListing.caption || "",
          contact: isCreateMode ? "" : currentListing.contact || "",
          icon: isCreateMode ? "📍" : currentListing.icon,
        }}
        onSubmit={mutateListing}
        isLoading={isLoading}
        disabled={!position}
      />
    </div>
  );
}
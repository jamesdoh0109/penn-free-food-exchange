import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useMutateData } from "@/hooks/useMutateData";
import { useListingImage } from "@/context/ListingImageProvider";
import { useListings } from "@/context/ListingsProvider";
import { useEditListing } from "@/context/EditListingProvider";
import { useDraggableMarker } from "@/context/DraggableMarkerProvider";
import { listingFormSchema } from "@/lib/validations";
import Form from "@/components/common/Form/Form";

export default function CreateOrEditListing() {
  const { setDashboardFor } = useListings();

  const { position, setPosition, setIcon } = useDraggableMarker();

  const { currentListing, setCurrentListing } = useEditListing();

  const queryClient = useQueryClient();

  const isCreateMode = !currentListing;

  const {
    imageUrl,
    setImageUrl,
    imageOperationInProgress,
    imageError,
    setImageError,
  } = useListingImage();

  const imageInput = isCreateMode
    ? [
        {
          name: "image",
          label: "Image (optional)",
          type: "file",
          disabled: !position || imageOperationInProgress || imageUrl !== "",
        },
      ]
    : [];

  const {
    mutate,
    isPending: isLoading,
    isSuccess,
    error,
  } = useMutateData({
    requestConfig: {
      url: isCreateMode
        ? `/api/listings`
        : `/api/listings/${currentListing.id}`,
      method: isCreateMode ? "POST" : "PATCH",
    },
    queryClient: queryClient,
    dataTransformer: (values: z.infer<typeof listingFormSchema>) => ({
      listing: {
        ...values,
        ...position,
      },
    }),
  });

  async function createOrEditListing(
    values: z.infer<typeof listingFormSchema>
  ) {
    const valuesWithImageUrl = {
      icon: values.icon,
      location: values.location,
      caption: values.caption,
      contact: values.contact,
      imageUrl: currentListing?.imageUrl ? currentListing?.imageUrl : imageUrl,
    };

    mutate(valuesWithImageUrl);
  }

  useEffect(() => {
    if (isSuccess) {
      setDashboardFor(isCreateMode ? "view" : "manage");
      setPosition(null);
      setIcon("📍");
      if (imageUrl) {
        setImageUrl("");
      }
      if (imageError) {
        setImageError(null);
      }
      if (!isCreateMode) {
        setCurrentListing(null);
      }
    }
  }, [
    isSuccess,
    setDashboardFor,
    setPosition,
    setIcon,
    setCurrentListing,
    setImageUrl,
    setImageError,
    isCreateMode,
    imageUrl,
    imageError,
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
        inputs={[
          {
            name: "icon",
            label: "Marker Icon",
            type: "select",
            disabled: !position,
          },
          {
            name: "location",
            label: "Location",
            type: "text",
            disabled: !position,
          },
          {
            name: "caption",
            label: "Caption",
            type: "textarea",
            disabled: !position,
          },
          {
            name: "contact",
            label: "Contact (optional)",
            type: "phone",
            disabled: !position,
          },
          ...imageInput,
        ]}
        handleSubmit={createOrEditListing}
        isLoadingFromMutateFunction={isLoading}
        btnText="Save"
        btnLoadingText="Saving"
        btnDisabled={!position || imageOperationInProgress}
        showLabel={true}
        setIcon={setIcon}
        error={imageError || error}
        formStyles="space-y-8 mb-2"
      />
    </div>
  );
}

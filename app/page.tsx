import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getListOfMeadows } from "@/lib/queryFns";
import SectionContainer from "@/components/Home/SectionContainer";

export default async function Page() {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["meadows"],
      queryFn: () => getListOfMeadows(),
    });
  } catch (error: any) {
    const errorMessage =
      "message" in error ? error.message : "Something went wrong";
    return <div>{errorMessage}</div>;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SectionContainer />
    </HydrationBoundary>
  );
}

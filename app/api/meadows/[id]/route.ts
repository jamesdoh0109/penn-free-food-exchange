import { NotFoundError, ServerError } from "@/lib/errors";
import { getMeadowByIdService } from "@/server/service/meadow";

export async function GET(request: Request) {
  try {
    const meadowId = request.url.split("/")[5];
    const meadow = await getMeadowByIdService(meadowId);
    return new Response(JSON.stringify(meadow), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(error.message, {
        status: 404,
      });
    } else if (error instanceof ServerError) {
      return new Response(error.message, {
        status: 500,
      });
    }
  }
}
import { Dispatch, SetStateAction } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import ButtonOnClick from "@/components/common/Button/ButtonOnClick";

type FullScreenToggle = {
  isSmallScreen: boolean;
  showFullScreen: boolean;
  setShowFullScreen: Dispatch<SetStateAction<boolean>>;
};

export default function FullScreenToggle({
  isSmallScreen,
  showFullScreen,
  setShowFullScreen,
}: FullScreenToggle) {
  return isSmallScreen ? (
    <ButtonOnClick
      variant="secondary"
      btnIcon={showFullScreen ? <ChevronUp /> : <ChevronDown />}
      onClick={() =>
        setShowFullScreen((prevShowFullScreen) => !prevShowFullScreen)
      }
      btnStyles={`py-0 h-[24px] absolute z-20 left-1/2 ml-[-24px] ${
        showFullScreen ? "bottom-0" : "top-1/2 mt-[-4px]"
      } `}
    />
  ) : (
    <ButtonOnClick
      variant="secondary"
      btnIcon={showFullScreen ? <ChevronLeft /> : <ChevronRight />}
      onClick={() =>
        setShowFullScreen((prevShowFullScreen) => !prevShowFullScreen)
      }
      btnStyles={`px-0 absolute z-20 top-1/2 ${
        showFullScreen ? "right-0" : "right-1/3"
      } `}
    />
  );
}

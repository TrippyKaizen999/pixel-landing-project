import PlaceholderPage from "./PlaceholderPage";
import { Upload as UploadIcon } from "lucide-react";

export default function Upload() {
  return (
    <PlaceholderPage
      title="Upload Clips & Screenshots"
      description="Upload your Overwatch 2 gameplay clips and scoreboard screenshots for AI analysis and coaching feedback."
      icon={UploadIcon}
    />
  );
}

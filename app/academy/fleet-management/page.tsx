import CoursePage from "@/components/CoursePage";
import { courses } from "@/lib/content";

export default function FleetCoursePage() {
  return <CoursePage course={courses[2]} />;
}
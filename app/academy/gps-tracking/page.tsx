import CoursePage from "@/components/CoursePage";
import { courses } from "@/lib/content";

export default function GpsCoursePage() {
  return <CoursePage course={courses[0]} />;
}
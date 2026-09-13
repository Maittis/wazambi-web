import CoursePage from "@/components/CoursePage";
import { courses } from "@/lib/content";

export default function FuelCoursePage() {
  return <CoursePage course={courses[1]} />;
}
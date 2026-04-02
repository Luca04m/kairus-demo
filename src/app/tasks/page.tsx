import { AppHeader } from "@/components/AppHeader";
import { TasksContent } from "@/components/TasksContent";

export default function TasksPage() {
  return (
    <>
      <AppHeader title="Tarefas" />
      <div className="flex-1 overflow-auto">
        <TasksContent />
      </div>
    </>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PROJECT_HIATUS_MESSAGE } from "@/lib/projectStatus";

type ProjectHiatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectHiatusDialog = ({ open, onOpenChange }: ProjectHiatusDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Project is on hiatus</AlertDialogTitle>
          <AlertDialogDescription>{PROJECT_HIATUS_MESSAGE}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

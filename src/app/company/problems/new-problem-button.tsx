"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ProblemFormDialog } from "@/components/company/problem-form-dialog";
import { Button } from "@/components/ui/button";

export function NewProblemButton({ approved }: { approved: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button disabled={!approved} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> New problem
      </Button>
      {!approved && (
        <span className="sr-only">Approval required to create problems</span>
      )}
      <ProblemFormDialog
        open={open}
        onOpenChange={setOpen}
        approved={approved}
      />
    </>
  );
}

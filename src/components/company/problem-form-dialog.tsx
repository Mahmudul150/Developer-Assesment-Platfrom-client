"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createProblem, updateProblem } from "@/api/problem.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys } from "@/lib/query-keys";
import { problemSchema } from "@/schemas/problem.schema";
import { ApiError } from "@/types/api";
import type { Problem } from "@/types/problem";
import type { CreateProblemPayload } from "@/types/requests";

function toFormDefault(problem?: Problem) {
  return {
    title: problem?.title ?? "",
    description: problem?.description ?? "",
    type: (problem?.type ?? "MCQ") as "MCQ" | "WRITTEN" | "CODING",
    difficulty: (problem?.difficulty ?? "EASY") as "EASY" | "MEDIUM" | "HARD",
    points: problem?.points ?? 10,
    options: (
      problem?.options ?? [
        { id: "A", text: "" },
        { id: "B", text: "" },
      ]
    ).map((option, index) =>
      typeof option === "string"
        ? { id: String.fromCharCode(65 + index), text: option }
        : { id: option.id, text: option.text },
    ),
    correctAnswer: problem?.correctAnswer ?? "",
    testCases: (problem?.testCases ?? []).map((testCase) => ({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      hidden: testCase.hidden ?? false,
    })),
  };
}

export function ProblemFormDialog({
  open,
  onOpenChange,
  problem,
  approved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem?: Problem;
  approved: boolean;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(problem);

  const mutation = useMutation({
    mutationFn: (payload: CreateProblemPayload) =>
      isEdit && problem
        ? updateProblem(problem.id, payload)
        : createProblem(payload),
    onSuccess: () => {
      toast.success(isEdit ? "Problem updated" : "Problem created");
      onOpenChange(false);
      void queryClient.invalidateQueries({ queryKey: queryKeys.problems() });
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not save problem",
      ),
  });

  const form = useForm({
    defaultValues: toFormDefault(problem),
    validators: { onChange: problemSchema },
    onSubmit: async ({ value }) => {
      const payload: CreateProblemPayload = {
        title: value.title,
        description: value.description,
        type: value.type,
        difficulty: value.difficulty,
        points: value.points,
        options:
          value.type === "MCQ"
            ? value.options.filter((option) => option.text.trim())
            : undefined,
        correctAnswer: value.type === "MCQ" ? value.correctAnswer : undefined,
        testCases:
          value.type === "CODING"
            ? value.testCases.filter((testCase) => testCase.input.trim())
            : undefined,
      };
      await mutation.mutateAsync(payload);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit problem" : "New problem"}
      className="max-w-2xl"
    >
      <form
        className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="title">
          {(field) => (
            <FormField
              label="Title"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <FormField
              label="Description"
              error={fieldError(field.state.meta.errors)}
            >
              <Textarea
                rows={4}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <div className="grid grid-cols-3 gap-3">
          <form.Field name="type">
            {(field) => (
              <FormField label="Type">
                <Select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as "MCQ" | "WRITTEN" | "CODING",
                    )
                  }
                >
                  <option value="MCQ">MCQ</option>
                  <option value="WRITTEN">Written</option>
                  <option value="CODING">Coding</option>
                </Select>
              </FormField>
            )}
          </form.Field>
          <form.Field name="difficulty">
            {(field) => (
              <FormField label="Difficulty">
                <Select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as "EASY" | "MEDIUM" | "HARD",
                    )
                  }
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </Select>
              </FormField>
            )}
          </form.Field>
          <form.Field name="points">
            {(field) => (
              <FormField
                label="Points"
                error={fieldError(field.state.meta.errors)}
              >
                <Input
                  type="number"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                  onBlur={field.handleBlur}
                />
              </FormField>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => state.values.type}>
          {(type) =>
            type === "MCQ" ? (
              <div className="space-y-3">
                <form.Field name="options">
                  {(field) => (
                    <FormField
                      label="Options"
                      error={fieldError(field.state.meta.errors)}
                    >
                      <div className="space-y-2">
                        {field.state.value.map((option, index) => (
                          <div
                            key={`${option.id}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <span className="w-6 text-sm font-medium">
                              {option.id}
                            </span>
                            <Input
                              value={option.text}
                              placeholder={`Option ${option.id}`}
                              onChange={(event) => {
                                const next = [...field.state.value];
                                next[index] = {
                                  ...option,
                                  text: event.target.value,
                                };
                                field.handleChange(next);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                field.handleChange(
                                  field.state.value.filter(
                                    (_, i) => i !== index,
                                  ),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => {
                                const next = [...field.state.value];
                                [next[index - 1], next[index]] = [
                                  next[index],
                                  next[index - 1],
                                ];
                                field.handleChange(next);
                              }}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === field.state.value.length - 1}
                              onClick={() => {
                                const next = [...field.state.value];
                                [next[index + 1], next[index]] = [
                                  next[index],
                                  next[index + 1],
                                ];
                                field.handleChange(next);
                              }}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const next = field.state.value;
                            const id = String.fromCharCode(65 + next.length);
                            field.handleChange([...next, { id, text: "" }]);
                          }}
                        >
                          <Plus className="h-4 w-4" /> Add option
                        </Button>
                      </div>
                    </FormField>
                  )}
                </form.Field>
                <form.Field name="correctAnswer">
                  {(field) => (
                    <FormField
                      label="Correct option"
                      error={fieldError(field.state.meta.errors)}
                    >
                      <Select
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      >
                        <option value="">Select an option</option>
                        {form.getFieldValue("options").map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.id}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                  )}
                </form.Field>
              </div>
            ) : null
          }
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.values.type}>
          {(type) =>
            type === "CODING" ? (
              <form.Field name="testCases">
                {(field) => (
                  <FormField
                    label="Test cases"
                    error={fieldError(field.state.meta.errors)}
                  >
                    <div className="space-y-2">
                      {field.state.value.map((testCase, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-md border p-2"
                        >
                          <Input
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(event) => {
                              const next = [...field.state.value];
                              next[index] = {
                                ...testCase,
                                input: event.target.value,
                              };
                              field.handleChange(next);
                            }}
                          />
                          <Input
                            placeholder="Expected output"
                            value={testCase.expectedOutput}
                            onChange={(event) => {
                              const next = [...field.state.value];
                              next[index] = {
                                ...testCase,
                                expectedOutput: event.target.value,
                              };
                              field.handleChange(next);
                            }}
                          />
                          <label className="flex items-center gap-1 text-xs">
                            <Checkbox
                              checked={testCase.hidden}
                              onCheckedChange={(checked) => {
                                const next = [...field.state.value];
                                next[index] = { ...testCase, hidden: checked };
                                field.handleChange(next);
                              }}
                            />{" "}
                            Hidden
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="col-span-3"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.filter((_, i) => i !== index),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          field.handleChange([
                            ...field.state.value,
                            { input: "", expectedOutput: "", hidden: false },
                          ])
                        }
                      >
                        <Plus className="h-4 w-4" /> Add test case
                      </Button>
                    </div>
                  </FormField>
                )}
              </form.Field>
            ) : null
          }
        </form.Subscribe>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || !approved}
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Create problem"}
        </Button>
      </form>
    </Dialog>
  );
}

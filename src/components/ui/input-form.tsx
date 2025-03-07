import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { cn } from "../../lib/utils";

interface InputFormProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  wrapperClassName?: string;
}

export function InputForm({ name, label, wrapperClassName, className, ...props }: InputFormProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={wrapperClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              {...props}
              value={field.value || ""}
              className={cn("transition-colors focus-visible:ring-1", className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

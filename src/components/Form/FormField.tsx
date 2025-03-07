import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  TextFieldProps,
  SelectProps,
  Box,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string | number;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: "text" | "number" | "email" | "password" | "tel" | "date" | "select";
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
  textFieldProps?: Partial<TextFieldProps>;
  selectProps?: Partial<SelectProps>;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  options,
  required = false,
  disabled = false,
  placeholder,
  helperText,
  fullWidth = true,
  textFieldProps,
  selectProps,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        type === "select" ? (
          <FormControl fullWidth={fullWidth} error={!!error} disabled={disabled} {...selectProps}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select {...field} labelId={`${name}-label`} label={label} placeholder={placeholder}>
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error?.message || helperText) && <FormHelperText>{error?.message || helperText}</FormHelperText>}
          </FormControl>
        ) : (
          <TextField
            {...field}
            {...textFieldProps}
            label={label}
            type={type}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            fullWidth={fullWidth}
            error={!!error}
            helperText={error?.message || helperText}
            InputLabelProps={{
              shrink: type === "date" ? true : undefined,
            }}
          />
        )
      }
    />
  );
}

interface FormRowProps {
  children: React.ReactNode;
  spacing?: number;
}

export function FormRow({ children, spacing = 2 }: FormRowProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${React.Children.count(children)}, 1fr)`,
        gap: spacing,
        mb: spacing,
      }}
    >
      {children}
    </Box>
  );
}

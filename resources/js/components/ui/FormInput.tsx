import React from "react";
import { Box, TextField, Typography, TextFieldProps } from "@mui/material";

// ✅ Props typing
type FormInputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    InputLabelProps?: TextFieldProps["InputLabelProps"];
};

function FormInput({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    InputLabelProps = {},
}: FormInputProps) {
    return (
        <Box sx={{ width: "70%", mb: "20px" }}>
            <TextField
                label={label}
                variant="standard"
                name={name}
                type={type}
                fullWidth
                value={value}
                onChange={onChange}
                error={Boolean(error)}
                InputLabelProps={InputLabelProps}
                sx={{
                    "& .MuiInputBase-input": { fontSize: "15px" },
                    "& .MuiInput-underline:after": {
                        borderBottomColor: error ? "#f44336" : undefined,
                    },
                }}
            />

            {error && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "#f44336",
                        mt: "4px",
                        display: "block",
                        fontSize: "12px",
                    }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
}

export default FormInput;
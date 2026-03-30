import React from "react";
import { Box, TextField, Typography } from "@mui/material";

/**
 * Reusable FormInput component
 *
 * Props:
 * - label: string — field label
 * - name: string — field name (must match useForm key)
 * - value: string — current value from useForm data
 * - onChange: fn — handleChange from parent
 * - error: string | undefined — error message from useForm errors
 * - type: string — input type (default: "text")
 * - InputLabelProps: object — extra props for the label (e.g. shrink for date)
 */
function FormInput({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    InputLabelProps = {},
}) {
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
                    // Turn the underline red when there's an error
                    "& .MuiInput-underline:after": {
                        borderBottomColor: error ? "#f44336" : undefined,
                    },
                }}
            />
            {/* Error message shown below the input in red */}
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
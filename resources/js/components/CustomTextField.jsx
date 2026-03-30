import { TextField, Tooltip } from '@mui/material'
import React from 'react'

function CustomTextField({errors,label,type,name}) {
  return (
    <Tooltip
    title={errors.password ? errors.password.message : ""}
    placement="bottom-start"
    open={Boolean(errors.password)}
    arrow
  >
    <TextField
      label={label}
      type={type}
      variant="standard"
      name={name}
      sx={{
        mb: "20px",
        width: "70%",
        "& .MuiInputBase-input": {
          fontSize: "15px",
        },
      }}
      {...register(name, {
        required: "please enter a safe password !",
        minLength: {
          value: 6,
          message:
            "Password must be at least 6 characters long !",
        },
      })}
    />
  </Tooltip>
  )
}

export default CustomTextField
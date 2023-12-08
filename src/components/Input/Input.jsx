import React from "react";
import { useFormContext } from "react-hook-form";

function Input({ label, type, id, placeholder }) {
  const { register } = useFormContext();
  return (
    <div className=" ">
      {label === "email" ? (
        <input
          type={type}
          className=" "
          placeholder={placeholder}
          {...register(label, {
            required: {
              value: true,
              message: "required",
            }, 
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
        />
      ) : (
        <input
          type={type}
          className=" "
          placeholder={placeholder}
          {...register(label, {
            required: {
              value: true,
              message: "required",
            },
            minLength: 6,
            pattern: /[a-zA-Z0-9]{3}/,
          })}
        />
      )}
    </div>
  );
}

export default Input;

import styles from "./App.module.css";
import * as React from "react";
import { ReactNode } from "react";

type FieldGroupProps = {
  legend: string;
  children: ReactNode;
};

export function FieldGroup({ legend, children }: Readonly<FieldGroupProps>) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}

export function FormTextInput({
  name,
  label,
  type = "text",
  value,
  placeholder,
  defaultValue,
}: Readonly<
  {
    label: string;
  } & React.HTMLProps<HTMLInputElement>
>) {
  return (
    <label>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}

export function SubmitButton({
  children,
}: Readonly<React.HTMLProps<HTMLButtonElement>>) {
  return (
    <div className={styles.submitButtonRow}>
      <button className={styles.button} type={"submit"}>
        {children}
      </button>
    </div>
  );
}

export function FileInput({
  name,
  onChange,
}: Readonly<React.HTMLProps<HTMLInputElement>>) {
  return (
    <div className={styles.fileUploadRow}>
      <input
        type="file"
        id={name}
        name={name}
        onChange={onChange}
        disabled={false}
        className={styles.fileInput}
      />
    </div>
  );
}

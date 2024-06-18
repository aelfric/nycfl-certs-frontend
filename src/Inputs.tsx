import styles from "./App.module.css";
import * as React from "react";

type FieldGroupProps = {
    legend: string;
    children: any;
};

export function FieldGroup({
  legend,
  children,
}: Readonly<FieldGroupProps>) {
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
}: Readonly<FormTextInputProps>) {
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

interface FormTextInputProps {
  name: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function SubmitButton({ children }: Readonly<SubmitButtonProps>) {
  return (
    <div className={styles.submitButtonRow}>
      <button className={styles.button} type={"submit"}>
        {children}
      </button>
    </div>
  );
}

interface SubmitButtonProps {
  children: React.ReactNode | React.ReactNode[];
}

export function FileInput({ name, onChange }: Readonly<FileInputProps>) {
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
      <label htmlFor={name}>Choose a file</label>
    </div>
  );
}
interface FileInputProps {
  name: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

import styles from "./App.module.css";
import * as React from "react";

export function FieldGroup({
    legend,
    children
                           } : {legend: string; children: any}) {
    return <fieldset>
        <legend>{legend}</legend>
        {children}
    </fieldset>;
}

export function FormTextInput({
  name,
  label,
  type = "text",
  value,
  placeholder,
  defaultValue,
}: FormTextInputProps) {
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

export function SubmitButton({ children }: SubmitButtonProps) {
  return (
    <div className={styles.submitButtonRow}>
      <button className={styles.button} type={"submit"}>
        {children}
      </button>
    </div>
  );
}

interface SubmitButtonProps {
  children: React.ReactNode | React.ReactNodeArray;
}

export function FileInput({ name, onChange }: FileInputProps) {
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

interface FileChangeHandler {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}
interface FileInputProps {
  name: string;
  onChange: FileChangeHandler;
}

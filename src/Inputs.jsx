import styles from "./App.module.css";
import React from "react";
import * as PropTypes from "prop-types";

export function FormTextInput({
                                  name,
                                  label,
                                  type = "text",
                                  value,
                                  placeholder,
                                  defaultValue,
                              }) {
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

export function SubmitButton({children}) {
    return (
        <div className={styles.submitButtonRow}>
            <button className={styles.button} type={"submit"}>
                {children}
            </button>
        </div>
    );
}

export function FileInput({name, onChange}) {
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

FileInput.propTypes = { onChange: PropTypes.func };
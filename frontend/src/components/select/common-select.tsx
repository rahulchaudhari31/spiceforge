import React from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

interface CommonSelectProps {
  value: any;
  options: { label: string; value: any }[];
  placeholder?: string;
  onChange: (e: { value: any }) => void;
  className?: string;
  disabled?: boolean;
  filter?: boolean;
  isMulti?: boolean;
  showClear?: boolean;
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  value,
  options,
  placeholder = "Select",
  onChange,
  className = "",
  disabled = false,
  filter = true,
  isMulti = false,
  showClear = false,
}) => {
  console.log("values", value);

  // Use MultiSelect for multi-select
  if (isMulti) {
    return (
      <MultiSelect
        value={value || []}
        options={Array.isArray(options) ? options : []}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        filter={filter}
        showClear={showClear}
        display="chip"
      />
    );
  }

  // Use Dropdown for single select
  return (
    <Dropdown
      value={value}
      options={Array.isArray(options) ? options : []}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      appendTo={"self"}
      filter={filter}
      showClear={showClear}
    />
  );
};

export default CommonSelect;
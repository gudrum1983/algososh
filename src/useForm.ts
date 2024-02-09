import React, {ChangeEvent} from "react";

type TUseForm<T> = {
  values: T;
  handleChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  setValues: (state: T) => void;
}

export default function useForm<T>(initialState: T): TUseForm<T> {
  const [values, setValues] = React.useState<T>(initialState);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const input = evt.target;
    const value = input.value;
    const name = input.name;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
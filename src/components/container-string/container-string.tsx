import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import React, {FormEvent, useRef, useState} from "react";
import useForm from "../../useForm";
import {CircleBaseElement} from "../../types/base-element";
import styles from "./container-string.module.css"
import {StepByStepDisplay} from "../step-by-step-display/step-by-step-display";
import {
  createStringInversionSnapshots
} from "../../algorithms/create-string-inversion-snapshots/create-string-inversion-snapshots";
import {Buttons} from "../../types/buttons";

type TFormData = {inputValue: string;};
export type TElementReverseString = Pick<CircleBaseElement, "letter" | "state" | "id">;
export type TSnapshotReverseString = { containerString: Array<TElementReverseString> };

export const ContainerString = (): JSX.Element => {

  const maxLength: number = 11;
  const isLimitText: boolean = true;

  const [isLoader, setIsLoader] = useState<Buttons | null>(null);
  const [snapshots, setSnapshots] = useState<Array<TSnapshotReverseString> | null>(null);

  const inputInitialState = {inputValue: ""};
  const {values, handleChange} = useForm<TFormData>(inputInitialState);
  const inputRef = useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    inputRef.current?.focus();
  }, [isLoader, snapshots]);

  function handleOnSubmitReverseString(e: FormEvent): void {
    e.preventDefault();
    setIsLoader(Buttons.reverse);
    const stringInversionSnapshots = createStringInversionSnapshots(values.inputValue);
    setSnapshots(stringInversionSnapshots);
  }

  return (
    <>
      <form onSubmit={handleOnSubmitReverseString}>
        <fieldset className={styles.fieldset} disabled={Boolean(isLoader)}>
          <Input ref={inputRef} maxLength={maxLength} isLimitText={isLimitText} onChange={handleChange}
                 name={"inputValue"} value={values.inputValue}/>
          <Button type={"submit"} text={"Развернуть"} isLoader={isLoader === Buttons.reverse}
                  disabled={!values.inputValue} name={Buttons.reverse}/>
        </fieldset>
      </form>
      {snapshots && <StepByStepDisplay<TSnapshotReverseString> steps={snapshots} setLoader={setIsLoader}/>}
    </>
  );
};
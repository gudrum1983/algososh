import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Circle} from "../ui/circle/circle";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {ElementStates} from "../../types/element-states";

export const StringComponent: React.FC = () => {

  const [letters, setLetters] = useState<Array<{ id: number, name: string }> | null>(null)
  const [value, setValue] = useState<string>("")
  const [reverseLetters, setReverseLetters] = useState<Array<{ id: number, name: string }> | null>(null)
const [isLoader, setIsLoader] = useState(false)


  function reverseArray(inputArray: Array<{ id: number, name: string }>): Array<{ id: number, name: string }> {
    return [...inputArray].reverse();
  }

  function handlerOnClick() {
    setReverseLetters(null)


    if (value) {
      setIsLoader(true)

      const test1 = value.split('')
      const test2 = test1.map(item => ({id: 55, name: item}))
      setLetters(test2)
      setValue("")

    }
  }

  React.useEffect(() => {
    let reverseTimeoutId: NodeJS.Timeout;
    let lettersTimeoutId: NodeJS.Timeout;

    if (letters) {
      reverseTimeoutId = setTimeout(() => {
        setReverseLetters(reverseArray(letters!));
      }, 3000);

      lettersTimeoutId = setTimeout(() => {
        setLetters(null);

        setIsLoader(false)
      }, 6000);
    }

    return () => {
      clearTimeout(reverseTimeoutId);
      clearTimeout(lettersTimeoutId);
    };


  }, [letters]);

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }


  const result = (array: Array<{ id: number, name: string }>): JSX.Element => {
    return (
      <div className="container-result">
        {array.map((item) => <Circle state={ElementStates.Default} letter={item.name} key={item.id}/>)}
      </div>)
  }

  const result2 = (array: Array<{ id: number, name: string }>): JSX.Element => {
    return (
      <div className="container-result">
        {array.map((item) => <Circle state={ElementStates.Changing} letter={item.name} key={item.id}/>)}
      </div>)
  }


  return (
    <SolutionLayout title="Строка">
      <div className="container-inputs-buttons container_type_string">
        <Input maxLength={11} isLimitText={true} onChange={handlerOnChange} value={value}/>
        <Button onClick={handlerOnClick} text={"Развернуть"} isLoader={isLoader} disabled={!value}/>
      </div>
      <div className="container-result-column">


        {/*<Circle state={ElementStates.Changing} letter={"lett"} head={"head"} index={8} isSmall={false}
                tail={"tail"}></Circle>
        <Circle state={ElementStates.Modified} letter={"lett"} head={"head"} index={8} isSmall={false}
                tail={"tail"}></Circle>
        <Circle letter={"lett"} head={"head"} index={8} isSmall={false}
                tail={<Circle letter={"lett"} head={"head"} index={8} isSmall={true}
                              tail={"tail"}></Circle>}></Circle>*/}


        {letters && result(letters)}
        {reverseLetters && result2(reverseLetters)}

      </div>

    </SolutionLayout>
  );
};

import { useState } from "react";

// This custom hook is for forms mainly, such as Login & Signup.
const useInput = (initValue) => {
    const [value, setValue] = useState(initValue || '');

    const onChange = (e) => {
        setValue(e.target.value);
    }

    return { value, onChange};
}

export default useInput;
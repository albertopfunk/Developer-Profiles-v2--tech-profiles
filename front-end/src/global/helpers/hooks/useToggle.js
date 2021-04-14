import { useReducer } from "react";

function useToggle(initialValue = false) {
    return useReducer((previousValue) => !previousValue, initialValue)
}

export default useToggle;
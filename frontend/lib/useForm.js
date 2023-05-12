import { useEffect, useState } from "react";

export default function useForm(initial = {}) {
	// create a state object for our inputs
	const [inputs, setInputs] = useState(initial);
	const initialValue = Object.values(initial).join("");

	useEffect(() => {
		setInputs(initial);
	}, [initialValue]);

	function handleChange(e) {
		let { value, name, type, files } = e.target;
		if(type === "number") {
			value = parseInt(value);
		}
		if(type === "file") {
			[value] = files;
		}
		setInputs({
			// copy the existing state
			...inputs,
			[name]: value,
		});
	}

	function resetForm() {
		setInputs(initial);
	}

	function clearForm() {
		const blankState = Object.fromEntries(
			Object.entries(inputs).map(([key, value]) => [key, ""])
		);
		setInputs(blankState);
	}

	// return the things we want to surface from this custom hook
	return {
		inputs,
		handleChange,
		resetForm,
		clearForm,
	}
}
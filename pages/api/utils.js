export function validateAndParseHexCodeArray(inputString) {
	// Attempt to parse the input string into an array
	const parsedArray = JSON.parse(inputString.replace(/'/g, '"'));

	// Check if the parsed result is an array with the desired length
	if (Array.isArray(parsedArray) && parsedArray.length === 4) {
		// Check if all elements in the array are strings with valid hex color code format
		const isValid = parsedArray.every(
			(color) => typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color)
		);

		if (isValid) {
			return parsedArray; // Return the validated array
		} else {
			throw new Error("Invalid hex color codes in the array");
		}
	} else {
		throw new Error("Array does not have the desired length");
	}
}

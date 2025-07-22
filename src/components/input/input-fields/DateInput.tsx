import { Timestamp } from "firebase/firestore";
import type { InputElementProps } from "../InputForm";
import { useEffect } from "react";

export interface DateInputProps extends InputElementProps {}

const convertToFirestoreTimestamp = (date: Date) => {
	return Timestamp.fromDate(date);
};

const convertToFirestoreTimestampFromString = (dateString: string) => {
	if (dateString === "") return null;
	const date = new Date(dateString);
	return convertToFirestoreTimestamp(date);
};

const convertToDateTimeString = (firestoreTimestamp: Timestamp) => {
	return firestoreTimestamp
		? firestoreTimestamp.toDate().toISOString().slice(0, 16)
		: "";
};

export const formatDateValue = (firestoreTimestamp: Timestamp) => {
	if (!firestoreTimestamp) return null;

	const date = firestoreTimestamp.toDate();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${year}/${month}/${day}, ${hours}:${minutes}`;
};

const DateInput = (props: DateInputProps) => {
	useEffect(() => {
		if (!props.value && props.initialValue)
			props.onInputChange(
				props.id,
				convertToFirestoreTimestamp(props.initialValue)
			);
	}, [props.value]);

	return (
		<div className="input" data-hasvalue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
				className="input-text"
				name={props.id}
				type="datetime-local"
				value={convertToDateTimeString(props.value)}
				onChange={(e) =>
					props.onInputChange(
						props.id,
						convertToFirestoreTimestampFromString(e.target.value)
					)
				}
			/>
		</div>
	);
};

export default DateInput;

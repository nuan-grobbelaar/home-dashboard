import { Timestamp } from "firebase/firestore";
import type { InputProps } from "./InputForm";
import { useEffect } from "react";

export interface DateInputProps extends InputProps {}

const convertToFirestoreTimestamp = (date: Date) => {
	return Timestamp.fromDate(date);
};

const convertToFirestoreTimestampFromString = (dateString: string) => {
	const date = new Date(dateString);
	convertToFirestoreTimestamp(date);
};

const convertToDateTimeString = (firestoreTimestamp: Timestamp) => {
	return firestoreTimestamp
		? firestoreTimestamp.toDate().toISOString().slice(0, 16)
		: "";
};

const DateInput = (props: DateInputProps) => {
	useEffect(() => {
		props.onInputChange(props.id, convertToFirestoreTimestamp(new Date()));
	}, []);

	return (
		<div className="input" data-hasValue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
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

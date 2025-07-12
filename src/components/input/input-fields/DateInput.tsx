import { Timestamp } from "firebase/firestore";
import type { InputElementProps } from "../../widget-components/InputForm";
import { useEffect } from "react";

export interface DateInputProps extends InputElementProps {}

const convertToFirestoreTimestamp = (date: Date) => {
	return Timestamp.fromDate(date);
};

const convertToFirestoreTimestampFromString = (dateString: string) => {
	console.log("date update", dateString);
	const date = new Date(dateString);
	return convertToFirestoreTimestamp(date);
};

const convertToDateTimeString = (firestoreTimestamp: Timestamp) => {
	return firestoreTimestamp
		? firestoreTimestamp.toDate().toISOString().slice(0, 16)
		: "";
};

const DateInput = (props: DateInputProps) => {
	useEffect(() => {
		if (!props.value)
			props.onInputChange(props.id, convertToFirestoreTimestamp(new Date()));
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

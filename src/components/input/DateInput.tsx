import { Timestamp } from "firebase/firestore";
import type { InputProps } from "./InputForm";

export interface DateInputProps extends InputProps {}

const convertToFirestoreTimestamp = (dateString: string) => {
	const date = new Date(dateString);
	return Timestamp.fromDate(date);
};

const convertToDateTimeString = (firestoreTimestamp: Timestamp) => {
	return firestoreTimestamp
		? firestoreTimestamp.toDate().toISOString().slice(0, 16)
		: "";
};

const DateInput = (props: DateInputProps) => {
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
						convertToFirestoreTimestamp(e.target.value)
					)
				}
			/>
		</div>
	);
};

export default DateInput;

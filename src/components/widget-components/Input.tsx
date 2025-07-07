import { useState } from "react";
import {
	isInsertQuery,
	type InsertQuery,
	type WidgetDatasourceQueryResponseData,
} from "../../hooks/firestore/types";
import InputForm from "./InputForm";

export interface InputProps {
	data: WidgetDatasourceQueryResponseData;
	insert: (data: { [field: string]: any }, datasourceName: string) => void;
}

const Input = (props: InputProps) => {
	const [activeInsert, setActiveInsert] = useState<
		[string, InsertQuery] | null
	>(null);

	const insertDatasources: Array<[datasourceName: string, query: InsertQuery]> =
		Object.entries(props.data).filter((entry): entry is [string, InsertQuery] =>
			isInsertQuery(entry[1])
		);

	if (insertDatasources.length < 1) throw new Error("No insert datasources"); //TODO: need better handling

	return (
		<div className="input_component">
			{!activeInsert ? (
				<div className="widget__select">
					{insertDatasources.map(([datasourceName, insertQuery], i) => (
						<div
							key={i}
							className="widget__select__option"
							onClick={() => setActiveInsert([datasourceName, insertQuery])}
						>
							{datasourceName}
						</div>
					))}
				</div>
			) : (
				<InputForm
					data={props.data}
					insert={(data: { [field: string]: any }) =>
						props.insert(data, activeInsert[0])
					}
					insertQuery={activeInsert[1]}
				/>
			)}
		</div>
	);
};

export default Input;

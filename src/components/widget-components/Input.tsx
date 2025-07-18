import { useState } from "react";
import {
	isInsertQuery,
	type InsertQuery,
	type WidgetDatasourceResponse,
} from "../../hooks/firestore/types";
import InputForm from "../input/InputForm";
import OptionSelector from "../input/OptionSelector";
import InputContainer from "../input/InputContainer";

export interface InputProps {
	data: WidgetDatasourceResponse<unknown>;
	insert: (data: { [field: string]: any }, datasourceName: string) => void;
	isMobile?: boolean;
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
			<InputContainer
				title={`Insert ${activeInsert ? activeInsert[0] : ""}`}
				onBack={!!activeInsert ? () => setActiveInsert(null) : undefined}
				expanded={!!activeInsert}
			>
				{!activeInsert ? (
					<OptionSelector
						options={insertDatasources}
						displayCallback={(option) => option[0]}
						onSelect={(option) => setActiveInsert(option)}
					/>
				) : (
					<InputForm
						data={props.data}
						insert={(data: { [field: string]: any }) =>
							props.insert(data, activeInsert[0])
						}
						insertQuery={activeInsert[1]}
					/>
				)}
			</InputContainer>
		</div>
	);
};

export default Input;

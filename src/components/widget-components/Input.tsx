import { useEffect, useMemo, useState } from "react";
import {
	isInsertQuery,
	type InsertQuery,
	type WidgetDatasourceResponse,
} from "../../hooks/firestore/types";
import OptionSelector from "../input/OptionSelector";
import InputContainer from "../input/InputContainer";
import InsertForm from "../input/InsertForm";

export interface InputProps {
	data: WidgetDatasourceResponse<unknown>;
	insert: (data: { [field: string]: any }, datasourceName: string) => void;
	isMobile?: boolean;
}

const Input = (props: InputProps) => {
	console.log("input", props.data);
	const [activeInsert, setActiveInsert] = useState<
		[string, InsertQuery] | null
	>(null);

	const insertDatasources: Array<[datasourceName: string, query: InsertQuery]> =
		useMemo(
			() =>
				Object.entries(props.data).filter(
					(entry): entry is [string, InsertQuery] => isInsertQuery(entry[1])
				),
			[]
		);

	if (insertDatasources.length < 1) throw new Error("No insert datasources"); //TODO: need better handling

	useEffect(() => {
		if (insertDatasources.length == 1) setActiveInsert(insertDatasources[0]);
	}, [insertDatasources, setActiveInsert]);

	return (
		<div className="input_component">
			<InputContainer
				title={`Insert ${activeInsert ? activeInsert[0] : ""}`}
				onBack={
					!!activeInsert && insertDatasources.length > 1
						? () => setActiveInsert(null)
						: undefined
				}
				expanded={!!activeInsert}
				centerItemsVeritcally
			>
				{!activeInsert ? (
					<OptionSelector
						options={insertDatasources}
						displayCallback={(option) => option[0]}
						onSelect={(option) => setActiveInsert(option)}
					/>
				) : (
					<InsertForm
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

import {
	collection,
	getDocs,
	DocumentReference,
	getDoc,
	getFirestore,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import type { GridItemPosition } from "./useGridItemPlacer";

export interface WidgetComponentDefinition {
	id: string;
	// This is a reference to the base component
	componentDefinitionReference: DocumentReference;
	position: GridItemPosition;
	type: string;
	props: { [key: string]: any };
}

export interface WidgetComponentLayoutDefinition {
	id: string;
	name: string;
	rows: number;
	columns: number;
	datasourceApp: string;
	datasourceQuery: {
		collection: string;
		groupBy: string;
		target: string;
	};
	widgetComponentDefinitions: WidgetComponentDefinition[];
}

export interface WidgetDefinition {
	type: string;
	widgetComponentLayoutDefinitions: WidgetComponentLayoutDefinition[];
}

export function useWidgetDefinitionStore(
	auto: boolean = true,
	setLoading?: (isLoading: boolean) => void,
	setError?: (error: String | null) => void
) {
	const db = getFirestore();

	const [widgetDefinitions, setWidgetDefinitions] = useState<
		WidgetDefinition[]
	>([]);

	useEffect(() => {
		if (auto) loadWidgetDefinitions();
	}, []);

	async function getWidgetComponentLayoutDefinitions(
		widgetDefinitionId: string
	) {
		const widgetComponentLayoutDefintionsRef = collection(
			db,
			"widgets",
			widgetDefinitionId,
			"component-layouts"
		);

		const componentLayoutDefinitionsSnapshot = await getDocs(
			widgetComponentLayoutDefintionsRef
		);

		if (!componentLayoutDefinitionsSnapshot.empty) {
			return Promise.all(
				componentLayoutDefinitionsSnapshot.docs.map(async (cld) => {
					const componentDefinitionRef = collection(
						widgetComponentLayoutDefintionsRef,
						cld.id,
						"components"
					);

					const componentDefinitionSnapshot = await getDocs(
						componentDefinitionRef
					);

					const componentDefinitions = !componentDefinitionSnapshot.empty
						? componentDefinitionSnapshot.docs.map(
								(cd) =>
									({
										id: cd.id,
										...cd.data(),
									} as WidgetComponentDefinition)
						  )
						: [];

					return {
						id: cld.id,
						widgetComponentDefinitions: componentDefinitions,
						...cld.data(),
					} as WidgetComponentLayoutDefinition;
				})
			);
		}
	}

	async function getWidgetDefinitions() {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const widgetDefinitionsRef = collection(db, "widgets");

		const widgetDefinitionSnapshot = await getDocs(widgetDefinitionsRef);

		if (!widgetDefinitionSnapshot.empty) {
			return Promise.all(
				widgetDefinitionSnapshot.docs.map(async (wd) => {
					const widgetComponentLayoutDefinitions =
						await getWidgetComponentLayoutDefinitions(wd.id);
					return {
						type: wd.id,
						widgetComponentLayoutDefinitions: widgetComponentLayoutDefinitions
							? widgetComponentLayoutDefinitions
							: [],
						...wd.data(),
					} as WidgetDefinition;
				})
			);
		}
	}

	function loadWidgetDefinitions() {
		setLoading?.(true);
		getWidgetDefinitions()
			.then((wd) => (wd ? setWidgetDefinitions(wd) : null))
			.finally(() => setLoading?.(false));
	}

	return { loadWidgetDefinitions, widgetDefinitions };
}

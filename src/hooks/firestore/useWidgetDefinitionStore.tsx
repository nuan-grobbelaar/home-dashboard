import { collection, getDocs, getFirestore } from "firebase/firestore";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import type { WidgetLoading } from "../../components/widget-grid-infrastructure/Widget";
import type {
	WidgetComponentDefinitionDocument,
	WidgetComponentLayoutDefinitionDocument,
	WidgetDefinition,
} from "./types";

export function useWidgetDefinitionStore(
	auto: boolean = true,
	setLoading?: (loading: WidgetLoading) => void
	// setError?: (error: String | null) => void
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
									} as WidgetComponentDefinitionDocument)
						  )
						: [];

					return {
						id: cld.id,
						widgetComponentDefinitions: componentDefinitions,
						...cld.data(),
					} as WidgetComponentLayoutDefinitionDocument;
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
		setLoading?.({ isLoading: true, message: "Loading widget definitions" });
		getWidgetDefinitions()
			.then((wd) => (wd ? setWidgetDefinitions(wd) : null))
			.finally(() => setLoading?.({ isLoading: false }));
	}

	return { loadWidgetDefinitions, widgetDefinitions };
}

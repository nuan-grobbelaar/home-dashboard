import { useEffect, useState, type PropsWithChildren } from "react";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import SearchIcon from "../../icons/SearchIcon";
import ChevronUpIcon from "../../icons/ChevronUpIcon";
import { formatFormValue, type InputType } from "./InputForm";
import type { SearchParameters } from "../../hooks/firestore/types";
import SearchForm from "./SearchForm";

export interface SearchField {
	id: string;
	type: InputType;
	fieldName?: string;
	fieldNames?: string[];
	operator: ">" | ">=" | "==" | "<" | "<=";
}

export interface SearchConfig {
	datasourceName: string;
	fields: SearchField[];
}

export interface InputContainerProps extends PropsWithChildren {
	title?: string;
	onBack?: () => void;
	expanded?: boolean;
	search?: SearchConfig;
	onSearch?: (
		datasourceName: string,
		query: SearchParameters,
		setError?: (err: React.ReactNode[]) => void
	) => void;
	centerItemsVeritcally?: boolean;
	setInfoItems?: React.Dispatch<
		React.SetStateAction<React.ReactNode[] | undefined>
	>;
	errorItems?: React.ReactNode[];
	setErrorItems?: React.Dispatch<
		React.SetStateAction<React.ReactNode[] | undefined>
	>;
}

const ComboBar = (props: InputContainerProps) => {
	const [searchOpen, setSearchOpen] = useState(false);

	const [formData, setFormData] = useState<{ [field: string]: any }>({});
	const [errors, setErrors] = useState<Array<React.ReactNode>>();

	const isActive = () => {
		return (props.onBack || props.search) && props.expanded && !searchOpen;
	};

	useEffect(() => {
		if (props.setInfoItems) {
			if (!searchOpen && Object.keys(formData).length > 0) {
				props.setInfoItems([
					<div className="input-container__info">
						{Object.entries(formData).map(([field, value]) => {
							const fieldConfig = props.search?.fields.find(
								(fieldConfig) => fieldConfig.id === field
							);
							if (fieldConfig) {
								return (
									<div className="input-container__info-item">
										<span className="input-container__info-item__key">
											{field}
										</span>
										<span className="input-container__info-item__value">
											{formatFormValue(value, fieldConfig.type)}
										</span>
									</div>
								);
							}
						})}
					</div>,
				]);
			} else {
				props.setInfoItems(undefined);
			}
		}
	}, [searchOpen, formData, props.setInfoItems]);

	useEffect(() => {
		if (props.setErrorItems) {
			console.log("ERRORS", errors);
			if (errors && errors.length > 0) {
				props.setErrorItems(
					errors.map((e) => <div className="input-container__error">{e}</div>)
				);
			} else {
				props.setErrorItems(undefined);
			}
		}
	}, [searchOpen, errors, props.setInfoItems]);

	return (
		<>
			<div className="input-container__bar" data-active={isActive()}>
				{props.onBack && (
					<button
						className="button icon-button input-container__back-button"
						onClick={props.onBack}
					>
						<ChevronLeftIcon />
					</button>
				)}
				{props.title && (
					<span className="input-container__title">{props.title}</span>
				)}
				{props.expanded && props.search && props.onSearch && (
					<button
						className="button icon-button input-container__search-button"
						onClick={() => setSearchOpen((prev) => !prev)}
					>
						{searchOpen ? <ChevronUpIcon /> : <SearchIcon />}
					</button>
				)}
			</div>
			{searchOpen && props.search && props.onSearch && (
				<div className="input-container__search">
					<SearchForm
						data={{}}
						searchConfig={props.search}
						onSearch={props.onSearch}
						formData={formData}
						setFormData={setFormData}
						setError={(err: React.ReactNode[]) => setErrors(err)}
					/>
				</div>
			)}
		</>
	);
};

const InputContainer = (props: InputContainerProps) => {
	return (
		<div
			className="input-container"
			data-expanded={props.expanded}
			data-active={!!props.onBack}
		>
			{(props.title || props.onBack) && <ComboBar {...props} />}
			<div className="input-container__container">
				<div
					className="input-container__container-items"
					data-centered={props.centerItemsVeritcally}
				>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default InputContainer;

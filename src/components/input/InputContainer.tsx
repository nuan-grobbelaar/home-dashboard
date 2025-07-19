import { useState, type PropsWithChildren } from "react";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import SearchIcon from "../../icons/SearchIcon";
import ChevronUpIcon from "../../icons/ChevronUpIcon";
import { inputRegistry, type InputType } from "./InputForm";

export interface SearchField {
	id: string;
	type: InputType;
	fieldName?: string;
	fieldNames?: string[];
	operator: ">" | ">=" | "==" | "<" | "<=";
}

export interface SearchConfig {
	fields: SearchField[];
}

const ComboBar = (props: InputContainerProps) => {
	const [searchOpen, setSearchOpen] = useState(false);

	const isActive = () => {
		return (props.onBack || props.search) && props.expanded && !searchOpen;
	};

	return (
		<>
			<div className="input-container__bar" data-active={isActive()}>
				{props.onBack && (
					<button
						className="icon-button input-container__back-button"
						onClick={props.onBack}
					>
						<ChevronLeftIcon />
					</button>
				)}
				{props.title && (
					<span className="input-container__title">{props.title}</span>
				)}
				{props.expanded && props.search && (
					<button
						className="icon-button input-container__search-button"
						onClick={() => setSearchOpen((prev) => !prev)}
					>
						{searchOpen ? <ChevronUpIcon /> : <SearchIcon />}
					</button>
				)}
			</div>
			{searchOpen && (
				<div className="input-container__search">
					{props.search &&
						props.search.fields.map((s) => {
							console.log("search", "type", s);
							const Input = inputRegistry[s.type];

							return <Input id={s.id} value="" onInputChange={() => {}} />;
						})}
				</div>
			)}
		</>
	);
};

export interface InputContainerProps extends PropsWithChildren {
	title?: string;
	onBack?: () => void;
	expanded?: boolean;
	search?: SearchConfig;
}

const InputContainer = (props: InputContainerProps) => {
	return (
		<div
			className="input-container"
			data-expanded={props.expanded}
			data-active={!!props.onBack}
		>
			{(props.title || props.onBack) && <ComboBar {...props} />}
			<div className="input-container__container">
				<div className="input-container__container-items">{props.children}</div>
			</div>
		</div>
	);
};

export default InputContainer;

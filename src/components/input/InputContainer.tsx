import type { PropsWithChildren } from "react";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";

export interface InputContainerProps extends PropsWithChildren {
	title?: string;
	onBack?: () => void;
	expanded?: boolean;
}

const InputContainer = (props: InputContainerProps) => {
	return (
		<div className="input-container" data-expanded={props.expanded}>
			{(props.title || props.onBack) && (
				<div className="input-container__bar">
					{props.onBack && (
						<button
							className="input-container__back-button"
							onClick={props.onBack}
						>
							<ChevronLeftIcon />
						</button>
					)}
					{props.title && (
						<span className="input-container__title">{props.title}</span>
					)}
				</div>
			)}
			<div className="input-container__container">{props.children}</div>
		</div>
	);
};

export default InputContainer;

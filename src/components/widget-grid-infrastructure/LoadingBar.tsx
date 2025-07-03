import { useEffect, useRef } from "react";

export interface LoadingBarProps {
	message?: string;
}

const LoadingBar = (props: LoadingBarProps) => {
	const progressBarRef = useRef<HTMLDivElement | null>(null);
	const timeoutRef = useRef<number>(null);

	// const smoothRandomBounce = (): void => {
	// 	if (!progressBarRef.current) return;

	// 	const randomWidth: number = Math.floor(Math.random() * 80) + 10;
	// 	progressBarRef.current.style.width = `${randomWidth}%`;

	// 	const nextUpdateIn: number = Math.random() * 900 + 300;
	// 	timeoutRef.current = window.setTimeout(smoothRandomBounce, nextUpdateIn);
	// };

	// useEffect(() => {
	// 	smoothRandomBounce();

	// 	return () => {
	// 		if (timeoutRef.current) {
	// 			clearTimeout(timeoutRef.current);
	// 		}
	// 	};
	// }, []);

	return (
		<>
			<div className="loading-bar">
				<div ref={progressBarRef} className="loading-bar__fill" />
			</div>
			{props.message && (
				<div className="loading-bar__message">{props.message}</div>
			)}
		</>
	);
};

export default LoadingBar;

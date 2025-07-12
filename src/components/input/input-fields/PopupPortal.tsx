import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PopupPortalProps {
	anchorRef: React.RefObject<HTMLInputElement | null>;
	visible: boolean;
	children: React.ReactNode;
}

const PopupPortal = ({ anchorRef, visible, children }: PopupPortalProps) => {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const popup = popupRef.current;
		const anchor = anchorRef.current;

		function updatePosition() {
			if (popup && anchor) {
				const rect = anchor.getBoundingClientRect();
				const scrollY = window.scrollY || document.documentElement.scrollTop;
				const scrollX = window.scrollX || document.documentElement.scrollLeft;

				popup.style.position = "absolute";
				popup.style.top = `${rect.bottom + scrollY}px`;
				popup.style.left = `${rect.left + scrollX}px`;
				popup.style.width = `${rect.width}px`;
			}
		}

		updatePosition();

		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [anchorRef, visible]);

	if (!visible) return null;

	return createPortal(
		<div ref={popupRef} className="popup">
			{children}
		</div>,
		document.body
	);
};

export default PopupPortal;

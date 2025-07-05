import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PopupPortalProps {
	anchorRef: React.RefObject<HTMLElement>;
	visible: boolean;
	children: React.ReactNode;
}

const PopupPortal: React.FC<PopupPortalProps> = ({
	anchorRef,
	visible,
	children,
}) => {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function updatePosition() {
			const anchor = anchorRef.current;
			const popup = popupRef.current;

			if (anchor && popup) {
				const rect = anchor.getBoundingClientRect();
				popup.style.position = "fixed";
				popup.style.top = `${rect.bottom}px`;
				popup.style.left = `${rect.left}px`;
				popup.style.width = `${rect.width}px`;
				popup.style.zIndex = "1000";
			}
		}

		if (visible) {
			updatePosition();
			window.addEventListener("resize", updatePosition);
			window.addEventListener("scroll", updatePosition, true);
		}

		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
		};
	}, [visible, anchorRef]);

	if (!visible) return null;

	return createPortal(
		<div ref={popupRef} className="popup">
			{children}
		</div>,
		document.body
	);
};

export default PopupPortal;

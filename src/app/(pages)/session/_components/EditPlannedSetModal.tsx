"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const EditPlannedSetModal = ({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) => {
	const router = useRouter();
	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!modalRef.current?.open) {
			modalRef.current?.showModal();
		}
	}, []);

	function onDismiss() {
		router.back();
	}

	return (
		<dialog
			ref={modalRef}
			className="modal modal-bottom sm:modal-middle"
			onClose={onDismiss}
		>
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-4">{title}</h3>
				{children}
				<div className="modal-action">
					{/* The form inside children will have its own buttons, but we might want a close button here too if not in form */}
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="submit">close</button>
			</form>
		</dialog>
	);
};

export const Toast = ({
	message,
	type,
}: {
	message: string;
	type: "info" | "success" | "error";
}) => {
	return <div className="toast toast-top toast-center z-50 mt-[25%]">
		<div className={`alert alert-${type}`}>
			<span className="text-xl font-bold">{message}</span>
		</div>
	</div>;
};
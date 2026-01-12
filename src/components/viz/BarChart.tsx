import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Svg, Rect, Line, Text } from "react-svg-path";

type HitBox = {
	x: number;
	y: number;
	w: number;
	h: number;
	value: number;
	date: string | number;
};

const CHART_WIDTH = 365;
const CHART_HEIGHT = 250;
const BAR_GAP = 2;
const MAX_BAR_WIDTH = 45;
const TOP_PADDING = 65;
const BOTTOM_PADDING = 15;

export const BarChart = ({
	data,
}: {
	data: { date: string | number; max_weight: number; }[];
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const hitBoxes: HitBox[] = useMemo(() => {
		const values = data.map((d) => d.max_weight);
		const max = Math.max(...values, 1);
		const barW = Math.min(MAX_BAR_WIDTH, CHART_WIDTH / data.length) - BAR_GAP;
		return data.map((d, i) => {
			const h = (d.max_weight / max) * (CHART_HEIGHT - TOP_PADDING);
			return {
				x: i * (barW + BAR_GAP),
				y: CHART_HEIGHT - h,
				w: barW,
				h: h - BOTTOM_PADDING,
				value: d.max_weight,
				date: d.date,
			};
		});
	}, [data]);

	useLayoutEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
		ctx.fillStyle = "#ccc8";
		hitBoxes.forEach((hb) => {
			ctx.fillRect(hb.x, hb.y, hb.w, hb.h);
		});
		// highest value hitbox
		const maxHitbox = [...hitBoxes].sort((a, b) => a.value - b.value).pop();

		// write maxHitbox.value to the canvas above the bar.
		if (maxHitbox) {
			ctx.fillStyle = "#6366f1";
			ctx.font = "bold 0.75rem monospace";
			ctx.textAlign = "center";
			const textWidth = ctx.measureText(maxHitbox.value.toString()).width;
			// x = x of bar, but the text cannot go past the canvas width
			ctx.fillText(
				maxHitbox.value.toString(),
				Math.max(0, Math.min(CHART_WIDTH - (textWidth / 2), maxHitbox.x + maxHitbox.w / 2)),
				maxHitbox.y - 10,
			);
			ctx.moveTo(0, maxHitbox.y);
			ctx.lineTo(CHART_WIDTH, maxHitbox.y);
			// blue
			ctx.strokeStyle = "#6366f1";
			// dashed
			ctx.setLineDash([5, 5]);
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}, [hitBoxes]);

	const handlePointer = (e: React.PointerEvent) => {
		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;
		const x = e.clientX - rect.left;
		const index = hitBoxes.findIndex((b) => x >= b.x && x <= b.x + b.w);
		setActiveIndex(index !== -1 ? index : null);
	};

	const activeHitBox = activeIndex !== null ? hitBoxes[activeIndex] : null;
	return (
		<div
			className="relative touch-none"
			style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
		>
			<canvas
				ref={canvasRef}
				width={CHART_WIDTH}
				height={CHART_HEIGHT}
				className="absolute inset-0"
				onPointerMove={handlePointer}
				onPointerLeave={() => setActiveIndex(null)}
			/>
			<Svg
				className="absolute inset-0 pointer-events-none"
				width={CHART_WIDTH}
				height={CHART_HEIGHT}
			>
				<Text
					textAnchor="middle"
					sy={CHART_HEIGHT}
					className="text-xs"
				>
					{new Date(data[0].date).toLocaleDateString("en-US", {
						month: "numeric",
						day: "2-digit",
						year: "2-digit",
					})}{" "}
					-{" "}
					{new Date(data[data.length - 1].date).toLocaleDateString("en-US", {
						month: "numeric",
						day: "2-digit",
						year: "2-digit",
					})}
				</Text>
				{activeHitBox && (
					<g>
						<Rect
							width={activeHitBox.w}
							height={activeHitBox.h}
							cx={activeHitBox.x + activeHitBox.w / 2}
							cy={activeHitBox.y + activeHitBox.h / 2}
							fill="#afd89e"
						/>
						<Line
							sx={activeHitBox.x + activeHitBox.w / 2}
							sy={10}
							ex={activeHitBox.x + activeHitBox.w / 2}
							ey={activeHitBox.y}
							stroke="#999"
							strokeWidth={2}
						/>
					</g>
				)}
			</Svg>
			{activeHitBox && (
				<div
					className="absolute flex flex-col items-center justify-center text-success-content bg-base-200 pointer-events-none border-b border-b-1 shadow-lg"
					style={{
						width: 100,
						height: 50,
						top: 10,
						left: Math.max(
							0,
							Math.min(
								CHART_WIDTH - 100,
								activeHitBox.x - 50 + activeHitBox.w / 2,
							),
						),
					}}
				>
					<div className="text-sm">
						{new Date(activeHitBox.date).toLocaleDateString()}
					</div>
					<div className="text-xl font-bold">{activeHitBox.value}</div>
				</div>
			)}
		</div>
	);
};

export default BarChart;

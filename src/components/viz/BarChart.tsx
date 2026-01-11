import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Svg, Rect, Line } from "react-svg-path";

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
const BOTTOM_PADDING = 65;

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
			const h = (d.max_weight / max) * (CHART_HEIGHT - BOTTOM_PADDING);
			return {
				x: i * (barW + BAR_GAP),
				y: CHART_HEIGHT - h,
				w: barW,
				h,
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
			onPointerMove={handlePointer}
			onPointerLeave={() => setActiveIndex(null)}
		>
			<canvas
				ref={canvasRef}
				width={CHART_WIDTH}
				height={CHART_HEIGHT}
				className="absolute inset-0"
			/>
			<Svg
				className="absolute inset-0 pointer-events-none"
				width={CHART_WIDTH}
				height={CHART_HEIGHT}
			>
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

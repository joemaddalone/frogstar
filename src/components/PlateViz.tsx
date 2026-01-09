import type { Plate } from "@/lib/types";
import { justThePlates } from "@/lib/plateCalculator";
import { Svg, Text, RoundedRect, RoundedSquare } from 'react-svg-path';

interface PlateVizProps {
	plates: Plate[];
	bar: number;
	target: number;
}



const colors = [
	"#6366f1",
	"#4ade80",
	"#f97316",
	"#ef4444",
	"#94a3b8",
	"#ef4444",
];

const calcHeights = (plates: Plate[]) => {
	const sortedPlates = plates.sort((a, b) => b.weight - a.weight);
	const heights = sortedPlates.map((plate, index) => {
		return {
			weight: plate.weight,
			height: 100 - (index * 8),
		};
	});
	return heights;
};





export const PlateViz = ({ plates, bar, target }: PlateVizProps) => {
	const heights = calcHeights(plates);
	const platesNeeded = justThePlates(bar, target, plates);
	let dx = 0;
	const platesToRender = platesNeeded.reduce((acc, plate, index) => {

		for (let i = 0; i < plate.count; i++) {
			acc.push({
				weight: plate.weight,
				height: heights.find((height) => height.weight === plate.weight)?.height || 0,
				dx: dx,
				color: colors[index],
			});
			dx += 35;
		}
		return acc;
	}, [] as { weight: number; dx: number; height: number; color: string; }[]);

	const barWidth = 75 + platesToRender.length * 35;
	const svgH = 100;
	const svgW = barWidth;
	return (
		<div className="flex justify-center p-4 border border-base-content/10 rounded-sm">
			<Svg width={svgW} height={svgH}>
				<RoundedRect ox={-25} radius={5} height={25} width={barWidth} fill="#ccc8" />
				<Text sx={8} dy={4} fontSize={11} style={{ fontFamily: "Arial", fontWeight: "bold" }}>
					{bar}
				</Text>

				{platesToRender.map((plate) => (
					<RoundedRect radius={5} key={plate.weight} cx={50 + plate.dx} width={30} height={plate.height} fill={plate.color}>
						<RoundedSquare radius={5} size={25} fill="white">
							<Text fill="#222" fontSize={11} style={{ fontFamily: "Arial", fontWeight: "bold" }} textAnchor="middle" dy={4}>{plate.weight}</Text>
						</RoundedSquare>
					</RoundedRect>

				))}
			</Svg >
		</div>
	);
};
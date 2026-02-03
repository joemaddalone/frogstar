import type { Plate } from "@/lib/types";
import { justThePlates } from "@/lib/plateCalculator";
import { Svg, Text, RoundedRect, RoundedSquare } from 'react-svg-path';

interface PlateVizProps {
	plates: Plate[];
	bar: number;
	target: number;
	size?: 'sm' | 'md';
	className?: string;
}



const colors = [
	"#6366f1",
	"#4ade80",
	"#f97316",
	"#ef4444",
	"#94a3b8",
	"#ef4444",
	"#6366f1",

];

const calcHeights = (plates: Plate[], maxPlateHeight: number) => {
	const sortedPlates = plates.sort((a, b) => b.weight - a.weight);
	const heights = sortedPlates.map((plate, index) => {
		return {
			weight: plate.weight,
			height: maxPlateHeight - (index * 8),
		};
	});
	return heights;
};


const PLATE_VIZ_CONSTS_MD = {
	PLATE_WIDTH: 30,
	PLATE_HEIGHT: 100,
	PLATE_GAP: 5,
	MIN_BAR_WIDTH: 75,
	BAR_HEIGHT: 25,
	BAR_DISPLAY_OFFSET: 50,
	SVG_HEIGHT: 100,
	SVG_WIDTH: 100,
	FONT_SIZE: 11,
	RADIUS: 5,
	LABEL_MARGIN: 5,
};

const PLATE_VIZ_CONSTS_SM = (Object.keys(PLATE_VIZ_CONSTS_MD) as (keyof typeof PLATE_VIZ_CONSTS_MD)[]).reduce((acc, key) => {
	acc[key] = Math.floor(PLATE_VIZ_CONSTS_MD[key] * 0.75);
	return acc;
}, {} as typeof PLATE_VIZ_CONSTS_MD);

PLATE_VIZ_CONSTS_SM.FONT_SIZE = 10;

export const PlateViz = ({ plates, bar, target, size = 'md', className = '' }: PlateVizProps) => {

	const PLATE_VIZ_CONSTS = size === 'sm' ? PLATE_VIZ_CONSTS_SM : PLATE_VIZ_CONSTS_MD;


	const heights = calcHeights(plates, PLATE_VIZ_CONSTS.PLATE_HEIGHT);
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
			dx += PLATE_VIZ_CONSTS.PLATE_GAP + PLATE_VIZ_CONSTS.PLATE_WIDTH;
		}
		return acc;
	}, [] as { weight: number; dx: number; height: number; color: string; }[]);

	const barWidth = PLATE_VIZ_CONSTS.MIN_BAR_WIDTH + platesToRender.length * (PLATE_VIZ_CONSTS.PLATE_GAP + PLATE_VIZ_CONSTS.PLATE_WIDTH);
	const svgH = PLATE_VIZ_CONSTS.SVG_HEIGHT;
	const svgW = barWidth;
	return (
		<div className={`flex justify-center ${className}`}>
			<Svg width={svgW} height={svgH}>
				<RoundedRect ox={-PLATE_VIZ_CONSTS.BAR_HEIGHT} radius={PLATE_VIZ_CONSTS.RADIUS} height={PLATE_VIZ_CONSTS.BAR_HEIGHT} width={barWidth} fill="#ccc8" />
				<Text sx={8} dy={4} fontSize={PLATE_VIZ_CONSTS.FONT_SIZE} style={{ fontFamily: "Arial", fontWeight: "bold" }}>
					{bar}
				</Text>

				{platesToRender.map((plate) => (
					<RoundedRect radius={PLATE_VIZ_CONSTS.RADIUS} key={plate.weight} cx={PLATE_VIZ_CONSTS.BAR_DISPLAY_OFFSET + plate.dx} width={PLATE_VIZ_CONSTS.PLATE_WIDTH} height={plate.height} fill={plate.color}>
						<RoundedSquare radius={PLATE_VIZ_CONSTS.RADIUS} size={PLATE_VIZ_CONSTS.PLATE_WIDTH - PLATE_VIZ_CONSTS.LABEL_MARGIN} fill="white">
							<Text fill="#222" fontSize={PLATE_VIZ_CONSTS.FONT_SIZE} style={{ fontFamily: "Arial", fontWeight: "bold" }} textAnchor="middle" dy={4}>{plate.weight}</Text>
						</RoundedSquare>
					</RoundedRect>

				))}
			</Svg >
		</div>
	);
};
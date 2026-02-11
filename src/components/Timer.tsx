import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { RotateCw, Trash } from "lucide-react";

const MAX_TIME = 60 * 7;

const formatMinutesAndSeconds = (totalSeconds: number) => {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const Timer = ({ destroy }: { destroy: () => void; }) => {
	const [controlsVisible, setControlsVisible] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [time, setTime] = useState(0);

	const playSound = () => {
		try {
			const context = new window.AudioContext();
			const osc = context.createOscillator();
			const gain = context.createGain();

			osc.type = "sine";
			osc.frequency.setValueAtTime(120, context.currentTime); // Lower pitch (A3)

			gain.gain.setValueAtTime(0, context.currentTime);
			gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05); // Quick attack
			gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5); // Decay over 1.5s

			osc.connect(gain);
			gain.connect(context.destination);
			osc.start();
			osc.stop(context.currentTime + 1.5);
		} catch (_e) {
			// nothing
		}
	};

	const playAlert = (seconds: number) => {
		const minutes = seconds / 60;
		const hasVibrate = "vibrate" in navigator;
		let i = 0;
		playSound();
		if (hasVibrate) {
			navigator.vibrate(200);
		}
		if (minutes - 1 === 0) return;
		const alertInterval = setInterval(() => {
			if (i < minutes - 1) {
				playSound();
				i++;
				if (hasVibrate) {
					navigator.vibrate(200);
				}
			} else {
				clearInterval(alertInterval);
			}
		}, 800);
	};

	const handleStop = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};


	const handleKill = () => {
		setControlsVisible(false);
		setTime(0);
		destroy();
	};

	const handleReset = () => {
		setControlsVisible(false);
		setTime(0);
		handleStart();
	};

	const handleStart = () => {
		if (intervalRef.current !== null) return;
		setControlsVisible(false);
		intervalRef.current = setInterval(() => {
			setTime((t) => {
				const newTime = t + 1;
				// we kill the timer at MAX_TIME
				if (newTime >= MAX_TIME && intervalRef.current) {
					handleStop();
					return 0;
				}
				if (newTime % 60 === 0) {
					playAlert(newTime);
				}
				return newTime;
			});
		}, 1000);
	};

	useEffect(() => {
		return () => {
			if (intervalRef?.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: i dont care.
	useEffect(() => {
		handleStart();
	}, []);

	return (
		<div className="flex items-center join">
			<Button style={{ width: "65px" }} size="sm" variant={time === MAX_TIME ? "danger" : "outline"} className="join-item" onClick={() => setControlsVisible(!controlsVisible)}>
				{formatMinutesAndSeconds(time)}
			</Button>
			{controlsVisible ? (
				<>
					<Button size="sm" variant="outline" className="join-item" onClick={handleReset}>
						<RotateCw className="h-2 w-2" />
					</Button>
					<Button size="sm" variant="outline" className="join-item" onClick={handleKill}>
						<Trash className="h-2 w-2" />
					</Button>
				</>
			) : null}
		</div>
	);
};
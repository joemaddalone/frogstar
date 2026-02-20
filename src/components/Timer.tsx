import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { RotateCw, Trash } from "lucide-react";
import { useTimerContext } from "@/components/context/TimerContext";

const MAX_TIME = 60 * 7;

const formatMinutesAndSeconds = (ms: number) => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

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

export const Timer = () => {
	const { startedAt, timerState, stop, reset } = useTimerContext();
	const [controlsVisible, setControlsVisible] = useState(false);
	const [time, setTime] = useState(0);

	const playAlert = useCallback((seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const hasVibrate = "vibrate" in navigator;
		let i = 0;
		playSound();
		if (hasVibrate) {
			navigator.vibrate(200);
		}
		if (minutes <= 1) return;
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
	}, []);

	const handleKill = () => {
		setControlsVisible(false);
		stop();
	};

	const handleReset = () => {
		setControlsVisible(false);
		reset();
	};

	useEffect(() => {
		if (!startedAt || timerState === "stopped") {
			setTime(0);
			return;
		}

		let lastMinuteAlerted = 0;

		const update = () => {
			const newTime = Date.now() - startedAt;
			setTime(newTime);

			const currentSeconds = Math.floor(newTime / 1000);
			const currentMinute = Math.floor(currentSeconds / 60);

			if (currentMinute > lastMinuteAlerted && currentSeconds % 60 === 0) {
				playAlert(currentSeconds);
				lastMinuteAlerted = currentMinute;
			}
		};

		update();
		const interval = setInterval(update, 200);

		return () => clearInterval(interval);
	}, [startedAt, timerState, playAlert]);

	if (!startedAt || timerState === "stopped") return null;

	const isMaxTimeReached = time / 1000 >= MAX_TIME;

	return (
		<div className="flex items-center join">
			<Button
				style={{ width: "65px" }}
				size="sm"
				variant={isMaxTimeReached ? "danger" : "outline"}
				className="join-item"
				onClick={() => setControlsVisible(!controlsVisible)}
			>
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
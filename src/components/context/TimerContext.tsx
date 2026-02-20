"use client";

import { createContext, use, useState, useCallback, useMemo } from "react";

type TimerState = "stopped" | "running";


interface TimerContextType {
	timerState: TimerState | null;
	startedAt: number | null;
	start: (timestamp: number) => void;
	stop: () => void;
	reset: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode; }) => {
	const [timerState, setTimerState] = useState<TimerState>("stopped");
	const [startedAt, setStartedAt] = useState<number | null>(null);

	const start = useCallback((timestamp: number) => {
		setTimerState("running");
		setStartedAt(timestamp);
	}, []);

	const stop = useCallback(() => {
		setTimerState("stopped");
		setStartedAt(null);
	}, []);

	const reset = useCallback(() => {
		console.log('reset');
		stop();
		start(Date.now());
	}, [start, stop]);



	const providerValue = useMemo(() => ({
		timerState,
		startedAt,
		start,
		stop,
		reset,
	}), [timerState, startedAt, start, stop, reset]);


	return (
		<TimerContext value={providerValue}>
			{children}
		</TimerContext>
	);
};

export const useTimerContext = () => {
	const context = use<TimerContextType | undefined>(TimerContext);
	if (!context) {
		throw new Error("useTimerContext must be used within a TimerProvider");
	}
	return context;
};



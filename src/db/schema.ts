import { relations } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
	integer,
	real,
	sqliteTable,
	text,
} from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	notes: text('notes'),
	finished: integer('finished', { mode: 'boolean' }).notNull().default(false),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
	plannedSets: many(plannedSets),
}));

export const exercises = sqliteTable('exercises', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	category: text('category').notNull(),
	equipmentType: text('equipment_type').notNull().default('barbell'),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	barbellId: integer('barbell_id').references(() => barbells.id),
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
	barbell: one(barbells, {
		fields: [exercises.barbellId],
		references: [barbells.id],
	}),
	plannedSets: many(plannedSets),
}));

export const plannedSets = sqliteTable('planned_sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	exerciseId: integer('exercise_id')
		.notNull()
		.references(() => exercises.id),
	sessionId: integer('session_id')
		.notNull()
		.references(() => sessions.id, { onDelete: 'cascade' }),
	intendedReps: integer('intended_reps').notNull(),
	intendedSets: integer('intended_sets').notNull(),
	targetWeight: real('target_weight'),
	notes: text('notes'),
});

export const plannedSetsRelations = relations(plannedSets, ({ one, many }) => ({
	exercise: one(exercises, {
		fields: [plannedSets.exerciseId],
		references: [exercises.id],
	}),
	session: one(sessions, {
		fields: [plannedSets.sessionId],
		references: [sessions.id],
	}),
	actualSets: many(actualSets),
}));

export const actualSets = sqliteTable('actual_sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	plannedSetId: integer('planned_set_id')
		.notNull()
		.references(() => plannedSets.id, { onDelete: 'cascade' }),
	actualReps: integer('actual_reps').notNull(),
	actualWeight: real('actual_weight'),
	notes: text('notes'),
});

export const actualSetsRelations = relations(actualSets, ({ one }) => ({
	plannedSet: one(plannedSets, {
		fields: [actualSets.plannedSetId],
		references: [plannedSets.id],
	}),
}));

export const barbells = sqliteTable('barbells', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	weight: real('weight').notNull(),
});

export const barbellsRelations = relations(barbells, ({ many }) => ({
	exercises: many(exercises),
}));

export const plates = sqliteTable('plates', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	weight: real('weight').notNull(),
	pairs: integer('pairs').notNull(),
});

export type Barbell = InferSelectModel<typeof barbells>;
export type Plate = InferSelectModel<typeof plates>;
export type Exercise = InferSelectModel<typeof exercises>;
export type PlannedSet = InferSelectModel<typeof plannedSets>;
export type ActualSet = InferSelectModel<typeof actualSets>;
export type Session = InferSelectModel<typeof sessions>;
export type InsertableSession = InferInsertModel<typeof sessions>;
export type InsertableExercise = InferInsertModel<typeof exercises>;
export type InsertablePlannedSet = InferInsertModel<typeof plannedSets>;
export type InsertableActualSet = InferInsertModel<typeof actualSets>;
export type InsertableBarbell = InferInsertModel<typeof barbells>;
export type InsertablePlate = InferInsertModel<typeof plates>;

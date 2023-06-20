export enum WeightUnit {
	pounds,
	kilograms,
}

export class Weight {
	public unit: WeightUnit
	public value: number

	constructor({ value, unit }: { value: number, unit: WeightUnit }) {
		this.value = value
		this.unit = unit
	}
}

export interface Estimation {
	(weight: Weight, numberOfReps: number): Weight
}

export function Brzycki(weight: Weight, numberOfReps: number): Weight {
	const value = weight.value * (36 / (37 - numberOfReps))
	return new Weight({ value, unit: weight.unit })
}

export function Epley(weight: Weight, numberOfReps: number): Weight {
	const value = weight.value * (1 + (0.033333 * numberOfReps))
	return new Weight({ value, unit: weight.unit })
}

export function Lombardi(weight: Weight, numberOfReps: number): Weight {
	const value = weight.value * (numberOfReps ^ 0.1)
	return new Weight({ value, unit: weight.unit })
}

export function OConner(weight: Weight, numberOfReps: number): Weight {
	const value = weight.value * (1 + (0.025 * numberOfReps))
	return new Weight({ value, unit: weight.unit })
}

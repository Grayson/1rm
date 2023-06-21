import {
	Weight,
	WeightUnit,
	Estimation,

	Brzycki,
	Epley,
	Lombardi,
	OConner,
} from './1rm'

interface Estimator {
	name: string
	estimation: Estimation
}

const estimators: Estimator[] = [
	{ name: "Brzycki", estimation: Brzycki },
	{ name: "Epley", estimation: Epley },
	{ name: "Lombardi", estimation: Lombardi },
	{ name: "O'Conner", estimation: OConner },
];

type Estimations = { name: string, weight: Weight }[]

function updateUI(estimations: Estimations, doc: Document, parent: HTMLElement) {
	while (parent.firstChild != null) {
		parent.removeChild(parent.firstChild!)
	}

	const ul = doc.createElement("ul")
	parent.appendChild(ul)

	estimations.forEach(e => {
		const li = doc.createElement("li")
		ul.appendChild(li)

		const span = doc.createElement("span")
		span.className = "formula-name"
		span.textContent = e.name
		li.appendChild(span)

		const text = doc.createTextNode(" " + e.weight.toString())
		li.appendChild(text)
	})
}

function convertInputsToEstimations(weightElem: HTMLInputElement, numberOfRepsElem: HTMLInputElement, unitElem: HTMLInputElement, estimators: Estimator[]): Estimations {
	const unit = function() {
		switch (unitElem.value) {
			case "lbs": return WeightUnit.pounds
			case "kg": return WeightUnit.kilograms
		}
	}()!

	const weight = new Weight({ value: parseInt(weightElem.value ?? "0"), unit })
	const numberOfReps = parseInt(numberOfRepsElem.value ?? "0")
	return generateEstimations(weight, numberOfReps, estimators)
}

function generateEstimations(weight: Weight, numberOfReps: number, estimators: Estimator[]): Estimations {
	return estimators.map( (e) => {
		return {
			name: e.name,
			weight: new Weight({ value: e.estimation(weight, numberOfReps ).value, unit: weight.unit})
		}
	})
}

export function init(doc: Document) {
	const [ weightElem, numberOfRepsElem, estimationsElem ] = [
		doc.getElementById("weightValue")!,
		doc.getElementById("numberOfReps")!,
		doc.getElementById("estimations")!,
	].map(e => e as HTMLInputElement)

	const unitElems = Array.from(doc.getElementsByName("unit"))
		.map(e => e as HTMLInputElement)

	function attach(...elem: HTMLInputElement[]) {
		elem.forEach(e => {
			const event = e.type === 'radio' ? 'click' : 'keyup'
			e.addEventListener(event, () => {
				const unitElem = unitElems.find(e => e.checked)!
				const estimations = convertInputsToEstimations(weightElem, numberOfRepsElem, unitElem, estimators)
				updateUI(estimations, doc, estimationsElem)
			})
		})
	}

	attach(weightElem, numberOfRepsElem, ...unitElems)
}

import * as rm from './1rm'

interface Estimator {
	name: string
	estimation: rm.Estimation
}

const estimators: Estimator[] = [
	{ name: "Brzycki", estimation: rm.Brzycki }
];

type Estimations = { name: string, weight: rm.Weight }[]

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

		const text = doc.createTextNode(" " + e.weight.value.toLocaleString())
		li.appendChild(text)
	})
}

function convertInputsToEstimations(weightElem: HTMLInputElement, numberOfRepsElem: HTMLInputElement, estimators: Estimator[]): Estimations {
	const weight = new Weight({ value: parseInt(weightElem.value ?? "0"), unit: WeightUnit.pounds })
	const numberOfReps = parseInt(numberOfRepsElem.value ?? "0")
	return generateEstimations(weight, numberOfReps, estimators)
}

function generateEstimations(weight: rm.Weight, numberOfReps: number, estimators: Estimator[]): Estimations {
	return estimators.map( (e) => {
		return {
			name: e.name,
			weight: new rm.Weight({ value: e.estimation(weight, numberOfReps ).value, unit: weight.unit})
		}
	})
}

export function init(doc: Document) {
	const [ weightElem, numberOfRepsElem, estimationsElem ] = [
		doc.getElementById("weightValue")!,
		doc.getElementById("numberOfReps")!,
		doc.getElementById("estimations")!,
	]

	function attach(...elem: HTMLElement[]) {
		elem.forEach(e => {
			e.addEventListener('keyup', (ev) => {
				const estimations = convertInputsToEstimations(weightElem as HTMLInputElement, numberOfRepsElem as HTMLInputElement, estimators)
				updateUI(estimations, doc, estimationsElem)
			})
		})
	}

	attach(weightElem, numberOfRepsElem)
}

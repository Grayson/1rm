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

		const text = doc.createTextNode(e.weight.unit.toLocaleString())
		li.appendChild(text)
	})
}

function convertInputsToEstimations(weightElem: HTMLElement, numberOfRepsElem: HTMLElement, estimators: Estimator[]): Estimations {
	const weight = new rm.Weight({ value: parseInt(weightElem.textContent ?? "0"), unit: rm.WeightUnit.pounds })
	const numberOfReps = parseInt(numberOfRepsElem.textContent ?? "0")
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

(function(doc: Document) {
	const [ weightElem, numberOfRepsElem, estimationsElem ] = [
		doc.getElementById("weightValue")!,
		doc.getElementById("numberOfReps")!,
		doc.getElementById("estimations")!,
	]

	function attach(...elem: HTMLElement[]) {
		elem.forEach(e => {
			e.addEventListener('change', (ev) => {
				const estimations = convertInputsToEstimations(weightElem, numberOfRepsElem, estimators)
				updateUI(estimations, doc, estimationsElem)
			})
		})
	}

	attach(weightElem, numberOfRepsElem)
})(document)
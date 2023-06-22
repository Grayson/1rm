import {
	Weight,
	WeightUnit,
	Estimation,

	Brzycki,
	Epley,
	Lombardi,
	OConner,
	Adams,
	Baechle,
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
	{ name: "Adams", estimation: Adams },
	{ name: "Baechle", estimation: Baechle},
];

type Estimations = { name: string, weight: Weight }[]

function updateUI(estimations: Estimations, doc: Document, parent: HTMLTableElement) {
	while (parent.firstChild != null) {
		parent.removeChild(parent.firstChild!)
	}

	estimations.forEach(e => {
		const row = doc.createElement("tr")
		parent.appendChild(row)

		const formulaNameCell = doc.createElement("td")
		formulaNameCell.className = "formula-name"
		formulaNameCell.textContent = e.name
		row.appendChild(formulaNameCell)

		const estimationCell = doc.createElement("td")
		estimationCell.textContent = e.weight.toString()
		row.appendChild(estimationCell)
	})
}

function convertInputsToEstimations(weightElem: HTMLInputElement, numberOfRepsElem: HTMLInputElement, unitElem: HTMLInputElement, estimators: Estimator[]): Estimations {
	const unit = unitElem.checked ? WeightUnit.kilograms : WeightUnit.pounds
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
	const [ weightElem, numberOfRepsElem ] = [
		doc.getElementById("weightValue")!,
		doc.getElementById("numberOfReps")!,
	].map(e => e as HTMLInputElement)

	const estimationsElem = doc.getElementById("estimations")! as HTMLTableElement
	const unitElem = doc.getElementById("unitCheckbox") as HTMLInputElement

	function attach(...elem: HTMLInputElement[]) {
		elem.forEach(e => {
			const event = e.type === 'checkbox' ? 'click' : 'keyup'
			e.addEventListener(event, () => {
				const estimations = convertInputsToEstimations(weightElem, numberOfRepsElem, unitElem, estimators)
				updateUI(estimations, doc, estimationsElem)
			})
		})
	}

	attach(weightElem, numberOfRepsElem, unitElem)
}

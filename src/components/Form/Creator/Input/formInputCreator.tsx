import "./formInputCreator.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputComponentProps } from "../../../../types/form";
import {
	Container,
	Row,
	Col,
	Form,
	InputGroup,
	Button,
	Modal,
	FormControl
} from "react-bootstrap";
import FormPreviewer from "../../Previewer/formPreviewer";
import { BBCodeFormType } from "../../../../context";
import InputType from "../../../InputComponents/inputType";

const inputComponentChoiceList: InputComponentProps[] = [
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "shortText",
		typeName: "Short Text",
		inputs: [{ type: "shortText", val: "" }],
		onUpdateInputs: undefined
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "longText",
		typeName: "Long Text",
		inputs: [{ type: "longText", val: "" }],
		onUpdateInputs: undefined
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "dateTime",
		typeName: "Date & Time",
		inputs: [{ type: "dateTime", val: "" }],
		onUpdateInputs: undefined
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "date",
		typeName: "Date",
		inputs: [{ type: "date", val: "" }],
		onUpdateInputs: undefined,
		selectOptions: [""]
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "time",
		typeName: "Time",
		inputs: [{ type: "time", val: "" }],
		onUpdateInputs: undefined,
		selectOptions: [""]
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: " ",
		type: "dropdown",
		typeName: "Dropdown",
		inputs: [{ type: "dropdown", val: "" }],
		onUpdateInputs: undefined,
		selectOptions: [" ", ""]
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: "",
		type: "checkbox",
		typeName: "Checkbox",
		inputs: [{ type: "checkbox", val: "false" }],
		onUpdateInputs: undefined,
		selectOptions: [""]
	},
	{
		uniqueId: "",
		label: "",
		description: "",
		multi: false,
		defaultVal: JSON.stringify({ text: "", link: "" }),
		type: "url",
		typeName: "Url",
		inputs: [{ type: "url", val: JSON.stringify({ text: "", link: "" }) }],
		onUpdateInputs: undefined,
		selectOptions: [""]
	}
];

type FormInputCreatorProps = {
	newBBCodeForm: BBCodeFormType;
	addInput: (inputType: InputComponentProps) => void;
	updateInput: (newInputComponent: InputComponentProps) => void;
	removeInput: (i: string) => void;
	reorderSelectedInputComponents: (sortObject: {
		oldIndex: number;
		newIndex: number;
	}) => void;
};
const FormInputCreator = ({
	newBBCodeForm,
	addInput,
	updateInput,
	removeInput,
	reorderSelectedInputComponents
}: FormInputCreatorProps) => {
	const [inputComponentModalProps, setInputComponentModalProps] = useState<
		InputComponentModalProps
	>({
		editMode: false,
		visible: false
	});

	const addNewInputComponent = (inputComponent: InputComponentProps) => {
		setInputComponentModalProps({
			editMode: false,
			inputComponent,
			visible: true
		});
	};

	const editInputComponent = (inputComponent: InputComponentProps) => {
		setInputComponentModalProps({
			editMode: true,
			inputComponent,
			visible: true
		});
	};

	const handleSaveInput = (inputComponent: InputComponentProps) => {
		inputComponent.inputs.map((input) => {
			return input.uniqueId !== null
				? input
				: {
						...input,
						uniqueId: `{<${input.type}>_${
							Math.floor(Math.random() * (9999 - 0)) + 0
						}}`
				  };
		});
		if (!inputComponentModalProps.editMode) {
			// Add New
			inputComponent.uniqueId = `{<${inputComponent.label}>_${
				Math.floor(Math.random() * (9999 - 0)) + 0
			}}`;
			addInput(inputComponent);
		} else {
			// Update Existing
			updateInput(inputComponent);
		}
		setInputComponentModalProps({ editMode: false, visible: false });
	};

	return (
		<Row>
			<Col xs={12} sm={2} className="input-selector-container">
				<h4 className="header">Input Types</h4>
				<div className="input-selector">
					<label className="mt-1" />
					<div className="input-types">
						{inputComponentChoiceList.map((inputComponent, i) => {
							return (
								<div key={i} className="btn-col">
									<Button onClick={() => addNewInputComponent(inputComponent)}>
										{inputComponent.typeName}
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</Col>
			<Col xs={12} sm={10}>
				<Container fluid>
					<h4 className="header">Form Preview</h4>
					<FormPreviewer
						bbCodeForm={newBBCodeForm}
						onReorderSelectedInputComponent={reorderSelectedInputComponents}
						onEditSelectedInputComponent={(inputComponent) =>
							editInputComponent(inputComponent)
						}
					/>
				</Container>
			</Col>

			{inputComponentModalProps.visible && (
				<InputComponentModal
					inputComponent={inputComponentModalProps.inputComponent}
					editMode={inputComponentModalProps.editMode}
					visible={inputComponentModalProps.visible}
					handleSubmit={handleSaveInput}
					deleteInput={(uniqueId: string) => {
						removeInput(uniqueId);
						setInputComponentModalProps({ visible: false, editMode: false });
					}}
					handleCancel={() =>
						setInputComponentModalProps({
							editMode: false,
							visible: false
						})
					}
				/>
			)}
		</Row>
	);
};

type InputComponentModalProps = {
	visible: boolean;
	inputComponent?: InputComponentProps;
	editMode?: boolean;
	handleCancel?: () => void;
	handleSubmit?: (inputComponent: InputComponentProps) => void;
	deleteInput?: (uniqueId: string) => void;
};
const InputComponentModal = ({
	inputComponent,
	visible,
	editMode,
	handleCancel,
	handleSubmit,
	deleteInput
}: InputComponentModalProps) => {
	const [label, setLabel] = useState(
		inputComponent ? inputComponent.label : ""
	);
	const [description, setDescription] = useState(
		inputComponent ? inputComponent.description : ""
	);
	const [defaultVal, setDefaultVal] = useState(
		inputComponent ? inputComponent.defaultVal : ""
	);
	const [multi, setMulti] = useState(
		inputComponent ? inputComponent.multi : false
	);

	const labelRef = useRef<HTMLInputElement>(null!);

	const [labelValid, setLabelValid] = useState(true);

	// Form Validation
	const isValidLabel = useCallback(() => {
		return label && label !== "";
	}, [label]);

	const submitForm = () => {
		if (inputComponent === undefined) {
			return null;
		} else if (!isValidLabel()) {
			setLabelValid(false);
		} else {
			let newInputComponent: InputComponentProps = {
				...inputComponent,
				label,
				description,
				defaultVal,
				multi,
				selectOptions
			};

			handleSubmit && handleSubmit(newInputComponent);
		}
	};

	// Select Options
	const [selectOptions, setSelectOptions] = useState(
		inputComponent ? inputComponent.selectOptions : []
	);
	const updateSelectOption = (selectOption: string, index: number) => {
		var currSelectOptions = selectOptions?.concat();
		currSelectOptions?.splice(index, 1, selectOption);
		setSelectOptions(currSelectOptions);
	};
	const addSelectOption = (startIndex: number) => {
		// Make a copy of the current inputComponentInputs
		var currSelectOptions = selectOptions?.concat();
		// Insert new inputTypeItem after the item whose "+" button was clicked
		currSelectOptions?.splice(startIndex + 1, 0, "");
		// Update the list of components
		setSelectOptions(currSelectOptions);
	};

	const removeSelectOption = (index: number) => {
		var currSelectOptions = selectOptions?.concat();
		currSelectOptions?.splice(index, 1);
		setSelectOptions(currSelectOptions?.concat());
	};

	useEffect(() => {
		labelRef.current.focus();
	}, []);

	useEffect(() => {
		if (!labelValid) {
			setLabelValid(isValidLabel() as boolean);
			labelRef.current.focus();
		}
	}, [label, labelValid, isValidLabel]);

	return (
		<Modal
			show={visible}
			onHide={handleCancel}
			animation={false}
			centered
			backdrop="static"
			keyboard={false}>
			<Modal.Header>
				<Modal.Title>
					<div style={{ overflowWrap: "anywhere" }}>{label}</div>
					<div className="small text-muted">{inputComponent?.typeName}</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Label>Label</Form.Label>
						<Form.Control
							value={label}
							type="text"
							onChange={(e) => setLabel(e.target.value)}
							className={`form-control ${!labelValid && "is-invalid"}`}
							ref={labelRef}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Description</Form.Label>
						<Form.Control
							value={description}
							type="text"
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Form.Group>
					{inputComponent?.type !== undefined &&
						inputComponent?.type !== "dropdown" && (
							<Form.Group>
								<Form.Label>Default Value</Form.Label>
								<InputType
									type={inputComponent?.type}
									val={defaultVal}
									setVal={(val) => setDefaultVal(val)}
								/>
							</Form.Group>
						)}
					{inputComponent?.type === "dropdown" && (
						<Form.Group>
							<Form.Label>Options</Form.Label>
							{selectOptions?.map((selectOption, i) => {
								return (
									i !== 0 && (
										<InputGroup key={i}>
											{
												<InputGroup.Prepend>
													<InputGroup.Text>{`${i}`}</InputGroup.Text>
												</InputGroup.Prepend>
											}
											<FormControl
												type="text"
												value={selectOption}
												onChange={(e) => updateSelectOption(e.target.value, i)}
											/>
											<InputGroup.Append>
												<Button
													onClick={() => removeSelectOption(i)}
													disabled={selectOptions?.length === 2}>
													<FontAwesomeIcon icon="minus" />
												</Button>
												<Button onClick={() => addSelectOption(i)}>
													<FontAwesomeIcon icon="plus" />
												</Button>
											</InputGroup.Append>
										</InputGroup>
									)
								);
							})}
						</Form.Group>
					)}
					<Form.Check
						type="switch"
						id="isMulti"
						label="[*]"
						checked={multi}
						onChange={() => setMulti(!multi)}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="danger"
					onClick={() =>
						inputComponent &&
						deleteInput &&
						deleteInput(inputComponent.uniqueId)
					}
					style={{ marginRight: "auto" }}>
					Delete
				</Button>
				<Button variant="secondary" onClick={handleCancel}>
					Cancel
				</Button>
				<Button variant="info" onClick={submitForm}>
					{editMode ? "Save" : "Add"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default FormInputCreator;

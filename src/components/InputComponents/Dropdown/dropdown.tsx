import React from "react";
import { Form } from "react-bootstrap";
import { InputTypeProps } from "../../../types/form";

export const Dropdown = ({
	placeholder,
	readOnly,
	val,
	setVal,
	selectOptions
}: InputTypeProps) => {
	return (
		<Form.Control
			as="select"
			value={val}
			onChange={(e) => {
				setVal && setVal(e.target.value);
			}}
			placeholder={placeholder}
			readOnly={readOnly}>
			{selectOptions?.map((selectOption, i) => {
				return (
					<option value={selectOption} key={i}>
						{selectOption}
					</option>
				);
			})}
		</Form.Control>
	);
};
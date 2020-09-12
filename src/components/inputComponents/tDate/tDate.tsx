import "react-datepicker/dist/react-datepicker.css";
import "../dateTimePicker.css";

import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import { InputTypeProps } from "types/formTypes";

export const TDate = ({ readOnly, val, setVal }: InputTypeProps) => {
	const [openToDate, setOpenToDate] = useState<Date>();
	useEffect(() => {
		const utc = new Date();
		setOpenToDate(
			new Date(
				utc.getUTCFullYear(),
				utc.getUTCMonth(),
				utc.getUTCDate(),
				utc.getUTCHours(),
				utc.getUTCMinutes(),
				utc.getUTCSeconds(),
				utc.getUTCMilliseconds()
			)
		);
	}, []);

	return (
		<DatePicker
			selected={val ? new Date(val) : null}
			onChange={(date) => {
				setVal && setVal(date?.toString());
			}}
			popperPlacement="auto"
			dateFormat={"dd/MMM/yyyy"}
			dateFormatCalendar={"MMM yyyy"}
			placeholderText="DD/MMM/YYYY"
			isClearable
			openToDate={openToDate}
			readOnly={readOnly}
			fixedHeight
			className="form-control"
		/>
	);
};
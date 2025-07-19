import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import Input from "../components/widget-components/Input";
import Grid from "../components/widget-grid-infrastructure/Grid";
import WidgetComponent from "../components/widget-grid-infrastructure/WidgetComponent";
import { Component } from "react";

const meta = {
	title: "WidgetComponents/Input",
	component: Input,
	decorators: [
		(Story) => (
			<div className="widget-grid__widget">
				<Grid
					ItemComponent={WidgetComponent}
					columns={1}
					rows={1}
					onSaveGridItem={() => {}}
					placerMode="NONE"
					style={{ height: "400px", width: "400px" }}
				>
					<WidgetComponent
						position={{ rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 2 }}
					>
						{<Story />}
					</WidgetComponent>
				</Grid>
			</div>
		),
	],
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		data: { control: "object" },
	},
	args: { insert: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		data: {
			category: {
				collection: "categories",
				insert: {
					color: {
						type: "text",
						required: false,
						order: "2",
					},
					name: {
						type: "text",
						order: 1,
						required: true,
					},
				},
			},
			expense: {
				collection: "expenses",
				insert: {
					amount: {
						required: true,
						type: "number",
						order: 2,
					},
					timestamp: {
						type: "datetime",
						order: "3",
						required: true,
					},
					category: {
						type: "select",
						datasource: "categories",
						required: true,
						order: 1,
					},
					note: {
						order: 4,
						type: "text",
						required: false,
					},
				},
			},
			categories: [
				{
					title: "Debt",
					value: "Debt",
				},
				{
					title: "Spending money ",
					value: "Spending money ",
				},
				{
					title: "Health",
					value: "Health",
				},
				{
					title: "pets",
					value: "pets",
				},
				{
					title: "groceries",
					value: "groceries",
				},
				{
					title: "Household",
					value: "Household",
				},
				{
					title: "Savings",
					value: "Savings",
				},
				{
					title: "Entertainment",
					value: "Entertainment",
				},
				{
					title: "utilities",
					value: "utilities",
				},
				{
					title: "Transportation",
					value: "Transportation",
				},
				{
					title: "Beauty",
					value: "Beauty",
				},
				{
					title: "Insurance",
					value: "Insurance",
				},
			],
		},
	},
};

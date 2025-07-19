import type { Meta, StoryObj } from "@storybook/react-vite";

import Grid from "../components/widget-grid-infrastructure/Grid";
import WidgetComponent from "../components/widget-grid-infrastructure/WidgetComponent";
import Barchart from "../components/widget-components/Barchart";

const meta = {
	title: "WidgetComponents/Barchart",
	component: Barchart,
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
	args: {
		data: {
			colours: [
				{
					title: "Debt",
					value: "#ff8888",
				},
				{
					title: "Health",
					value: "#88ff88",
				},
				{
					title: "pets",
					value: "#552200",
				},
				{
					title: "groceries",
					value: "#aaffaa",
				},
				{
					title: "Household",
				},
				{
					title: "Savings",
					value: "#00ccff",
				},
				{
					title: "Entertainment",
					value: "#CC00CC",
				},
				{
					title: "utilities",
					value: "#ffff88",
				},
				{
					title: "Transportation",
					value: "#ccaa88",
				},
				{
					title: "Beauty",
				},
				{
					title: "Insurance",
					value: "#88FFFF",
				},
				{
					title: "Rent",
					value: "#cccc00",
				},
			],
		},
	},
} satisfies Meta<typeof Barchart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		data: {
			...meta.args?.data,
			default: [
				{ title: "Health", value: 200.15 },
				{ title: "pets", value: 80.3 },
				{ title: "groceries", value: 250.65 },
				{ title: "Household", value: 95.0 },
				{ title: "Savings", value: 400.0 },
				{ title: "Entertainment", value: 60.0 },
				{ title: "utilities", value: 150.0 },
				{ title: "Transportation", value: 100.0 },
				{ title: "Beauty", value: 30.0 },
				{ title: "Insurance", value: 320.0 },
				{ title: "Rent", value: 1450.0 },
			],
		},

		xAxisLabel: "",
		yAxisLabel: "Amount Spent",
	},
};

export const Stacked: Story = {
	args: {
		data: {
			...meta.args?.data,
			default: [
				{
					title: "Jan",
					value: {
						Health: 200.15,
						pets: 80.3,
						groceries: 250.65,
						Household: 95.0,
						Savings: 400.0,
						Entertainment: 60.0,
						utilities: 150.0,
						Transportation: 100.0,
						Beauty: 30.0,
						Insurance: 320.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Feb",
					value: {
						Health: 180.0,
						pets: 60.0,
						groceries: 240.0,
						Household: 90.0,
						Savings: 450.0,
						Entertainment: 70.0,
						utilities: 140.0,
						Transportation: 110.0,
						Beauty: 25.0,
						Insurance: 310.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Mar",
					value: {
						Health: 210.0,
						pets: 75.0,
						groceries: 245.0,
						Household: 100.0,
						Savings: 420.0,
						Entertainment: 65.0,
						utilities: 155.0,
						Transportation: 115.0,
						Beauty: 28.0,
						Insurance: 330.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Apr",
					value: {
						Health: 190.0,
						pets: 85.0,
						groceries: 255.0,
						Household: 105.0,
						Savings: 410.0,
						Entertainment: 75.0,
						utilities: 160.0,
						Transportation: 120.0,
						Beauty: 35.0,
						Insurance: 325.0,
						Rent: 1450.0,
					},
				},
				{
					title: "May",
					value: {
						Health: 195.0,
						pets: 70.0,
						groceries: 260.0,
						Household: 110.0,
						Savings: 430.0,
						Entertainment: 80.0,
						utilities: 165.0,
						Transportation: 125.0,
						Beauty: 32.0,
						Insurance: 340.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Jun",
					value: {
						Health: 205.0,
						pets: 90.0,
						groceries: 270.0,
						Household: 115.0,
						Savings: 440.0,
						Entertainment: 85.0,
						utilities: 170.0,
						Transportation: 130.0,
						Beauty: 38.0,
						Insurance: 335.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Jul",
					value: {
						Health: 258.13,
						pets: 65.0,
						groceries: 229.77,
						Household: 83.97,
						Savings: 410.0,
						Entertainment: 49.46,
						utilities: 160.0,
						Transportation: 120.0,
						Beauty: 12.08,
						Insurance: 335.85,
						Rent: 1453.2,
					},
				},
				{
					title: "Aug",
					value: {
						Health: 220.0,
						pets: 85.0,
						groceries: 265.0,
						Household: 120.0,
						Savings: 460.0,
						Entertainment: 90.0,
						utilities: 175.0,
						Transportation: 135.0,
						Beauty: 40.0,
						Insurance: 345.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Sep",
					value: {
						Health: 210.0,
						pets: 78.0,
						groceries: 270.0,
						Household: 125.0,
						Savings: 470.0,
						Entertainment: 95.0,
						utilities: 180.0,
						Transportation: 140.0,
						Beauty: 36.0,
						Insurance: 340.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Oct",
					value: {
						Health: 215.0,
						pets: 82.0,
						groceries: 275.0,
						Household: 130.0,
						Savings: 480.0,
						Entertainment: 100.0,
						utilities: 185.0,
						Transportation: 145.0,
						Beauty: 42.0,
						Insurance: 350.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Nov",
					value: {
						Health: 225.0,
						pets: 88.0,
						groceries: 280.0,
						Household: 135.0,
						Savings: 490.0,
						Entertainment: 105.0,
						utilities: 190.0,
						Transportation: 150.0,
						Beauty: 45.0,
						Insurance: 355.0,
						Rent: 1450.0,
					},
				},
				{
					title: "Dec",
					value: {
						Health: 230.0,
						pets: 92.0,
						groceries: 285.0,
						Household: 140.0,
						Savings: 500.0,
						Entertainment: 110.0,
						utilities: 195.0,
						Transportation: 155.0,
						Beauty: 50.0,
						Insurance: 360.0,
						Rent: 1450.0,
					},
				},
			],
		},

		yAxisLabel: "Amount spent",
	},
};

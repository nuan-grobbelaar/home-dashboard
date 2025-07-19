import type { Meta, StoryObj } from "@storybook/react-vite";

import Grid from "../components/widget-grid-infrastructure/Grid";
import WidgetComponent from "../components/widget-grid-infrastructure/WidgetComponent";
import Browser from "../components/widget-components/Browser";

const meta = {
	title: "WidgetComponents/Browser",
	component: Browser,
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
		formats: { control: "object" },
	},
	args: {},
} satisfies Meta<typeof Browser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		formats: {
			expenses: {
				title: {
					name: "note",
				},
				secondaryFields: [
					{
						name: "amount",
						format: "currency",
					},
					{
						format: "datetime",
						name: "timestamp",
					},
				],
				tag: {
					name: "category",
				},
			},
		},
		data: {
			expenses: [
				{
					title: "0",
					value: {
						note: "Waterbottle for gym",
						amount: "29",
						timestamp: {
							seconds: 1752576841,
							nanoseconds: 288000000,
						},
						category: "Health",
					},
				},
				{
					title: "1",
					value: {
						timestamp: {
							seconds: 1752667071,
							nanoseconds: 916000000,
						},
						category: "Entertainment",
						note: "Netflix",
						amount: "14.99",
					},
				},
				{
					title: "2",
					value: {
						timestamp: {
							seconds: 1752685333,
							nanoseconds: 386000000,
						},
						amount: "4.18",
						note: "Sweet potato and tomatoes",
						category: "groceries",
					},
				},
				{
					title: "3",
					value: {
						amount: "2.05",
						category: "groceries",
						timestamp: {
							seconds: 1752871419,
							nanoseconds: 551000000,
						},
						note: "Coke",
					},
				},
				{
					title: "4",
					value: {
						note: "Weekly",
						category: "groceries",
						timestamp: {
							seconds: 1752565729,
							nanoseconds: 86000000,
						},
						amount: "130.85",
					},
				},
				{
					title: "5",
					value: {
						category: "groceries",
						amount: "32.7",
						timestamp: {
							seconds: 1752594592,
							nanoseconds: 584000000,
						},
						note: "Beef, chicken and walnuts",
					},
				},
			],
		},
	},
};

export const Search: Story = {
	args: {
		formats: {
			expenses: {
				title: {
					name: "note",
				},

				secondaryFields: [
					{
						name: "amount",
						format: "currency",
					},
					{
						format: "datetime",
						name: "timestamp",
					},
				],

				tag: {
					name: "category",
				},
			},
		},

		data: {
			expenses: [
				{
					title: "0",

					value: {
						note: "Waterbottle for gym",
						amount: "29",

						timestamp: {
							seconds: 1752576841,
							nanoseconds: 288000000,
						},

						category: "Health",
					},
				},
				{
					title: "1",

					value: {
						timestamp: {
							seconds: 1752667071,
							nanoseconds: 916000000,
						},

						category: "Entertainment",
						note: "Netflix",
						amount: "14.99",
					},
				},
				{
					title: "2",

					value: {
						timestamp: {
							seconds: 1752685333,
							nanoseconds: 386000000,
						},

						amount: "4.18",
						note: "Sweet potato and tomatoes",
						category: "groceries",
					},
				},
				{
					title: "3",

					value: {
						amount: "2.05",
						category: "groceries",

						timestamp: {
							seconds: 1752871419,
							nanoseconds: 551000000,
						},

						note: "Coke",
					},
				},
				{
					title: "4",

					value: {
						note: "Weekly",
						category: "groceries",

						timestamp: {
							seconds: 1752565729,
							nanoseconds: 86000000,
						},

						amount: "130.85",
					},
				},
				{
					title: "5",

					value: {
						category: "groceries",
						amount: "32.7",

						timestamp: {
							seconds: 1752594592,
							nanoseconds: 584000000,
						},

						note: "Beef, chicken and walnuts",
					},
				},
			],
		},

		isMobile: false,
		editMode: false,

		search: {
			expenses: {
				fields: [
					{
						operator: "==",
						type: "text",
						id: "search",
						fieldName: "note",
					},
					{
						id: "after",
						operator: ">=",
						type: "datetime",
						fieldName: "timestamp",
					},
					{
						fieldName: "timestamp",
						id: "before",
						type: "datetime",
						operator: "<",
					},
				],
			},
		},
	},
};

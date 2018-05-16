var menu_data = [
	{id: "dashboard", icon: "dashboard", value: "Dashboards",  data:[
		{ id: "dashboard1", value: "Dashboard 1"},
		{ id: "dashboard2", value: "Dashboard 2"}
	]},
	{id: "layouts", icon: "columns", value:"Layouts", data:[
		{ id: "accordions", value: "Accordions"},
		{ id: "portlets", value: "Portlets"}
	]},
	{id: "tables", icon: "table", value:"Data Tables", data:[
		{ id: "tables1", value: "Datatable"},
		{ id: "tables2", value: "TreeTable"},
		{ id: "tables3", value: "Pivot"}
	]},
	{id: "uis", icon: "puzzle-piece", value:"UI Components", data:[
		{ id: "dataview", value: "DataView"},
		{ id: "list", value: "List"},
		{ id: "menu", value: "Menu"},
		{ id: "tree", value: "Tree"}
	]},
	{id: "tools", icon: "calendar-o", value:"Tools", data:[
		{ id: "kanban", value: "Kanban Board"},
		{ id: "pivot", value: "Pivot Chart"},
		{ id: "scheduler", value: "Calendar"}
	]},
	{id: "forms", icon: "pencil-square-o", value:"Forms",  data:[
		{ id: "buttons", value: "Buttons"},
		{ id: "selects", value: "Select boxes"},
		{ id: "inputs", value: "Inputs"}
	]},
	{id: "demo", icon: "book", value:"Documentation"}
];


var menu_data_multi  = [
    { id: "structure", icon: "columns", value:"Structuring", data:[
        { id: "layouts", icon:"circle", value:"Layouts", data:[
        	{ id: "layout", icon:"circle-o", value: "Layout"},
            { id: "flexlayout", icon:"circle-o", value: "Flex Layout"},
            { id:"strict", icon:"circle-o", value:"Precise Positioning", data:[
				{ id: "gridlayout", icon:"circle-o", value: "Grid Layoot"},
            	{ id: "dashboard",  icon:"circle-o", value: "Dashboard"},
            	{ id: "abslayout", icon:"circle-o", value: "Abs Layout"}
            ]},
            { id: "datalayouts", icon:"circle-o", value:"Data Layouts",  data:[
            	{ id: "datalayout", icon:"circle-o", value: "Data Layout"},
            	{ id: "flexdatalayout",  icon:"circle-o", value: "Flex Data Layout"},
            ]}
        ]},
        {id: "multiviews", icon:"circle", value:"Multiviews", data:[
            { id: "multiview", icon:"circle-o", value: "MultiView"},
            { id: "tabview",  icon:"circle-o", value: "TabView"},
            { id: "accordion",  icon:"circle-o", value: "Accordion"},
            { id: "carousel", icon:"circle-o", value: "Casousel"}
        ]}
    ]},
    {id: "tools", icon: "calendar-o", value:"Tools", data:[
        { id: "kanban", icon:"circle", value: "Kanban Board"},
        { id: "pivot", icon:"circle", value: "Pivot Chart"},
        { id: "scheduler", icon:"circle", value: "Calendar"}
    ]},
    {id: "forms", icon: "pencil-square-o", value:"Forms",  data:[
    	{id: "buttons", icon:"circle", value: "Buttons", data:[
    		{id: "button", icon:"circle-o", value: "Buttons"},
    		{id: "segmented", icon:"circle-o", value: "Segmented"},
    		{id: "toggle", icon:"circle-o", value: "Toggle"},
    	]},
    	{ id:"texts", icon:"circle", value:"Text Fields", data:[
    		{ id: "text", icon:"circle-o", value: "Text"},
    		{ id: "textarea", icon:"circle-o", value: "Textarea"},
    		{ id: "richtext", icon:"circle-o", value: "RichText"}
    	]},
    	{ id:"selects", icon:"circle", value:"Selectors", data:[
    		{ id:"single", icon:"circle-o", value:"Single value", data:[
				{ id: "combo", icon:"circle-o", value: "Combo"},
				{ id: "richselect", icon:"circle-o", value: "RichSelect"},
				{ id: "select", icon:"circle-o", value: "Select"}
    		]},
    		{ id:"multi", icon:"circle-o", value:"Multiple values", data:[
    			{ id: "multicombo", icon:"circle-o", value: "MultiCombo"},
				{ id: "multiselect", icon:"circle-o", value: "MultiSelect"}
    		]}
    	]}
    ]},
    {id: "demo", icon: "book", value:"Documentation"}
];
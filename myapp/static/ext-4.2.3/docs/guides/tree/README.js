Ext.data.JsonP.tree({"guide":"<h1>Trees</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/tree-section-1'>The Node Interface</a></li>\n<li><a href='#!/guide/tree-section-2'>Visually changing your tree</a></li>\n<li><a href='#!/guide/tree-section-3'>Multiple columns</a></li>\n<li><a href='#!/guide/tree-section-4'>Adding nodes to the tree</a></li>\n<li><a href='#!/guide/tree-section-5'>Loading and Saving Tree Data using a Proxy</a></li>\n</ol>\n</div>\n\n<hr />\n\n<p>The <a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Tree Panel</a> Component is one of the most versatile Components in Ext JS and is an excellent tool for displaying heirarchical data in an application.  Tree Panel extends from the same class as <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>, so all of the benefits of Grid Panels - features, extensions, and plugins can also be used on Tree Panels. Things like columns, column resizing, dragging and dropping, renderers, sorting and filtering can be expected to work similarly for both components.</p>\n\n<p>Let's start by creating a very simple Tree.</p>\n\n<pre class='inline-example '><code><a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Ext.tree.Panel</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    title: 'Simple Tree',\n    width: 150,\n    height: 150,\n    root: {\n        text: 'Root',\n        expanded: true,\n        children: [\n            {\n                text: 'Child 1',\n                leaf: true\n            },\n            {\n                text: 'Child 2',\n                leaf: true\n            },\n            {\n                text: 'Child 3',\n                expanded: true,\n                children: [\n                    {\n                        text: 'Grandchild',\n                        leaf: true\n                    }\n                ]\n            }\n        ]\n    }\n});\n</code></pre>\n\n<p>This Tree Panel renders itself to the document body.  We defined a root node that is expanded by default. The root node has three children, the first two of which are leaf nodes which means they cannot have any children.  The third node is not a leaf node and has has one child leaf node.  The <code>text</code> property is used as the node's text label. See <a href=\"guides/tree/examples/simple_tree/index.html\">Simple Tree</a> for a live demo.</p>\n\n<p>Internally a Tree Panel stores its data in a <a href=\"#!/api/Ext.data.TreeStore\" rel=\"Ext.data.TreeStore\" class=\"docClass\">TreeStore</a>. The above example uses the <a href=\"#!/api/Ext.tree.Panel-cfg-root\" rel=\"Ext.tree.Panel-cfg-root\" class=\"docClass\">root</a> config as a shortcut for configuring a store.  If we were to configure the store separately, the code would look something like this:</p>\n\n<pre><code>var store = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.data.TreeStore\" rel=\"Ext.data.TreeStore\" class=\"docClass\">Ext.data.TreeStore</a>', {\n    root: {\n        text: 'Root',\n        expanded: true,\n        children: [\n            {\n                text: 'Child 1',\n                leaf: true\n            },\n            {\n                text: 'Child 2',\n                leaf: true\n            },\n            ...\n        ]\n    }\n});\n\n<a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Ext.tree.Panel</a>', {\n    title: 'Simple Tree',\n    store: store,\n    ...\n});\n</code></pre>\n\n<p>For more on <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>s see the <a href=\"#/guide/data\">Data Guide</a>.</p>\n\n<h2 id='tree-section-1'>The Node Interface</h2>\n\n<p>In the above examples we set a couple of different properties on tree nodes. But what are nodes exactly? As mentioned before, the Tree Panel is bound to a <a href=\"#!/api/Ext.data.TreeStore\" rel=\"Ext.data.TreeStore\" class=\"docClass\">TreeStore</a>. A Store in Ext JS manages a collection of <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> instances. Tree nodes are simply Model instances that are decorated with a <a href=\"#!/api/Ext.data.NodeInterface\" rel=\"Ext.data.NodeInterface\" class=\"docClass\">NodeInterface</a>.  Decorating a Model with a NodeInterface gives the Model the fields, methods and properties that are required for it to be used in a tree.  The following is a screenshot that shows the structure of a node in the developer tools.</p>\n\n<p><p><img src=\"guides/tree/nodeinterface.png\" alt=\"A model instance decorated with the NodeInterface\"></p></p>\n\n<p>In order to see the full set of fields, methods and properties available on nodes, see the API documentation for the <a href=\"#!/api/Ext.data.NodeInterface\" rel=\"Ext.data.NodeInterface\" class=\"docClass\">NodeInterface</a> class.</p>\n\n<h2 id='tree-section-2'>Visually changing your tree</h2>\n\n<p>Let's try something simple. When you set the <a href=\"#!/api/Ext.tree.Panel-cfg-useArrows\" rel=\"Ext.tree.Panel-cfg-useArrows\" class=\"docClass\">useArrows</a> configuration to true, the Tree Panel hides the lines and uses arrows as expand and collapse icons.</p>\n\n<p><p><img src=\"guides/tree/arrows.png\" alt=\"Arrows\"></p></p>\n\n<p>Setting the <a href=\"#!/api/Ext.tree.Panel-cfg-rootVisible\" rel=\"Ext.tree.Panel-cfg-rootVisible\" class=\"docClass\">rootVisible</a> property to false visually removes the root node. By doing this, the root node will automatically be expanded. The following image shows the same tree with <code>rootVisible</code> set to false and <a href=\"#!/api/Ext.tree.Panel-cfg-lines\" rel=\"Ext.tree.Panel-cfg-lines\" class=\"docClass\">lines</a> set to false.</p>\n\n<p><p><img src=\"guides/tree/root-lines.png\" alt=\"Root not visible and no lines\"></p></p>\n\n<h2 id='tree-section-3'>Multiple columns</h2>\n\n<p>Since <a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Tree Panel</a> extends from the same base class as <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> adding more columns is very easy to do.</p>\n\n<pre class='inline-example '><code>var tree = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Ext.tree.Panel</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    title: 'TreeGrid',\n    width: 300,\n    height: 150,\n    fields: ['name', 'description'],\n    columns: [{\n        xtype: 'treecolumn',\n        text: 'Name',\n        dataIndex: 'name',\n        width: 150,\n        sortable: true\n    }, {\n        text: 'Description',\n        dataIndex: 'description',\n        flex: 1,\n        sortable: true\n    }],\n    root: {\n        name: 'Root',\n        description: 'Root description',\n        expanded: true,\n        children: [{\n            name: 'Child 1',\n            description: 'Description 1',\n            leaf: true\n        }, {\n            name: 'Child 2',\n            description: 'Description 2',\n            leaf: true\n        }]\n    }\n});\n</code></pre>\n\n<p>The <a href=\"#!/api/Ext.tree.Panel-cfg-columns\" rel=\"Ext.tree.Panel-cfg-columns\" class=\"docClass\">columns</a> configuration expects an array of <a href=\"#!/api/Ext.grid.column.Column\" rel=\"Ext.grid.column.Column\" class=\"docClass\">Ext.grid.column.Column</a> configurations just like a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> would have.  The only difference is that a Tree Panel requires at least one column with an xtype of 'treecolumn'.  This type of column has tree-specific visual effects like depth, lines and expand and collapse icons. A typical Tree Panel would have only one 'treecolumn'.</p>\n\n<p>The <code>fields</code> configuration is passed on to the Model that the internally created Store uses (See the <a href=\"#/guide/data\">Data Guide</a> for more information on <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a>s). Notice how the <a href=\"#!/api/Ext.grid.column.Column-cfg-dataIndex\" rel=\"Ext.grid.column.Column-cfg-dataIndex\" class=\"docClass\">dataIndex</a> configurations on the columns map to the fields we specified - name and description.</p>\n\n<p>It is also worth noting that when columns are not defined, the tree will automatically create one single <code>treecolumn</code> with a <code>dataIndex</code> set to 'text'. It also hides the headers on the tree. To show this header when using only a single column set the <code>hideHeaders</code> configuration to 'false'.</p>\n\n<h2 id='tree-section-4'>Adding nodes to the tree</h2>\n\n<p>The root node for the Tree Panel does not have to be specified in the initial configuration.  We can always add it later:</p>\n\n<pre><code>var tree = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Ext.tree.Panel</a>');\ntree.setRootNode({\n    text: 'Root',\n    expanded: true,\n    children: [{\n        text: 'Child 1',\n        leaf: true\n    }, {\n        text: 'Child 2',\n        leaf: true\n    }]\n});\n</code></pre>\n\n<p>Although this is useful for very small trees with only a few static nodes, most Tree Panels will contain many more nodes. So let's take a look at how we can programmatically add new nodes to the tree.</p>\n\n<pre><code>var root = tree.getRootNode();\n\nvar parent = root.appendChild({\n    text: 'Parent 1'\n});\n\nparent.appendChild({\n    text: 'Child 3',\n    leaf: true\n});\n\nparent.expand();\n</code></pre>\n\n<p>Every node that is not a leaf node has an <a href=\"#!/api/Ext.data.NodeInterface-method-appendChild\" rel=\"Ext.data.NodeInterface-method-appendChild\" class=\"docClass\">appendChild</a> method which accepts a Node, or a config object for a Node as its first parameter, and returns the Node that was appended. The above example also calls the <a href=\"#!/api/Ext.data.NodeInterface-method-expand\" rel=\"Ext.data.NodeInterface-method-expand\" class=\"docClass\">expand</a> method to expand the newly created parent.</p>\n\n<p><p><img src=\"guides/tree/append-children.png\" alt=\"Appending to the tree\"></p></p>\n\n<p>Also useful is the ability to define children inline when creating the new parent nodes. The following code gives us the same result.</p>\n\n<pre><code>var parent = root.appendChild({\n    text: 'Parent 1',\n    expanded: true,\n    children: [{\n        text: 'Child 3',\n        leaf: true\n    }]\n});\n</code></pre>\n\n<p>Sometimes we want to insert a node into a specific location in the tree instead of appending it. Besides the <code>appendChild</code> method, <a href=\"#!/api/Ext.data.NodeInterface\" rel=\"Ext.data.NodeInterface\" class=\"docClass\">Ext.data.NodeInterface</a> also provides <a href=\"#!/api/Ext.data.NodeInterface-method-insertBefore\" rel=\"Ext.data.NodeInterface-method-insertBefore\" class=\"docClass\">insertBefore</a> and <a href=\"#!/api/Ext.data.NodeInterface-method-insertChild\" rel=\"Ext.data.NodeInterface-method-insertChild\" class=\"docClass\">insertChild</a> methods.</p>\n\n<pre><code>var child = parent.insertChild(0, {\n    text: 'Child 2.5',\n    leaf: true\n});\n\nparent.insertBefore({\n    text: 'Child 2.75',\n    leaf: true\n}, child.nextSibling);\n</code></pre>\n\n<p>The <code>insertChild</code> method expects an index at which the child will be inserted. The <code>insertBefore</code> method expects a reference node. The new node will be inserted before the reference node.</p>\n\n<p><p><img src=\"guides/tree/insert-children.png\" alt=\"Inserting children into the tree\"></p></p>\n\n<p>NodeInterface also provides several more properties on nodes that can be used to reference other nodes.</p>\n\n<ul>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-nextSibling\" rel=\"Ext.data.NodeInterface-property-nextSibling\" class=\"docClass\">nextSibling</a></li>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-previousSibling\" rel=\"Ext.data.NodeInterface-property-previousSibling\" class=\"docClass\">previousSibling</a></li>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-parentNode\" rel=\"Ext.data.NodeInterface-property-parentNode\" class=\"docClass\">parentNode</a></li>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-lastChild\" rel=\"Ext.data.NodeInterface-property-lastChild\" class=\"docClass\">lastChild</a></li>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-firstChild\" rel=\"Ext.data.NodeInterface-property-firstChild\" class=\"docClass\">firstChild</a></li>\n<li><a href=\"#!/api/Ext.data.NodeInterface-property-childNodes\" rel=\"Ext.data.NodeInterface-property-childNodes\" class=\"docClass\">childNodes</a></li>\n</ul>\n\n\n<h2 id='tree-section-5'>Loading and Saving Tree Data using a Proxy</h2>\n\n<p>Loading and saving Tree data is somewhat more complex than dealing with flat data because of all the fields that are required to represent the hierarchical structure of the tree.\nThis section will explain the intricacies of working with tree data.</p>\n\n<h3>NodeInterface Fields</h3>\n\n<p>The first and most important thing to understand when working with tree data is how the <a href=\"#!/api/Ext.data.NodeInterface\" rel=\"Ext.data.NodeInterface\" class=\"docClass\">NodeInterface</a> class' fields work.\nEvery node in a Tree is simply a <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> instance decorated with the NodeInterface's fields and methods.\nAssume for a moment that an application has a Model called Person.  A Person only has two fields - id and name:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('Person', {\n    extend: '<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a>',\n    fields: [\n        { name: 'id', type: 'int' },\n        { name: 'name', type: 'string' }\n    ]\n});\n</code></pre>\n\n<p>At this point Person is just a plain vanilla Model.  If an instance is created, it can easily be verified that it only has two fields by looking at its <code>fields</code> collection</p>\n\n<pre><code>console.log(Person.prototype.fields.getCount()); // outputs '2'\n</code></pre>\n\n<p>When the Person model is used in a TreeStore, something interesting happens.  Notice the field count now:</p>\n\n<pre><code>var store = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.data.TreeStore\" rel=\"Ext.data.TreeStore\" class=\"docClass\">Ext.data.TreeStore</a>', {\n    model: 'Person',\n    root: {\n        name: 'Phil'\n    }\n});\n\nconsole.log(Person.prototype.fields.getCount()); // outputs '24'\n</code></pre>\n\n<p>The Person model's prototype got 22 extra fields added to it just by using it in a TreeStore.  All of these extra fields are defined on the <a href=\"#!/api/Ext.data.NodeInterface\" rel=\"Ext.data.NodeInterface\" class=\"docClass\">NodeInterface</a>\nclass and are added to the Model's prototype the first time an instance of that Model is used in a TreeStore (by setting it as the root node).</p>\n\n<p>So what exactly are these 22 extra fields, and what do they do?  A quick look at the NodeInterface source code reveals that it decorates the Model with the following fields.\nThese fields are used internally to store information relating to the tree's structure and state:</p>\n\n<pre><code>{ name : 'parentId',   type : idType,    defaultValue : null,  useNull : idField.useNull                },\n{ name : 'index',      type : 'int',     defaultValue : -1,    persist : false          , convert: null },\n{ name : 'depth',      type : 'int',     defaultValue : 0,     persist : false          , convert: null },\n{ name : 'expanded',   type : 'bool',    defaultValue : false, persist : false          , convert: null },\n{ name : 'expandable', type : 'bool',    defaultValue : true,  persist : false          , convert: null },\n{ name : 'checked',    type : 'auto',    defaultValue : null,  persist : false          , convert: null },\n{ name : 'leaf',       type : 'bool',    defaultValue : false                            },\n{ name : 'cls',        type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'iconCls',    type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'icon',       type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'root',       type : 'boolean', defaultValue : false, persist : false          , convert: null },\n{ name : 'isLast',     type : 'boolean', defaultValue : false, persist : false          , convert: null },\n{ name : 'isFirst',    type : 'boolean', defaultValue : false, persist : false          , convert: null },\n{ name : 'allowDrop',  type : 'boolean', defaultValue : true,  persist : false          , convert: null },\n{ name : 'allowDrag',  type : 'boolean', defaultValue : true,  persist : false          , convert: null },\n{ name : 'loaded',     type : 'boolean', defaultValue : false, persist : false          , convert: null },\n{ name : 'loading',    type : 'boolean', defaultValue : false, persist : false          , convert: null },\n{ name : 'href',       type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'hrefTarget', type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'qtip',       type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'qtitle',     type : 'string',  defaultValue : '',    persist : false          , convert: null },\n{ name : 'qshowDelay', type : 'int',     defaultValue : 0,     persist : false          , convert: null },\n{ name : 'children',   type : 'auto',    defaultValue : null,  persist : false          , convert: null }\n</code></pre>\n\n<h4>NodeInterface Fields are Reserved Names</h4>\n\n<p>It is important to note that all of the above field names should be treated as \"reserved\" names.  For example, it is not allowed to have a field called \"parentId\"\nin a Model, if that Model is intended to be used in a Tree, since the Model's field will override the NodeInterface field.  The exception to this rule is\nwhen there is a legitimate need to override the persistence of a field.</p>\n\n<h4>Persistent Fields vs Non-persistent Fields and Overriding the Persistence of Fields</h4>\n\n<p>Most of NodeInterface's fields default to <code>persist: false</code>.  This means they are non-persistent fields by default.  Non-persistent fields will not be saved via\nthe Proxy when calling the TreeStore's sync method or calling save() on the Model.  In most cases, the majority of these fields can be left at their default\npersistence setting,  but there are cases where it is necessary to override the persistence of some fields.  The following example demonstrates how to override\nthe persistence of a NodeInterface field.  When overriding a NodeInterface field it is important to only change the <code>persist</code> property.  <code>name</code>, <code>type</code>, and <code>defaultValue</code>\nshould never be changed.</p>\n\n<pre><code>// overriding the persistence of NodeInterface fields in a Model definition\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('Person', {\n    extend: '<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a>',\n    fields: [\n        // Person fields\n        { name: 'id', type: 'int' },\n        { name: 'name', type: 'string' }\n\n        // override a non-persistent NodeInterface field to make it persistent\n        { name: 'iconCls', type: 'string',  defaultValue: null, persist: true },\n\n        // Make the index persistent, so that when reordering nodes, syncing to the server\n        // passes the new index as well as the parentId.\n        // (Note that if moved to the same index in a different parent, the index will still be sent in order to fully describe the operation)\n        { name: 'index', type: 'int', defaultValue: -1, persist: true}\n    ]\n});\n</code></pre>\n\n<p>Let's take a more in-depth look at each NodeInterface field and the scenarios in which it might be necessary to  override its <code>persist</code> property.\nIn each example below it is assumed that a <a href=\"#!/api/Ext.data.proxy.Server\" rel=\"Ext.data.proxy.Server\" class=\"docClass\">Server Proxy</a> is being used unless otherwise noted.</p>\n\n<p>Persistent by default:</p>\n\n<ul>\n<li><code>parentId</code> - used to store the id of a node's parent node.  This field should always be persistent, and should not be overridden.</li>\n<li><code>leaf</code> - used to indicate that the node is a leaf node, and therefore cannot have children appended to it.  This field should not normally need to be overridden.</li>\n</ul>\n\n\n<p>Non-persistent by default:</p>\n\n<ul>\n<li><code>index</code> - used to store the order of nodes within their parent. When a node is <a href=\"#!/api/Ext.data.NodeInterface-method-insertBefore\" rel=\"Ext.data.NodeInterface-method-insertBefore\" class=\"docClass\">inserted</a> or\n<a href=\"#!/api/Ext.data.NodeInterface-method-removeChild\" rel=\"Ext.data.NodeInterface-method-removeChild\" class=\"docClass\">removed</a>, all of its sibling nodes after the insertion or removal point will have their indexes updated.\nIf desired, the application can use this field to persist the ordering of nodes. However, if the server uses a different method of storing order,\nit may be more appropriate to leave the index field as non-persistent. When using a <a href=\"#!/api/Ext.data.proxy.WebStorage\" rel=\"Ext.data.proxy.WebStorage\" class=\"docClass\">WebStorage Proxy</a> if storing order\nis required, this field must be overridden to be persistent. Also if client-side <a href=\"#!/api/Ext.data.TreeStore-cfg-folderSort\" rel=\"Ext.data.TreeStore-cfg-folderSort\" class=\"docClass\">sorting</a> is being used it is recommended\nfor the index field to be left as non-persistent, since sorting updates the indexes of all the sorted nodes, which would cause them to be persisted\non next sync or save if the <code>persist</code> property is true.</li>\n<li><code>depth</code> - used to store the depth of a node in the tree hierarchy.  Override this field to turn on persistence if the server needs to store the depth field.\nWhen using a <a href=\"#!/api/Ext.data.proxy.WebStorage\" rel=\"Ext.data.proxy.WebStorage\" class=\"docClass\">WebStorage Proxy</a> it is recommended to not override the persistence of the depth field since it is not needed\nto properly store the tree structure and will just take up extra space.</li>\n<li><code>checked</code> - this field should be overridden to be persistent if the tree is using the <a href=\"#!/example/tree/check-tree.html\">checkbox feature</a></li>\n<li><code>expanded</code> - used to store the expanded/collapsed state of a node.  This field should not normally need to be overridden.</li>\n<li><code>expandable</code> - used internally to indicate that this node is expandable.  Do not override the persistence of this field.</li>\n<li><code>cls</code> - used to apply a css class to the node when it is rendered in a TreePanel.  Override this field to be persistent if desired.</li>\n<li><code>iconCls</code> - used to apply a css class to the node's icon when it is rendered in a TreePanel.  Override this field to be persistent if desired.</li>\n<li><code>icon</code> - used to apply a cutom icon to the node node when it is rendered in a TreePanel.  Override this field to be persistent if desired.</li>\n<li><code>root</code> - used to indicate that this node is the root node.  This field should not be overridden.</li>\n<li><code>isLast</code> - used to indicate that this node is the last of its siblings. This field should not normally need to be overridden.</li>\n<li><code>isFirst</code> - used to indicate that this node is the first of its siblings. This field should not normally need to be overridden.</li>\n<li><code>allowDrop</code> - used internally to deny dropping on the node.  Do not override the persistence of this field.</li>\n<li><code>allowDrag</code> - used internally to deny dragging the node.  Do not override the persistence of this field.</li>\n<li><code>loaded</code> - used internally to indicate that the node's children have been loaded.  Do not override the persistence of this field.</li>\n<li><code>loading</code> - used internally to indicate that the proxy is in the process of loading the node's children. Do not override the persistence of this field.</li>\n<li><code>href</code> - used to specify a url that the node should be a link to.  Override to be persistent if desired.</li>\n<li><code>hrefTarget</code> - used to specify the target for the <code>href</code>.  Override to be persistent if desired.</li>\n<li><code>qtip</code> - used to add a tooltip text to the node.  Override to be persistent if desired.</li>\n<li><code>qtitle</code> - used to specify the title for the <code>tooltip</code>.  Override to be persistent if desired.</li>\n<li><code>children</code> - used internally when loading a node and its children all in one request.  Do not override the persistence of this field.</li>\n</ul>\n\n\n<h3>Loading Data</h3>\n\n<p>There are two ways to load tree data.  The first is to for the proxy to fetch the entire tree all at once.  For larger trees where loading everything\nat once is not ideal, it may be preferable to use the second method - dynamically loading the children for each node when it is expanded.</p>\n\n<h4>Loading the Entire Tree</h4>\n\n<p>Internally the tree only loads data in response to a node being expanded.  However the entire hierarchy can be loaded if the proxy retrieves a nested object\ncontaining the whole tree structure.  To accomplish this, initialize the TreeStore's root node to <code>expanded</code>:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('Person', {\n    extend: '<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a>',\n    fields: [\n        { name: 'id', type: 'int' },\n        { name: 'name', type: 'string' }\n    ],\n    proxy: {\n        type: 'ajax',\n        api: {\n            create: 'createPersons',\n            read: 'readPersons',\n            update: 'updatePersons',\n            destroy: 'destroyPersons'\n        }\n    }\n\n});\n\nvar store = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.data.TreeStore\" rel=\"Ext.data.TreeStore\" class=\"docClass\">Ext.data.TreeStore</a>', {\n    model: 'Person',\n    root: {\n        name: 'People',\n        expanded: true\n    }\n});\n\n<a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.tree.Panel\" rel=\"Ext.tree.Panel\" class=\"docClass\">Ext.tree.Panel</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    width: 300,\n    height: 200,\n    title: 'People',\n    store: store,\n    columns: [\n        { xtype: 'treecolumn', header: 'Name', dataIndex: 'name', flex: 1 }\n    ]\n});\n</code></pre>\n\n<p>Assume that the <code>readPersons</code> url returns the following json object</p>\n\n<pre><code>{\n    \"success\": true,\n    \"children\": [\n        { \"id\": 1, \"name\": \"Phil\", \"leaf\": true },\n        { \"id\": 2, \"name\": \"Nico\", \"expanded\": true, \"children\": [\n            { \"id\": 3, \"name\": \"Mitchell\", \"leaf\": true }\n        ]},\n        { \"id\": 4, \"name\": \"Sue\", \"loaded\": true }\n    ]\n}\n</code></pre>\n\n<p>That's all that's needed to load the entire tree.</p>\n\n<p><p><img src=\"guides/tree/tree-bulk-load.png\" alt=\"Tree with Bulk Loaded Data\"></p></p>\n\n<p>Important items to note:</p>\n\n<ul>\n<li>For all non-leaf nodes that do not have children (for example, Person with name Sue above),\nthe server response MUST set the <code>loaded</code> property to <code>true</code>.  Otherwise the proxy will attempt to load children for these nodes when they are expanded.</li>\n<li>The question then arises - if the server is allowed to set the <code>loaded</code> property on a node in the JSON response can it set any of the other non-persistent fields?\nThe answer is yes - sometimes.  In the example above the node with name \"Nico\" has is <code>expanded</code> field set to <code>true</code> so that it will be initially displayed as expanded\nin the Tree Panel.  Caution should be exercised as there are cases where this is not appropriate and could cause serious problems, like setting the <code>root</code> property on\na node that is not the root node for example.  In general <code>loaded</code> and <code>expanded</code> are the only cases where it is recommended for the server to set a non-persistent field\nin the JSON response.</li>\n</ul>\n\n\n<h4>Dynamically Loading Children When a Node is Expanded</h4>\n\n<p>For larger trees it may be desirable to only load parts of the tree by loading child nodes only when their parent node is expanded.  Suppose in the above example,\nthat the node with name \"Sue\" does not have its <code>loaded</code> field set to <code>true</code> by the server response.  The Tree would display an expander icon next to the node.\nWhen the node is expanded the proxy will make another request to the <code>readPersons</code> url that looks something like this:</p>\n\n<pre><code>/readPersons?node=4\n</code></pre>\n\n<p>This tells the server to retrieve the child nodes for the node with an id of 4.  The data should be returned in the same format as the data that was used to load the root node:</p>\n\n<pre><code>{\n    \"success\": true,\n    \"children\": [\n        { \"id\": 5, \"name\": \"Evan\", \"leaf\": true }\n    ]\n}\n</code></pre>\n\n<p>Now the Tree looks something like this:</p>\n\n<p><p><img src=\"guides/tree/tree-dynamic-load.png\" alt=\"Tree with Dynamically Loaded Node\"></p></p>\n\n<h3>Saving Data</h3>\n\n<p>Creating, updating, and deleting nodes is handled automatically and seamlessly by the Proxy.</p>\n\n<h4>Creating a New Node</h4>\n\n<pre><code>// Create a new node and append it to the tree:\nvar newPerson = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('Person', { name: 'Nige', leaf: true });\nstore.getNodeById(2).appendChild(newPerson);\n</code></pre>\n\n<p>Since the proxy is defined directly on the Model, the Model's <a href=\"#!/api/Ext.data.Model-method-save\" rel=\"Ext.data.Model-method-save\" class=\"docClass\">save()</a> method can be used to persist the data:</p>\n\n<pre><code>newPerson.save();\n</code></pre>\n\n<h4>Updating an Existing Node</h4>\n\n<pre><code>store.getNodeById(1).set('name', 'Philip');\n</code></pre>\n\n<h4>Removing a Node</h4>\n\n<pre><code>store.getRootNode().lastChild.remove();\n</code></pre>\n\n<h4>Bulk Operations</h4>\n\n<p>After creating, updating, and removing several nodes, they can all be persisted in one operation by calling the TreeStore's <a href=\"#!/api/Ext.data.TreeStore-method-sync\" rel=\"Ext.data.TreeStore-method-sync\" class=\"docClass\">sync()</a> method:</p>\n\n<pre><code>store.sync();\n</code></pre>\n","title":"Trees"});
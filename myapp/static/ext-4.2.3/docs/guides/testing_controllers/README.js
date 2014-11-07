Ext.data.JsonP.testing_controllers({"guide":"<h1>Unit testing MVC Controllers</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/testing_controllers-section-1'>Overview</a></li>\n<li><a href='#!/guide/testing_controllers-section-2'>Testing refs</a></li>\n<li><a href='#!/guide/testing_controllers-section-3'>Testing control component selectors</a></li>\n<li><a href='#!/guide/testing_controllers-section-4'>Testing event domain selectors</a></li>\n</ol>\n</div>\n\n<h2 id='testing_controllers-section-1'>Overview</h2>\n\n<p>Controllers are the part of the <a href=\"#!guide/application_architecture\">MVC</a>\napplication architecture that execute the application logic such as responding\nto events and handling the business logic for your application.</p>\n\n<p>Unit testing Controllers is complicated and resembles integration testing in\nthat it involves testing many <a href=\"#!/guide/components\">components</a> at once. It is\nimportant to simplify the testing process as much as possible, breaking the\ncomponent interaction down to the smallest reasonable pieces so that you only\nneed to debug a small piece of code when tests fail.</p>\n\n<p>The most important parts of a Controller are its refs and component selectors;\nit is crucial to ensure that these selectors are tested properly. Selectors are\none of the hardest things to test because they rely on the existence and\nparticular layout of the components they select.</p>\n\n<p>For the simplified examples of test suites, we will use the\n<a href=\"http://pivotal.github.com/jasmine/\">Jasmine</a> framework.\nSee <a href=\"#!/guide/testing\">Unit Testing with Jasmine</a> for background information.</p>\n\n<h2 id='testing_controllers-section-2'>Testing refs</h2>\n\n<p>Suppose that the application contains the following View and Controller:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyApp.view.MyView', {\n    extend: '<a href=\"#!/api/Ext.panel.Panel\" rel=\"Ext.panel.Panel\" class=\"docClass\">Ext.panel.Panel</a>',\n    alias: 'widget.myview',\n\n    dockedItems: [{\n        xtype: 'button',\n        text: 'OK',\n        dock: 'bottom'\n    }, {\n        xtype: 'button',\n        text: 'Cancel',\n        dock: 'bottom'\n    }],\n\n    ...\n});\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyApp.controller.MyController', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    views: [\n        'MyView'\n    ],\n\n    refs: [{\n        ref: 'myView', selector: 'myview'\n    }, {\n        ref: 'myViewButtonOk',\n        selector: 'myview &gt; button[text=OK]'\n    }, {\n        ref: 'myViewButtonCancel',\n        selector: 'myview &gt; button[text=Cancel]'\n    }],\n\n    init: function() {\n        this.control({\n            'myview &gt; button': {\n                click: 'onMyViewButtonClick'\n            }\n        });\n    }\n\n    onMyViewButtonClick: function(button) {\n         ...\n    }\n});\n</code></pre>\n\n<p>Our test spec must call each possible selector defined for the Controller. It is\nnot necessary to call the <code>init</code> method on the test Controller for testing refs,\nsince the refs are created at construction time.</p>\n\n<p>Our test spec may look like this:</p>\n\n<pre><code>describe('MyController refs', function() {\n    var view = new MyApp.view.MyView({ renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>() }),\n        ctrl = new MyApp.controller.MyController();\n\n    it('should ref MyView objects', function() {\n        var cmp = ctrl.getMyView();\n\n        expect(cmp).toBeDefined();\n    });\n\n    it('should ref MyView button OK', function() {\n        var btn = ctrl.getMyViewButtonOk();\n\n        expect(btn.text).toBe('OK');\n    });\n\n    it('should ref MyView button Cancel', function() {\n        var btn = ctrl.getMyViewButtonCancel();\n\n        expect(btn.text).toBe('Cancel');\n    });\n});\n</code></pre>\n\n<p>This test suite is simplified to be easier to understand; it can be further\nshortened by auto-generating ref tests against the controller's refs array, etc.\nBut the central concept remains the same: we take an instantiated View and a\nController and run through all the possible refs, comparing returned objects to\nour expectations.</p>\n\n<h2 id='testing_controllers-section-3'>Testing control component selectors</h2>\n\n<p>Taking the same View/Controller setup, we can now add a spec to test component\nselectors:</p>\n\n<pre><code>describe('MyController component selectors', function() {\n    var view, ctrl;\n\n    beforeEach(function() {\n        view = new MyApp.view.MyView({ renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>() });\n        ctrl = new MyApp.controller.MyController();\n\n        spyOn(ctrl, 'onMyViewButtonClick');\n\n        ctrl.init();\n    });\n\n    afterEach(function() {\n        view.destroy();\n        view = ctrl = null;\n    });\n\n    it('should control MyView button click events', function() {\n        view.down('button[text=OK]').fireEvent('click');\n\n        expect(ctrl.onMyViewButtonClick).toHaveBeenCalled();\n    });\n});\n</code></pre>\n\n<p>Note the <code>ctrl.init()</code> call above; you do not have to do this in your\nproduction code because when you call <code><a href=\"#!/api/Ext-method-application\" rel=\"Ext-method-application\" class=\"docClass\">Ext.application</a>()</code> it will create\na new instance of <code><a href=\"#!/api/Ext.app.Application\" rel=\"Ext.app.Application\" class=\"docClass\">Ext.app.Application</a></code> class, which in turn will load and\ninitialize the Controllers. Typically it is not a good idea to instantiate\nthe Application in your unit tests, because it will load <em>all</em> Controllers\nand Views, thus negating the whole point of testing your Controllers in\nisolation.</p>\n\n<p>If you are using Jasmine's <code>spyOn</code> function as in the example above, you\nwill need to create the spies <em>before</em> the Controller is initialized, or\nthey will not work. The example above demonstrates using spies with manual\nController initialization, as well as recommended way to clean up the\nenvironment after running the tests.</p>\n\n<p>This approach may not be feasible for larger applications and bigger Views;\nin that case, it may be beneficial to create mockup components that simulate\nparts of the component layout without adhering strictly to visual design. In\nfact, the test View above may be seen as an example of such a mockup for a real\nworld View.</p>\n\n<h2 id='testing_controllers-section-4'>Testing event domain selectors</h2>\n\n<p><a href=\"#!/api/Ext.app.EventDomain\">Event domains</a> are a new concept introduced in\nExt JS 4.2; they allow passing information between application components\nwithout explicitly calling object methods. Remember that Controllers generally\nlisten for events and then execute the appropriate actions in response to those\nevents.</p>\n\n<p>To test the event domain selectors:</p>\n\n<ul>\n<li>Create a controller class that defines a function (called <code>onFooEvent</code> in\nthis example) to react to events passed between Controllers; use the <code>*</code>\nwildcard so that the selector matches any Controller.</li>\n<li>Initialize the controller instance</li>\n<li>Fire the <code>fooevent</code> event in the Controller instance to be tested.</li>\n<li>This executes the <code>onFooEvent</code> method with the supplied arguments.</li>\n</ul>\n\n\n<p>Sample code to define the <code>fooevent</code> handler function is:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyApp.controller.MyController', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    init: function() {\n        this.listen({\n            // This domain passes events between Controllers\n            controller: {\n                // This selector matches any Controller\n                '*': {\n                    fooevent: 'onFooEvent'\n                }\n            }\n        });\n    },\n\n    onFooEvent: function() {}\n});\n</code></pre>\n\n<p>After initializing the <code>MyController</code> instance, we can just fire <code>fooevent</code> in\nany Controller instance (including itself) to execute the <code>onFooEvent</code> method\nwith the supplied arguments.</p>\n\n<p>Sample code to test this configuration is:</p>\n\n<pre><code>describe('MyController event domain selectors', function() {\n    var ctrl;\n\n    beforeEach(function() {\n        ctrl = new MyApp.controller.MyController();\n\n        spyOn(ctrl, 'onFooEvent');\n\n        ctrl.init();\n    });\n\n    it('should listen to fooevent in controller domain', function() {\n        ctrl.fireEvent('fooevent');\n\n        expect(ctrl.onFooEvent).toHaveBeenCalled();\n    });\n});\n</code></pre>\n\n<p>Notice how we fired <code>fooevent</code> on the same Controller that is supposed to listen\nto this event? That is one of the side effects of how event domains work, and it\nis very useful for testing. However it does not help when we want to listen for\n<code>fooevent</code> to be fired from a particular Controller instead of from just any\nController. To handle this, we can rewrite the test suite to define <code>fooevent</code>\nspecifically for each controller:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyApp.controller.MyController', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    init: function() {\n        this.listen({\n            controller: {\n                '#MyOtherController': {\n                    fooevent: 'onMyOtherControllerFooEvent'\n                }\n            }\n        });\n    },\n\n    onMyOtherControllerFooEvent: function() {}\n});\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('MyApp.controller.MyOtherController', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    someMethod: function() {\n        this.fireEvent('fooevent');\n    }\n});\n</code></pre>\n\n<p>In this case we must mock the <code>MyOtherController</code> class in our test suite,\nto avoid instantiating it and loading its dependencies:</p>\n\n<pre><code>describe('MyController event domain selectors', function() {\n    var ctrl1, ctrl2;\n\n    beforeEach(function() {\n        ctrl1 = new MyApp.controller.MyController();\n        ctrl2 = new MyApp.controller.MyOtherController();\n\n        spyOn(ctrl1, 'onMyOtherControllerFooEvent');\n        ... // Create other spies here, too\n\n        ctrl1.init();\n        ctrl2.init();\n    });\n\n    it('should listen to fooevent from MyOtherController', function() {\n        // We do not execute MyOtherController.someMethod but fire fooevent\n        // directly, because in a real world Controller someMethod may do\n        // something useful besides just firing an event, and we only want\n        // to test the event domain selector\n        ctrl2.fireEvent('fooevent');\n\n        expect(ctrl1.onMyOtherControllerFooEvent).toHaveBeenCalled();\n    });\n});\n</code></pre>\n\n<p>This mockup works because the Controller's <code>id</code> defaults to the last part of its\nclass name, unless it is specifically overridden.</p>\n\n<p>Besides other Controllers' events, it is possible to <code>listen</code> to Stores',\n<a href=\"#!/api/Ext.direct.Manager\" rel=\"Ext.direct.Manager\" class=\"docClass\">Ext.Direct</a> Providers' and global events. See <a href=\"#!/api/Ext.app.Controller-method-listen\" rel=\"Ext.app.Controller-method-listen\" class=\"docClass\">Ext.app.Controller.listen</a>\nfor details about how to use event domains to test other elements of your\napplication; testing them is similar to testing the Controller's event domain.</p>\n","title":"Unit testing MVC Controllers"});